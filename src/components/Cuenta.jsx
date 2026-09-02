import { useEffect, useState } from "react";
import { C } from "./tokens";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabase";
import { fetchPerfil, friendlyAuthError, saveMiPerfil } from "../lib/clientes";
import {
  Cancel01Icon,
  User02Icon,
  Logout01Icon,
  Location01Icon,
} from "hugeicons-react";

export function CuentaPanel() {
  const { cuentaOpen } = useAuth();
  if (!cuentaOpen) return null;
  return <CuentaDialog />;
}

function CuentaDialog() {
  const { user, perfil, setCuentaOpen, setPerfil, refreshPerfil } = useAuth();
  const [mode, setMode] = useState(user ? "perfil" : "entrar");
  const [form, setForm] = useState({
    email: user?.email || "",
    password: "",
    nombre: perfil?.nombre || "",
    tel: perfil?.tel || "",
    direccion: perfil?.direccion || "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setCuentaOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCuentaOpen]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const entrar = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    if (err) {
      setError(friendlyAuthError(err.message));
      setBusy(false);
      return;
    }
    const p = data.user ? await fetchPerfil(data.user.id) : null;
    if (p && !p.missingTable) {
      setPerfil(p);
      setForm((f) => ({
        ...f,
        password: "",
        nombre: p.nombre || f.nombre,
        tel: p.tel || f.tel,
        direccion: p.direccion || f.direccion,
      }));
    }
    setMode("perfil");
    setBusy(false);
  };

  const registrar = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    if (!form.nombre.trim()) { setError("Pon tu nombre."); return; }
    if (!form.tel.trim()) { setError("Pon tu WhatsApp para el pedido."); return; }
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { nombre: form.nombre.trim(), tel: form.tel.trim() } },
    });
    if (err) {
      setError(friendlyAuthError(err.message));
      setBusy(false);
      return;
    }
    if (data.user) {
      try {
        const saved = await saveMiPerfil(data.user.id, {
          nombre: form.nombre,
          tel: form.tel,
          direccion: form.direccion,
        });
        setPerfil(saved);
      } catch (saveErr) {
        if (!data.session) {
          setOk("Cuenta creada. Revisa tu correo para confirmar y luego entra.");
          setBusy(false);
          return;
        }
        setError(friendlyAuthError(saveErr.message));
      }
    }
    if (!data.session) setOk("Cuenta creada. Revisa tu correo para confirmar y luego entra.");
    else setMode("perfil");
    setBusy(false);
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setError("");
    setOk("");
    try {
      const saved = await saveMiPerfil(user.id, {
        nombre: form.nombre,
        tel: form.tel,
        direccion: form.direccion,
      });
      setPerfil(saved);
      setOk("Perfil guardado. Ya no tienes que volver a escribir tu dirección.");
      await refreshPerfil();
    } catch (err) {
      setError(friendlyAuthError(err.message));
    }
    setBusy(false);
  };

  const recuperar = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    if (!form.email.trim()) { setError("Escribe tu correo."); return; }
    setBusy(true);
    setError("");
    setOk("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
      redirectTo: `${window.location.origin}/recuperar`,
    });
    if (err) setError(friendlyAuthError(err.message));
    else setOk("Si el correo existe, te mandamos el enlace.");
    setBusy(false);
  };

  const salir = async () => {
    await supabase?.auth.signOut();
    setCuentaOpen(false);
  };

  return (
    <div className="pedido-shell cuenta-shell">
      <div className="pedido-backdrop" onClick={() => setCuentaOpen(false)} />
      <div role="dialog" aria-modal="true" aria-labelledby="cuenta-titulo" className="pedido-panel">
        <div className="pedido-header">
          <div className="pedido-handle" aria-hidden />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <User02Icon size={22} color={C.ink} />
              <div>
                <h3 id="cuenta-titulo" style={{ fontFamily: "Noto Sans JP, sans-serif", fontWeight: 900, fontSize: 18, margin: 0, color: C.ink }}>
                  {user ? "Tu perfil" : mode === "crear" ? "Crear perfil" : mode === "olvide" ? "Recuperar acceso" : "Entrar"}
                </h3>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>
                  {user
                    ? "Tus datos van al pedido. No los vuelves a escribir."
                    : mode === "olvide"
                      ? "Escribe tu correo y te mandamos el enlace."
                      : "Guarda tu dirección y pide más rápido."}
                </p>
              </div>
            </div>
            <button className="pedido-close" onClick={() => setCuentaOpen(false)} aria-label="Cerrar" style={{
              background: C.paper, border: "none", borderRadius: 8,
              width: 36, height: 36, cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cancel01Icon size={16} color={C.muted} />
            </button>
          </div>
        </div>

        <form className="pedido-body" onSubmit={user ? guardar : mode === "crear" ? registrar : mode === "olvide" ? recuperar : entrar}>
          {error && <p className="cuenta-alert">{error}</p>}
          {ok && <p className="cuenta-ok">{ok}</p>}

          {user ? (
            <>
              {perfil?.destacado && (
                <div className="cuenta-destacado">
                  Cliente destacado{Number(perfil.descuento) > 0 ? ` · ${Number(perfil.descuento)}% de descuento` : ""}
                </div>
              )}
              <Field label="Nombre" value={form.nombre} onChange={(v) => set("nombre", v)} autoComplete="name" />
              <Field label="WhatsApp" value={form.tel} onChange={(v) => set("tel", v)} type="tel" autoComplete="tel" placeholder="733…" />
              <Field
                label="Dirección para domicilio"
                value={form.direccion}
                onChange={(v) => set("direccion", v)}
                autoComplete="street-address"
                placeholder="Colonia, calle y referencias"
              />
              <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, color: C.muted, margin: 0, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <Location01Icon size={14} color={C.muted} />
                La próxima vez que pidas a domicilio, esto ya va lleno.
              </p>
            </>
          ) : mode === "crear" ? (
            <>
              <Field label="Nombre" value={form.nombre} onChange={(v) => set("nombre", v)} autoComplete="name" required />
              <Field label="WhatsApp" value={form.tel} onChange={(v) => set("tel", v)} type="tel" autoComplete="tel" required placeholder="733…" />
              <Field label="Dirección (opcional)" value={form.direccion} onChange={(v) => set("direccion", v)} autoComplete="street-address" placeholder="Colonia, calle y referencias" />
              <Field label="Correo" value={form.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" required />
              <Field label="Contraseña" value={form.password} onChange={(v) => set("password", v)} type="password" autoComplete="new-password" required />
            </>
          ) : mode === "olvide" ? (
            <Field label="Correo" value={form.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" required />
          ) : (
            <>
              <Field label="Correo" value={form.email} onChange={(v) => set("email", v)} type="email" autoComplete="email" required />
              <div>
                <Field label="Contraseña" value={form.password} onChange={(v) => set("password", v)} type="password" autoComplete="current-password" required />
                <button
                  type="button"
                  className="cuenta-olvide"
                  onClick={() => { setMode("olvide"); setError(""); setOk(""); }}
                >
                  Olvidé mi contraseña
                </button>
              </div>
            </>
          )}

          <button type="submit" disabled={busy} style={{
            width: "100%", background: C.teal, color: C.cream, border: "none",
            borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif", minHeight: 48,
          }}>
            {busy ? "Un momento…" : user ? "Guardar perfil" : mode === "crear" ? "Crear perfil" : mode === "olvide" ? "Enviar enlace" : "Entrar"}
          </button>

          {user ? (
            <button type="button" onClick={salir} style={{
              width: "100%", background: "transparent", color: C.muted, border: "none",
              padding: "12px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Noto Sans JP, sans-serif", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Logout01Icon size={14} color={C.muted} />
              Salir de mi cuenta
            </button>
          ) : (
            <div className="cuenta-switch">
              {mode === "olvide" && (
                <button type="button" onClick={() => { setMode("entrar"); setError(""); setOk(""); }}>Volver a entrar</button>
              )}
              {mode === "entrar" && (
                <button type="button" onClick={() => { setMode("crear"); setError(""); setOk(""); }}>Crear perfil</button>
              )}
              {mode === "crear" && (
                <button type="button" onClick={() => { setMode("entrar"); setError(""); setOk(""); }}>Ya tengo cuenta</button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", autoComplete, placeholder, required }) {
  return (
    <label className="cuenta-field">
      <span>{label}</span>
      <input
        className="pedido-input"
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
