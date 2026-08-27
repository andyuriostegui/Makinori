import { useState } from "react";
import { C, FONT, Section, Container, SectionTitle } from "./tokens";
import { PRODUCTOS } from "./data";
import { ILU_MAP } from "./illustrations";
import { BtnAgregar } from "./Carrito";

function ProductCard({ producto }) {
  const { tag, tagDark, nombre, jp, precio, desc, badges, badgePicante, ilu, foto } = producto;
  const [hov, setHov] = useState(false);
  const Ilu = ILU_MAP[ilu];
  const precioNum = parseInt(precio.replace("$", ""));

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.washi, overflow: "hidden",
        border: `1px solid ${hov ? C.gold : C.border}`,
        fontFamily: FONT.sans,
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 18px 40px rgba(22,19,17,0.1)" : "none",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
      }}
    >
      <div style={{ height: 210, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {foto
          ? <img src={foto} alt={nombre} style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hov ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.5s ease",
            }} />
          : Ilu && <Ilu />
        }
        {tag && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: tagDark ? C.ink : C.shu,
            color: C.cream, fontSize: 9, fontWeight: 700,
            padding: "4px 10px", letterSpacing: "0.12em",
            fontFamily: FONT.sans,
          }}>{tag}</span>
        )}
      </div>

      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, margin: 0, fontFamily: FONT.serif }}>{nombre}</h3>
            <p style={{ fontFamily: FONT.jp, fontSize: 11, color: C.teal, margin: "4px 0 0", letterSpacing: "0.08em" }}>{jp}</p>
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: C.shu, margin: 0, flexShrink: 0, marginLeft: 8, fontFamily: FONT.serif }}>{precio}</p>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0 }}>{desc}</p>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {badges.map((b, i) => (
            <span key={i} style={{
              background: badgePicante && i === 0 ? "rgba(179,58,43,0.1)" : C.paper,
              color: badgePicante && i === 0 ? C.shu : C.ink,
              fontSize: 10, padding: "3px 8px", fontWeight: 500, letterSpacing: "0.04em",
            }}>{b}</span>
          ))}
        </div>
        <BtnAgregar producto={{ id: producto.id, nombre, precio: precioNum, foto }} />
      </div>
    </div>
  );
}

export default function Productos() {
  return (
    <Section id="productos" style={{ position: "relative", overflow: "hidden", background: C.cream }}>
      <div className="pattern-asanoha" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />
      <Container style={{ position: "relative" }}>
        <SectionTitle kicker="おすすめ" jp="今日のおすすめ">
          Nuestros <span style={{ color: C.teal, fontStyle: "italic" }}>favoritos</span>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 22 }}>
          {PRODUCTOS.map(p => <ProductCard key={p.id} producto={p} />)}
        </div>
      </Container>
    </Section>
  );
}
