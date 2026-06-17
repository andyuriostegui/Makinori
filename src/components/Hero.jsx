import { useState, useEffect } from "react";
import { C, BtnTeal, BtnGhost } from "./tokens";
import { MascotaSushi } from "./Mascota";

const TOP_PEDIDOS = [
  { nombre: "Dragon Roll",        popularidad: 95, badge: "🔥 Casi agotado" },
  { nombre: "Sashimi Premium",    popularidad: 78, badge: null },
  { nombre: "Nigiri Omakase Set", popularidad: 61, badge: null },
];

function PopBar({ pct }) {
  return (
    <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: C.teal, borderRadius: 2, transition: "width 1s ease" }} />
    </div>
  );
}

function RightPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 1000); return () => clearInterval(t); }, []);
  const mins = 18 + (tick % 3 === 0 ? 1 : 0);

  return (
    <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Hero image */}
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: C.paper }}>
        <img src="/sushicomida.png" alt="Sushi Maki Nori"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(26,43,43,0.82)", backdropFilter: "blur(6px)",
          color: C.cream, borderRadius: 20, padding: "6px 12px",
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 600,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block",
            boxShadow: "0 0 0 2px rgba(74,222,128,0.4)", animation: "pulse 1.5s infinite" }} />
          EN VIVO · {mins} min espera
        </div>
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: C.teal, color: C.cream,
          fontFamily: "Noto Serif JP, serif", fontSize: 12,
          padding: "4px 12px", borderRadius: 20, fontWeight: 700,
        }}>おすすめ</div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(26,43,43,0.78))",
          padding: "24px 14px 12px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        }}>
          <div>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Philadelphia Roll</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.7)", margin: 0 }}>⭐⭐⭐⭐⭐ · 127 reseñas</p>
          </div>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16, fontWeight: 900, color: C.coral, margin: 0 }}>$100</p>
        </div>
      </div>

      {/* Lo más pedido */}
      <div style={{ background: C.paper, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: C.teal, margin: "0 0 10px" }}>
          🔥 Lo más pedido hoy
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {TOP_PEDIDOS.map((item, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700, color: C.ink }}>
                    {i + 1}. {item.nombre}
                  </span>
                  {item.badge && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.coral,
                      background: "rgba(232,145,92,0.14)", padding: "1px 6px", borderRadius: 4 }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: C.muted }}>{item.popularidad}%</span>
              </div>
              <PopBar pct={item.popularidad} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section style={{ paddingTop: 112, paddingBottom: 64, paddingInline: 16 }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Teal frame */}
        <div style={{ background: C.teal, borderRadius: 24, padding: 10 }}>
          <div style={{
            background: C.cream, borderRadius: 16,
            display: "flex", flexWrap: "wrap",
            alignItems: "center", gap: 40, padding: "56px 56px",
            minHeight: 520,
          }}>
            {/* Left: copy */}
            <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Brand badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: C.teal, color: C.cream,
                  borderRadius: "50%", width: 104, height: 104, flexShrink: 0,
                  fontFamily: "Noto Serif JP, serif", fontSize: "1.7rem", fontWeight: 900,
                }}>巻</div>
                <div>
                  <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: "1.4rem", fontWeight: 900, color: C.ink, lineHeight: 1, margin: 0 }}>まき のり</p>
                  <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 11, color: C.muted, margin: "4px 0 0" }}>Maki Nori · Iguala</p>
                </div>
                <MascotaSushi pose="feliz" size={72} style={{ marginLeft: "auto", flexShrink: 0 }} />
              </div>

              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, color: C.teal, margin: 0, fontFamily: "DM Sans, sans-serif" }}>
                Cocina Japonesa Boutique · Iguala, Guerrero
              </p>

              {/* THE headline */}
              <h1 style={{
                fontFamily: "DM Sans, sans-serif", fontWeight: 900,
                fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
                color: C.ink, lineHeight: 0.92,
                textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0,
              }}>
                Maki Nori<br/>
                <span style={{ color: C.teal }}>donde el</span><br/>
                sushi se<br/>
                <span style={{
                  color: C.coral,
                  WebkitTextStroke: `2px ${C.coral}`,
                  WebkitTextFillColor: "transparent",
                }}>hace arte</span>
              </h1>

              <div style={{ borderLeft: `3px solid ${C.teal}`, paddingLeft: 16, marginTop: 4 }}>
                <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>
                  おもてなし <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 400, color: C.muted }}>— Omotenashi</span>
                </p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6, margin: "4px 0 0", maxWidth: 320 }}>
                  Más que servicio: es la devoción de nuestro itamae por anticipar cada necesidad del comensal, creando una experiencia de armonía total.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                <BtnTeal href="#menu">Ver Menú →</BtnTeal>
                <BtnGhost href="#linktree">Síguenos</BtnGhost>
              </div>
            </div>

            {/* Right: image + top pedidos */}
            <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RightPanel />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }}>
          {[{ n: "+40", l: "Variedades" }, { n: "100%", l: "Fresco" }, { n: "10+", l: "Años de Arte" }].map(({ n, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "1.5rem", fontWeight: 900, color: C.ink, margin: 0 }}>{n}</p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}