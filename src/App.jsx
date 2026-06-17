// ─── App.jsx — reemplaza tu App.jsx con esto ─────────────────
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import Menu from "./components/Menu";
import Omakase from "./components/Omakase";
import Resenas from "./components/Resenas";
import Galeria from "./components/Galeria";
import Linktree from "./components/Linktree";
import Ubicacion from "./components/Ubicacion";
import Footer from "./components/Footer";
import WAFloat from "./components/WAFloat";
import { CarritoCtx, useCarrito, CarritoBtn, CarritoPanel } from "./components/Carrito";

export default function App() {
  const carrito = useCarrito();

  return (
    <CarritoCtx.Provider value={carrito}>
      <Navbar />
      <Hero />
      <Productos />
      <Menu />
      <Omakase />
      <Resenas />
      <Galeria />
      <Linktree />
      <Ubicacion />
      <Footer />
      <WAFloat />
      <CarritoBtn />
      <CarritoPanel />
    </CarritoCtx.Provider>
  );
}