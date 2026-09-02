import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";
import { friendlyAuthError } from "../lib/clientes";

function linkError() {
  if (typeof window === "undefined") return "";
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const code = query.get("error_code") || hash.get("error_code") || "";
  const desc = query.get("error_description") || query.get("error") || hash.get("error_description") || hash.get("error") || "";
  if (code.includes("otp_expired") || /expired|caduc/i.test(desc)) {
    return "El enlace ya caducó. Pide uno nuevo desde Entrar.";
  }
  return desc ? decodeURIComponent(desc.replace(/\+/g, " ")) : "";
}

function goHome() {
  window.location.assign("/");
}

export default function Recuperar() {
  const { session, loading, isRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(linkError());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return undefined;
    const t = window.setTimeout(goHome, 1600);
    return () => window.clearTimeout(t);
  }, [done]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(friendlyAuthError(err.message));
      setBusy(false);
      return;
    }
    setDone(true);
    setBusy(false);
  };

  if (!supabase) {
    return (
      <div className="recuperar-page pattern-seigaiha-dark">
        <div className="recuperar-card">
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Falta conectar</h1>
          <p>Aún no está ligada la base. Revisa el archivo .env.local.</p>
        </div>
      </div>
    );
  }

  const waiting = loading || session === undefined;
  const canReset = Boolean(session && isRecovery && !done);

  return (
    <div className="recuperar-page pattern-seigaiha-dark">
      {waiting ? (
        <div className="recuperar-card">
          <p style={{ color: "#0e3a42" }}>Cargando…</p>
        </div>
      ) : canReset ? (
        <form className="recuperar-card" onSubmit={onSubmit}>
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Nueva contraseña</h1>
          <p>Elige una contraseña nueva para tu perfil.</p>
          {error && <p className="cuenta-alert">{error}</p>}
          <label className="recuperar-field">
            <span>Nueva contraseña</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <label className="recuperar-field">
            <span>Confirmar</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </label>
          <button className="recuperar-btn" disabled={busy}>
            {busy ? "Guardando…" : "Guardar contraseña"}
          </button>
        </form>
      ) : done ? (
        <div className="recuperar-card">
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Listo</h1>
          <p className="cuenta-ok">Listo, ya puedes entrar</p>
          <button type="button" className="recuperar-btn" onClick={goHome}>
            Ir al menú
          </button>
        </div>
      ) : (
        <div className="recuperar-card">
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Recuperar acceso</h1>
          <p>
            {error || "Abre el enlace que te mandamos al correo. Si ya caducó, pide uno nuevo desde Entrar."}
          </p>
          <button type="button" className="recuperar-btn" onClick={goHome}>
            Ir al menú
          </button>
        </div>
      )}
    </div>
  );
}
