import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";
import { MENU_CATS } from "./data";
import { useCarritoCtx } from "./Carrito";

const CAT_LABELS = { frescos: "Frescos", empanizados: "Empanizados", ramen: "Ramen", bebidas: "Bebidas" };

function ItemRow({ item, index, total }) {
  const { items, agregar, quitar } = useCarritoCtx();
  const precioNum = parseInt(item.precio.replace("$", ""));
  const enCarrito = items.find(i => i.nombre === item.nombre);
  const qty = enCarrito?.qty || 0;
  const [pop, setPop] = useState(false);

  const handleAgregar = () => {
    agregar({ id: item.nombre, nombre: item.nombre, precio: precioNum, foto: null });
    setPop(true);
    setTimeout(() => setPop(false), 300);
  };

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0",
      borderBottom: index < total - 1 ? `1px solid ${C.border}` : "none",
      fontFamily: "DM Sans, sans-serif",
      gap: 12,
    }}>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>{item.nombre}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{item.desc}</p>
      </div>

      {/* Precio + controles */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0 }}>{item.precio}</p>

        {qty === 0 ? (
          <button onClick={handleAgregar} style={{
            width: 32, height: 32, borderRadius: 8,
            background: pop ? C.ink : C.teal,
            border: "none", color: C.cream,
            fontSize: 18, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: pop ? "scale(0.88)" : "scale(1)",
            transition: "all 0.15s",
            flexShrink: 0,
          }}>+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => quitar(item.nombre)} style={{
              width: 28, height: 28, borderRadius: 6,
              border: `1.5px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={handleAgregar} style={{
              width: 28, height: 28, borderRadius: 6,
              border: "none", background: C.teal,
              color: C.cream, fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transform: pop ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.15s",
            }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Menu() {
  const [cat, setCat] = useState("frescos");
  const data = MENU_CATS[cat];

  return (
    <Section id="menu" bg={C.paper} style={{ position: "relative", overflow: "hidden" }}>
      <style>{`
        .menu-side { display: block; }
        @media (max-width: 1024px) { .menu-side { display: none !important; } }
      `}</style>

      {/* Imagen lateral izquierda — ramen */}
      <img src="/ramen.png" alt="Ramen Maki Nori" className="menu-side" style={{
        position: "absolute", left: -40, top: "50%", transform: "translateY(-50%)",
        width: 400, height: "auto", opacity: 1, pointerEvents: "none",
        userSelect: "none",
      }} />

      {/* Imagen lateral derecha — nigiri */}
      <img src="/sushicomida.png" alt="Sushi Maki Nori" className="menu-side" style={{
        position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)",
        width: 380, height: "auto", opacity: 1, pointerEvents: "none",
        userSelect: "none",
      }} />

      <Container max={800} style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionTag>お品書き</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Menú <span style={{ color: C.teal }}>Completo</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 48 }}>
          {Object.keys(CAT_LABELS).map(c => (
            <TabBtn key={c} active={cat === c} onClick={() => setCat(c)}>
              {CAT_LABELS[c]}
            </TabBtn>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
            <span style={{ fontFamily: "Noto Serif JP, serif", fontSize: 12, color: C.teal, letterSpacing: "0.15em" }}>{data.jp}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <p style={{ fontSize: 10, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontFamily: "DM Sans, sans-serif" }}>{data.sub}</p>
        </div>

        <div style={{ background: C.cream, borderRadius: 16, padding: "8px 28px", border: `1px solid ${C.border}` }}>
          {data.items.map((item, i) => (
            <ItemRow key={i} item={item} index={i} total={data.items.length} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 20px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
      border: `1.5px solid ${active ? C.ink : C.border}`,
      background: active ? C.ink : "transparent",
      color: active ? C.cream : C.muted,
      fontFamily: "DM Sans, sans-serif",
      transition: "all 0.2s",
    }}>{children}</button>
  );
}