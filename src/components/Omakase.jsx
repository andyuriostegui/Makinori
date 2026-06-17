import { useState } from "react";
import { C, BtnCoral } from "./tokens";
import { MascotaSushi } from "./Mascota";
import {
  HelpCircleIcon,
  Leaf01Icon,
  SparklesIcon,
} from "hugeicons-react";

const PILARES = [
  { n: "01", label: "No sabes qué pedir", sub: "El chef decide por ti",    Icon: HelpCircleIcon },
  { n: "02", label: "Selección del día",   sub: "Lo más fresco disponible", Icon: Leaf01Icon     },
  { n: "03", label: "Experiencia total",   sub: "Sorpresa en cada tiempo",  Icon: SparklesIcon   },
];

export default function Omakase() {
  const [hov, setHov] = useState(null);

  return (
    <section id="omakase" style={{
      background: C.ink, color: C.cream,
      padding: "100px 24px",
      fontFamily: "DM Sans, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        .omakase-chef { display: block; }
        @media (max-width: 900px) {
          .omakase-chef {
            height: auto !important;
            width: 100% !important;
            right: 0 !important;
            bottom: 0 !important;
            top: 0 !important;
            object-fit: cover;
            opacity: 0.12 !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
        }
      `}</style>

      {/* Chef de fondo (fondo negro = se funde con la sección) */}
      <img src="/chef.png" alt="Itamae Maki Nori" className="omakase-chef" style={{
        position: "absolute", right: 0, bottom: 0,
        height: "92%", width: "auto", opacity: 0.85,
        pointerEvents: "none", userSelect: "none",
        maskImage: "linear-gradient(to left, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to left, black 70%, transparent)",
      }} />

      {/* Kanji watermark */}
      <div aria-hidden style={{
        position: "absolute", right: -20, top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "Noto Serif JP, serif",
        fontSize: "clamp(180px, 22vw, 320px)",
        fontWeight: 900, color: "rgba(245,240,232,0.03)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>お任せ</div>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, background: `linear-gradient(90deg, ${C.teal}, transparent)`,
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ height: 1, width: 40, background: C.teal, display: "block" }} />
          <span style={{ fontFamily: "Noto Serif JP, serif", fontSize: 13, color: C.teal, letterSpacing: "0.18em" }}>お任せ</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            color: C.cream, textTransform: "uppercase",
            letterSpacing: "-0.03em", lineHeight: 0.9, margin: 0,
          }}>Omakase</h2>
          <MascotaSushi pose="feliz" size={64} style={{ marginBottom: -4 }} />
        </div>

        <p style={{
          fontFamily: "Noto Serif JP, serif",
          fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
          color: "rgba(245,240,232,0.45)",
          margin: "0 0 40px", fontStyle: "italic",
        }}>「Lo dejo en tus manos」</p>

        <div style={{
          background: "rgba(245,240,232,0.04)",
          border: "1px solid rgba(245,240,232,0.08)",
          borderLeft: `3px solid ${C.teal}`,
          borderRadius: "0 12px 12px 0",
          padding: "28px 32px", marginBottom: 48, maxWidth: 560,
        }}>
          <p style={{ fontSize: 16, color: "rgba(245,240,232,0.85)", lineHeight: 1.9, margin: "0 0 16px" }}>
            ¿No sabes qué pedir? Perfectamente. Eso es exactamente para lo que existe el <em style={{ color: C.teal }}>omakase</em>.
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,240,232,0.55)", lineHeight: 1.9, margin: 0 }}>
            Solo dinos tus preferencias o restricciones — si te gustan los mariscos, si eres vegetariano, si quieres algo picante — y nuestro chef armará una selección especial para ti con lo mejor del día. Sin presión, sin carta, sin indecisión.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 52, maxWidth: 560 }}>
          {PILARES.map(({ n, label, sub, Icon }) => (
            <div key={n}
              onMouseEnter={() => setHov(n)}
              onMouseLeave={() => setHov(null)}
              style={{
                borderTop: `2px solid ${hov === n ? C.teal : "rgba(245,240,232,0.1)"}`,
                paddingTop: 20, paddingBottom: 4,
                transition: "border-color 0.2s",
              }}>
              <div style={{ marginBottom: 10 }}>
                <Icon size={28} color={hov === n ? C.teal : "rgba(245,240,232,0.5)"} />
              </div>
              <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 10, color: C.teal, margin: "0 0 6px", letterSpacing: "0.1em" }}>{n}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.cream, margin: "0 0 4px" }}>{label}</p>
              <p style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <BtnCoral href="#linktree">Quiero que el chef elija por mí →</BtnCoral>
          <p style={{ fontSize: 12, color: "rgba(245,240,232,0.35)", margin: 0, fontStyle: "italic" }}>
            Escríbenos y lo armamos
          </p>
        </div>
      </div>
    </section>
  );
}