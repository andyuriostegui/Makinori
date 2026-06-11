import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";
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
        background: C.cream, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${C.border}`, fontFamily: "DM Sans, sans-serif",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov ? "0 16px 40px rgba(26,26,24,0.12)" : "none",
        transition: "transform 0.25s, box-shadow 0.25s",
        cursor: "default",
      }}
    >
      {/* Illustration / foto */}
      <div style={{ height: 176, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {foto
          ? <img src={foto} alt={nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : Ilu && <Ilu />
        }
        {tag && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            background: tagDark ? C.ink : C.coral,
            color: C.cream, fontSize: 9, fontWeight: 700,
            padding: "3px 8px", borderRadius: 20,
          }}>{tag}</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>{nombre}</h3>
            <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 10, color: C.muted, margin: 0 }}>{jp}</p>
          </div>
          <p style={{ fontSize: 18, fontWeight: 900, color: C.coral, margin: 0, flexShrink: 0, marginLeft: 8 }}>{precio}</p>
        </div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {badges.map((b, i) => (
            <span key={i} style={{
              background: badgePicante && i === 0 ? "rgba(232,84,58,0.1)" : C.paper,
              color: badgePicante && i === 0 ? C.coral : C.ink,
              fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 500,
            }}>{b}</span>
          ))}
        </div>

        {/* Botón carrito */}
        <BtnAgregar producto={{ id: producto.id, nombre, precio: precioNum, foto }} />
      </div>
    </div>
  );
}

export default function Productos() {
  return (
    <Section id="productos">
      <Container>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <SectionTag>Recomendados</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Nuestros <span style={{ color: C.coral }}>Favoritos</span>
          </h2>
        </div>

        <div style={{
          maxWidth: 680, margin: "0 auto 56px",
          display: "flex", alignItems: "flex-start", gap: 24,
          background: C.paper, borderRadius: 12, padding: "24px 28px",
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 28, fontWeight: 900, color: C.ink, margin: 0, lineHeight: 1 }}>侘寂</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: C.coral, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", margin: "4px 0 0" }}>Wabi-sabi</p>
          </div>
          <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 24 }}>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: C.ink, fontWeight: 600, margin: "0 0 4px" }}>La belleza de lo imperfecto</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
              Cada pieza sale de nuestras manos con una intención, no con una plantilla. La imprecisión natural de un rollo hecho a mano es exactamente lo que lo hace único. Simplicidad, autenticidad, precisión artesanal.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {PRODUCTOS.map(p => <ProductCard key={p.id} producto={p} />)}
        </div>
      </Container>
    </Section>
  );
}