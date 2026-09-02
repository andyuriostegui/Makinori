import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { markRecovery, supabase } from "../lib/supabase";
import { cambiarPassword } from "../lib/clientes";

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
  markRecovery(false);
  window.location.assign("/");
}

export default function Recuperar() {
  const { session, isRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(linkError());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return undefined;
    const t = window.setTimeout(goHome, 1800);
    return () => window.clearTimeout(t);
  }, [done]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await cambiarPassword(password, confirm);
      markRecovery(false);
      setDone(true);
    } catch (err) {
      setError(err.message || "No se pudo guardar.");
    }
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

  const waiting = session === undefined;
  const canReset = Boolean(session && !done);

  return (
    <div className="recuperar-page pattern-seigaiha-dark">
      {waiting ? (
        <div className="recuperar-card">
          <span className="recuperar-mark">Maki Nori</span>
          <p style={{ color: "#0e3a42" }}>Cargando…</p>
        </div>
      ) : canReset ? (
        <form className="recuperar-card" onSubmit={onSubmit}>
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Nueva contraseña</h1>
          <p>
            {isRecovery
              ? "Elige una contraseña nueva. No entras a tu perfil hasta guardarla."
              : "Elige una contraseña nueva para tu perfil."}
          </p>
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
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </form>
      ) : done ? (
        <div className="recuperar-card">
          <span className="recuperar-mark">Maki Nori</span>
          <h1>Contraseña actualizada</h1>
          <p className="cuenta-ok">Contraseña actualizada. Sigues dentro de tu cuenta.</p>
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
