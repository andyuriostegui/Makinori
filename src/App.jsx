// ─── App.jsx — reemplaza tu App.jsx con esto ─────────────────
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/Productos";
import Menu from "./components/Menu";
import Omakase from "./components/Omakase";
import Reserva from "./components/Reserva";
import Ubicacion from "./components/Ubicacion";
import Footer from "./components/Footer";
import WAFloat from "./components/WAFloat";
import Resenas from "./components/Resenas";
import Galeria from "./components/Galeria";
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
      <Reserva />
      <Ubicacion />
      <Footer />
      <WAFloat />
      <CarritoBtn />
      <CarritoPanel />
    </CarritoCtx.Provider>
  );
}