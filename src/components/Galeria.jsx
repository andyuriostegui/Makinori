import { useState } from "react";
import { C, FONT, Section, SectionTitle } from "./tokens";
import { GALERIA_FOTOS } from "./data";

const IGO_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function Galeria() {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="galeria" style={{ background: C.ink, overflow: "hidden", padding: 0 }}>
      <div className="pattern-seigaiha-dark" style={{ padding: "88px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <SectionTitle kicker="写真" jp="ギャラリー" light>
            Nuestros <span style={{ color: C.gold, fontStyle: "italic" }}>rolls</span>
          </SectionTitle>

          <div style={{ textAlign: "center", marginTop: -36, marginBottom: 48 }}>
            <a
              href="https://www.instagram.com/sushi.makinori/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: "rgba(244,239,230,0.45)",
                textDecoration: "none", fontFamily: FONT.sans,
                fontSize: 13, fontWeight: 500, transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(244,239,230,0.45)"}
            >
              {IGO_SVG}
              @sushi.makinori
            </a>
          </div>

          <div className="galeria-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "180px",
            gap: 10,
          }}>
            {GALERIA_FOTOS.map((foto) => (
              <button
                type="button"
                key={foto.src}
                onClick={() => setSelected(foto)}
                className={foto.span === 2 ? "span-2" : ""}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  padding: 0,
                  width: "100%",
                  height: "100%",
                  border: `1px solid rgba(196,163,106,0.22)`,
                  overflow: "hidden",
                  background: C.inkSoft,
                  gridColumn: foto.span === 2 ? "span 2" : "span 1",
                  gridRow: foto.span === 2 ? "span 2" : "span 1",
                }}
              >
                <img
                  src={foto.src}
                  alt={foto.alt}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    transition: "transform 0.6s ease, filter 0.4s",
                    filter: "saturate(0.92)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.filter = "saturate(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "saturate(0.92)"; }}
                />
                <span style={{
                  position: "absolute", bottom: 10, left: 10,
                  fontFamily: FONT.sans, fontSize: 11, fontWeight: 500,
                  color: "#fff", letterSpacing: "0.06em",
                  textShadow: "0 2px 10px rgba(0,0,0,0.7)",
                  pointerEvents: "none",
                }}>
                  {foto.alt}
                </span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <a
              href="https://www.instagram.com/sushi.makinori/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "transparent",
                color: C.cream,
                border: `1px solid ${C.gold}`,
                padding: "12px 28px", borderRadius: 2,
                textDecoration: "none", fontFamily: FONT.sans,
                fontSize: 12, fontWeight: 600, letterSpacing: "0.16em",
                textTransform: "uppercase",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.cream; }}
            >
              {IGO_SVG}
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(22,19,17,0.94)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "transparent", border: `1px solid ${C.gold}`,
              color: C.gold, width: 40, height: 40, borderRadius: "50%",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            &#x2715;
          </button>
          <div style={{ position: "relative", display: "inline-block", maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.src}
              alt={selected.alt}
              style={{
                maxWidth: "86vw", maxHeight: "80vh",
                objectFit: "contain", display: "block",
                border: `1px solid ${C.gold}`,
              }}
            />
            <p style={{
              textAlign: "center", margin: "14px 0 0",
              fontFamily: FONT.serif, fontSize: 16, color: C.cream, letterSpacing: "0.08em",
            }}>
              {selected.alt}
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}
