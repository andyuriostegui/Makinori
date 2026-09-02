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
import { AuthProvider } from "./auth/AuthContext";
import { CuentaPanel } from "./components/Cuenta";
import Admin from "./admin/Admin";

function isAdminPath() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.toLowerCase();
  return (
    path.startsWith("/admin") ||
    path.startsWith("/auth") ||
    path.startsWith("/login")
  );
}

export default function App() {
  return (
    <AuthProvider>
      {isAdminPath() ? <Admin /> : <PublicSite />}
    </AuthProvider>
  );
}

function PublicSite() {
  const carrito = useCarrito();

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
