import { useState } from "react";
import { C, SectionTag, Section } from "./tokens";

const FOTOS = [
  { src: "/maki1.jpeg",  alt: "Sushi Maki Nori" },
  { src: "/maki2.jpeg",  alt: "Rolls frescos"   },
  { src: "/maki3.jpeg",  alt: "Roll especial"   },
  { src: "/maki4.jpeg",  alt: "Snow Roll"        },
  { src: "/maki5.jpeg",  alt: "Roll del chef"   },
  { src: "/maki6.jpeg",  alt: "Sushi artesanal" },
  { src: "/maki7.jpeg",  alt: "Roll empanizado" },
  { src: "/maki8.jpeg",  alt: "Combinación"     },
  { src: "/maki9.jpeg",  alt: "Volcano Roll"    },
  { src: "/maki10.jpeg", alt: "Ramen especial"  },
  { src: "/maki11.jpeg", alt: "Mogu Mogu"       },
  { src: "/sushi1.png",  alt: "Philadelphia Roll" },
  { src: "/sushi2.png",  alt: "Dragon Roll"     },
];

export default function Galeria() {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="galeria" style={{ background: C.ink, overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionTag light>Instagram</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)",
            color: C.cream, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Nuestros <span style={{ color: C.coral }}>Rolls</span>
          </h2>
          <a href="https://www.instagram.com/sushi.makinori/" target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 16, color: "rgba(245,240,232,0.5)",
              textDecoration: "none", fontFamily: "DM Sans, sans-serif",
              fontSize: 13, fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.coral}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,232,0.5)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            @sushi.makinori
          </a>
        </div>

        {/* Grid masonry-style */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 8,
        }}>
          {FOTOS.map((foto, i) => (
            <div key={i}
              onClick={() => setSelected(foto)}
              style={{
                position: "relative", overflow: "hidden",
                borderRadius: 8, cursor: "pointer",
                aspectRatio: i % 5 === 0 ? "1/1.3" : "1/1",
                background: C.paper,
              }}
            >
              <img src={foto.src} alt={foto.alt} style={{
                width: "100%", height: "100%", objectFit: "cover",
                display: "block", transition: "transform 0.4s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
              {/* Overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(26,26,24,0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,26,24,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,26,24,0)"; }}
              >
                <span style={{ color: "#fff", fontSize: 28, opacity: 0, transition: "opacity 0.3s" }}
                  ref={el => {
                    if (el) {
                      el.parentElement.addEventListener("mouseenter", () => el.style.opacity = "1");
                      el.parentElement.addEventListener("mouseleave", () => el.style.opacity = "0");
                    }
                  }}
                >🔍</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Instagram */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="https://www.instagram.com/sushi.makinori/" target="_blank" rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "#fff", padding: "12px 28px", borderRadius: 24,
              textDecoration: "none", fontFamily: "DM Sans, sans-serif",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.05em",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Síguenos en Instagram
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <button onClick={() => setSelected(null)} style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "#fff", width: 40, height: 40, borderRadius: "50%",
            fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          <img src={selected.src} alt={selected.alt} style={{
            maxWidth: "90vw", maxHeight: "85vh",
            objectFit: "contain", borderRadius: 12,
          }} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </Section>
  );
}