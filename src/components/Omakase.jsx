import { useState } from "react";
import { C, BtnCoral } from "./tokens";

const PILARES = [
  { n: "01", label: "No sabes qué pedir", sub: "El chef decide por ti", icon: "🤔" },
  { n: "02", label: "Selección del día",   sub: "Lo más fresco disponible", icon: "🌿" },
  { n: "03", label: "Experiencia total",   sub: "Sorpresa en cada tiempo", icon: "✨" },
];

export default function Omakase() {
  const [hov, setHov] = useState(null);

  return (
    <section style={{
      background: C.ink, color: C.cream,
      padding: "100px 24px",
      fontFamily: "DM Sans, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Kanji watermark */}
      <div aria-hidden style={{
        position: "absolute", right: -20, top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "Noto Serif JP, serif",
        fontSize: "clamp(180px, 22vw, 320px)",
        fontWeight: 900, color: "rgba(245,240,232,0.03)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>お任せ</div>

      {/* Coral accent line top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, background: `linear-gradient(90deg, ${C.coral}, transparent)`,
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ height: 1, width: 40, background: C.coral, display: "block" }} />
          <span style={{ fontFamily: "Noto Serif JP, serif", fontSize: 13, color: C.coral, letterSpacing: "0.18em" }}>お任せ</span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontWeight: 900, fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          color: C.cream, textTransform: "uppercase",
          letterSpacing: "-0.03em", lineHeight: 0.9, margin: "0 0 12px",
        }}>Omakase</h2>

        <p style={{
          fontFamily: "Noto Serif JP, serif",
          fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
          color: "rgba(245,240,232,0.45)",
          margin: "0 0 40px", fontStyle: "italic",
        }}>「Lo dejo en tus manos」</p>

        {/* Main description — full width */}
        <div style={{
          background: "rgba(245,240,232,0.04)",
          border: "1px solid rgba(245,240,232,0.08)",
          borderLeft: `3px solid ${C.coral}`,
          borderRadius: "0 12px 12px 0",
          padding: "28px 32px",
          marginBottom: 48,
          maxWidth: 640,
        }}>
          <p style={{ fontSize: 16, color: "rgba(245,240,232,0.85)", lineHeight: 1.9, margin: "0 0 16px" }}>
            ¿No sabes qué pedir? Perfectamente. Eso es exactamente para lo que existe el <em style={{ color: C.coral }}>omakase</em>.
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,240,232,0.55)", lineHeight: 1.9, margin: 0 }}>
            Solo dinos tus preferencias o restricciones — si te gustan los mariscos, si eres vegetariano, si quieres algo picante — y nuestro chef armará una selección especial para ti con lo mejor del día. Sin presión, sin carta, sin indecisión.
          </p>
        </div>

        {/* Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 52 }}>
          {PILARES.map(({ n, label, sub, icon }) => (
            <div key={n}
              onMouseEnter={() => setHov(n)}
              onMouseLeave={() => setHov(null)}
              style={{
                borderTop: `2px solid ${hov === n ? C.coral : "rgba(245,240,232,0.1)"}`,
                paddingTop: 20, paddingBottom: 4,
                transition: "border-color 0.2s",
              }}>
              <p style={{ fontSize: 28, margin: "0 0 10px" }}>{icon}</p>
              <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 10, color: C.coral, margin: "0 0 6px", letterSpacing: "0.1em" }}>{n}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>{label}</p>
              <p style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* CTA + note */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <BtnCoral href="#reserva">Quiero que el chef elija por mí →</BtnCoral>
          <p style={{ fontSize: 12, color: "rgba(245,240,232,0.35)", margin: 0, fontStyle: "italic" }}>
            Menciónalo en tu reserva y listo
          </p>
        </div>

      </div>
    </section>
  );
}