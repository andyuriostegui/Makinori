import { useState } from "react";
import { C, FONT, Section, Container, SectionTitle } from "./tokens";
import { MENU_CATS, SNACKS } from "./data";
import { useCarritoCtx } from "./Carrito";

const CAT_LABELS = {
  frescos:     "Frescos",
  empanizados: "Empanizados",
  ramen:       "Ramen",
  snacks:      "Snacks",
  bebidas:     "Bebidas",
};

const SNACKS_META = {
  jp: "おつまみ",
  sub: "Botanitas y entradas · Para compartir o para ti solo",
};

function ItemRow({ item, index, total, catKey }) {
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
      fontFamily: FONT.sans,
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: 0 }}>{item.nombre}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{item.desc}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 900, color: C.ink, margin: 0 }}>{item.precio}</p>

        {qty === 0 ? (
          <button onClick={handleAgregar} style={{
            width: 32, height: 32, borderRadius: 2,
            background: pop ? C.ink : C.teal,
            border: "none", color: C.cream,
            fontSize: 18, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: pop ? "scale(0.88)" : "scale(1)",
            transition: "all 0.15s", flexShrink: 0,
          }}>+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => quitar(item.nombre)} style={{
              width: 28, height: 28, borderRadius: 2,
              border: `1.5px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={handleAgregar} style={{
              width: 28, height: 28, borderRadius: 2,
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

  const isSnacks = cat === "snacks";
  const data = isSnacks
    ? { ...SNACKS_META, items: SNACKS }
    : MENU_CATS[cat];

  return (
    <Section id="menu" bg={C.paper} style={{ position: "relative", overflow: "hidden" }}>
      <div className="pattern-seigaiha" style={{ position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none" }} />

      <Container max={760} style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle kicker="お品書き" jp="メニュー">
          Menú <span style={{ color: C.teal, fontStyle: "italic" }}>completo</span>
        </SectionTitle>

        {/* Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 48 }}>
          {Object.keys(CAT_LABELS).map(c => (
            <TabBtn key={c} active={cat === c} onClick={() => setCat(c)}>
              {CAT_LABELS[c]}
            </TabBtn>
          ))}
        </div>

        {/* Subtítulo categoría */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
            <span style={{ fontFamily: FONT.jp, fontSize: 13, color: C.teal, letterSpacing: "0.2em" }}>{data.jp}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <p style={{ fontSize: 10, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0, fontFamily: FONT.sans }}>{data.sub}</p>
        </div>

        {/* Lista */}
        <div style={{ background: C.washi, padding: "8px 28px", border: `1px solid ${C.border}` }}>
          {data.items.map((item, i) => (
            <ItemRow key={i} item={item} index={i} total={data.items.length} catKey={cat} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 18px", borderRadius: 2, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer",
      border: `1px solid ${active ? C.ink : C.border}`,
      background: active ? C.ink : "transparent",
      color: active ? C.cream : C.muted,
      fontFamily: FONT.sans,
      transition: "all 0.2s",
    }}>{children}</button>
  );
}