import { createContext, useContext, useEffect, useState } from "react";
import { recoveryLinkPresent, supabase } from "../lib/supabase";
import { fetchPerfil, touchLastSeen } from "../lib/clientes";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(supabase ? undefined : null);
  const [perfil, setPerfil] = useState(null);
  const [perfilReady, setPerfilReady] = useState(!supabase);
  const [cuentaOpen, setCuentaOpen] = useState(false);
  const [isRecovery, setIsRecovery] = useState(recoveryLinkPresent);

  const loadPerfil = async (sess) => {
    if (!sess?.user) {
      setPerfil(null);
      setPerfilReady(true);
      return;
    }
    const next = await fetchPerfil(sess.user.id);
    setPerfil(next);
    setPerfilReady(true);
    if (next && !next.missingTable) touchLastSeen(sess.user.id);
  };

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      loadPerfil(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
      setSession(s);
      loadPerfil(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refreshPerfil = async () => {
    if (session) await loadPerfil(session);
  };

  const value = {
    session,
    user: session?.user || null,
    perfil,
    setPerfil,
    loading: session === undefined || (!!session && !perfilReady),
    cuentaOpen,
    setCuentaOpen,
    refreshPerfil,
    isStaff: perfil?.rol === "admin",
    isRecovery,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() { // eslint-disable-line react-refresh/only-export-components
  return useContext(AuthCtx) || {
    session: null,
    user: null,
    perfil: null,
    setPerfil: () => {},
    loading: false,
    cuentaOpen: false,
    setCuentaOpen: () => {},
    refreshPerfil: async () => {},
    isStaff: false,
    isRecovery: false,
  };
}
