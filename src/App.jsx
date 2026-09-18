import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import Menu from "./components/Menu";
import ComoPedir from "./components/ComoPedir";
import Omakase from "./components/Omakase";
import Resenas from "./components/Resenas";
import Galeria from "./components/Galeria";
import Ubicacion from "./components/Ubicacion";
import Faq from "./components/Faq";
import Linktree from "./components/Linktree";
import Footer from "./components/Footer";
import WAFloat from "./components/WAFloat";
import { CarritoCtx, useCarrito, CarritoBtn, CarritoPanel } from "./components/Carrito";
import { CatalogProvider } from "./catalog/CatalogContext";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Recuperar from "./auth/Recuperar";
import { CuentaPanel } from "./components/Cuenta";
import Admin from "./admin/Admin";
import { registrarVisita } from "./lib/visitas";

function pathName() {
  if (typeof window === "undefined") return "";
  return window.location.pathname.toLowerCase();
}

function isAdminPath() {
  const path = pathName();
  return (
    path.startsWith("/admin") ||
    path.startsWith("/auth") ||
    path.startsWith("/login")
  );
}

function isRecuperarPath() {
  return pathName().startsWith("/recuperar");
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}

function Shell() {
  const { isRecovery } = useAuth();
  if (isRecovery || isRecuperarPath()) return <Recuperar />;
  if (isAdminPath()) return <Admin />;
  return <PublicSite />;
}

function PublicSite() {
  const carrito = useCarrito();
  const { loading, isStaff } = useAuth();

  useEffect(() => {
    if (loading || isStaff) return undefined;
    const run = () => { registrarVisita(); };
    if (typeof document !== "undefined" && document.prerendering) {
      document.addEventListener("prerenderingchange", run, { once: true });
      return () => document.removeEventListener("prerenderingchange", run);
    }
    run();
    return undefined;
  }, [loading, isStaff]);

  return (
    <CatalogProvider>
      <CarritoCtx.Provider value={carrito}>
        <Navbar />
        <Hero />
        <Productos />
        <Menu />
        <ComoPedir />
        <Omakase />
        <Resenas />
        <Galeria />
        <Ubicacion />
        <Faq />
        <Linktree />
        <Footer />
        <WAFloat />
        <CarritoBtn />
        <CarritoPanel />
        <CuentaPanel />
      </CarritoCtx.Provider>
    </CatalogProvider>
  );
}
