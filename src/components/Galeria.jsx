import { useState } from "react";
import { C, SectionTag, Section } from "./tokens";

const FOTOS = [
  { src: "/maki1.jpeg",  alt: "Sushi Maki Nori",   badge: null   },
  { src: "/maki2.jpeg",  alt: "Rolls Frescos",      badge: "star" },
  { src: "/maki3.jpeg",  alt: "Roll Especial",      badge: null   },
  { src: "/maki4.jpeg",  alt: "Snow Roll",          badge: null   },
  { src: "/maki5.jpeg",  alt: "Ramen",      badge: "star" },
  { src: "/maki6.jpeg",  alt: "Sushi Artesanal",    badge: null   },
  { src: "/maki7.jpeg",  alt: "Roll del chef",    badge: null   },
  { src: "/maki9.jpeg",  alt: "Maki Nori",       badge: "hot"  },
  { src: "/maki10.jpeg", alt: "Para compartir",       badge: "hot"  },
  { src: "/bebida.jpeg", alt: "Mogu Mogu",          badge: "new"  },
  { src: "/sushi1.png",  alt: "Philadelphia Roll",  badge: "star" },
  { src: "/sushi2.png",  alt: "Dragon Roll",        badge: "hot"  },
];

const BADGE_LABELS = { new: "Nuevo", hot: "Fire", star: "Top" };
const BADGE_STYLES = {
  new:  { background: "#5DCAA5", color: "#04342C" },
  hot:  { background: "#F0997B", color: "#4A1B0C" },
  star: { background: "#FAC775", color: "#412402" },
};

const ROTS = [1.2, -0.8, 1.5, -1.1, 0.7, -1.4, 1.0, -0.6, 1.3, -1.0, 0.9, -1.5, 1.1];

const CORNERS = [
  { top: -6,    left: -6  },
  { top: -6,    right: -6 },
  { bottom: -6, left: -6  },
  { bottom: -6, right: -6 },
];

const IGO_SVG = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function Galeria() {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="galeria" style={{ background: C.ink, overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionTag light>Instagram</SectionTag>
          <h2 style={{
            fontWeight: 900,
            fontSize: "clamp(2rem,5vw,3rem)",
            color: C.cream,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Nuestros <span style={{ color: C.coral }}>Rolls</span>
          </h2>
          <a
            href="https://www.instagram.com/sushi.makinori/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 16, color: "rgba(245,240,232,0.5)",
              textDecoration: "none", fontFamily: "DM Sans, sans-serif",
              fontSize: 13, fontWeight: 500, transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.coral}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(245,240,232,0.5)"}
          >
            {IGO_SVG}
            @sushi.makinori
          </a>
        </div>

        {/* Grid kawaii */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 32,
          padding: "16px 8px 40px",
        }}>
          {FOTOS.map((foto, i) => (
            <div
              key={i}
              onClick={() => setSelected(foto)}
              style={{
                position: "relative",
                cursor: "pointer",
                transform: `rotate(${ROTS[i]}deg)`,
                transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1)",
                marginTop: i % 2 === 0 ? 0 : 16,
              }}
              onMouseEnter={e => {
                const rot = ROTS[i];
                e.currentTarget.style.transform = `rotate(${rot > 0 ? rot + 2 : rot - 2}deg) scale(1.06)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = `rotate(${ROTS[i]}deg)`;
              }}
            >
              {/* Badge */}
              {foto.badge && (
                <span style={{
                  position: "absolute",
                  top: -12, right: -8,
                  fontSize: 10, fontWeight: 900,
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: "2px solid #1a1a18",
                  boxShadow: "1px 1px 0 #1a1a18",
                  zIndex: 3,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "DM Sans, sans-serif",
                  ...BADGE_STYLES[foto.badge],
                }}>
                  {BADGE_LABELS[foto.badge]}
                </span>
              )}

              {/* Marco con imagen */}
              <div style={{
                borderRadius: 12,
                overflow: "hidden",
                aspectRatio: "1/1",
                border: "3px solid #1a1a18",
                boxShadow: "5px 5px 0 #1a1a18",
                background: C.paper,
                position: "relative",
              }}>
                <img
                  src={foto.src}
                  alt={foto.alt}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>

              {/* Bolitas de esquina */}
              {CORNERS.map((pos, j) => (
                <div key={j} style={{
                  position: "absolute",
                  width: 14, height: 14,
                  borderRadius: "50%",
                  background: C.cream,
                  border: "2px solid #1a1a18",
                  zIndex: 2,
                  ...pos,
                }} />
              ))}

              {/* Etiqueta nombre */}
              <div style={{
                position: "absolute",
                bottom: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background: C.cream,
                border: "2px solid #1a1a18",
                borderRadius: 20,
                padding: "3px 14px",
                fontSize: 11,
                fontWeight: 700,
                color: "#1a1a18",
                whiteSpace: "nowrap",
                boxShadow: "2px 2px 0 #1a1a18",
                letterSpacing: "0.02em",
                fontFamily: "DM Sans, sans-serif",
                zIndex: 3,
              }}>
                {foto.alt}
              </div>
            </div>
          ))}
        </div>

        {/* Video YouTube */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 56,
          marginBottom: 8,
        }}>
          <div style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "3px solid #1a1a18",
            boxShadow: "6px 6px 0 #1a1a18",
            transform: "rotate(-0.5deg)",
            maxWidth: "100%",
          }}>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/ZoFwQlCwd8o?si=CvY9br27vUYSPHP6"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* CTA Instagram */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <a
            href="https://www.instagram.com/sushi.makinori/"
            target="_blank"
            rel="noreferrer"
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
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: C.cream, border: "2px solid #1a1a18",
              color: "#1a1a18", width: 40, height: 40, borderRadius: "50%",
              fontSize: 16, fontWeight: 900, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0 #1a1a18",
            }}
          >
            &#x2715;
          </button>
          <div
            style={{ position: "relative", display: "inline-block" }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.src}
              alt={selected.alt}
              style={{
                maxWidth: "80vw", maxHeight: "80vh",
                objectFit: "contain", borderRadius: 16,
                border: "3px solid #fff",
                boxShadow: "6px 6px 0 rgba(255,255,255,0.25)",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute",
              bottom: -18, left: "50%",
              transform: "translateX(-50%)",
              background: C.cream,
              border: "2px solid #1a1a18",
              borderRadius: 20,
              padding: "4px 18px",
              fontSize: 13, fontWeight: 700,
              color: "#1a1a18",
              whiteSpace: "nowrap",
              boxShadow: "2px 2px 0 #1a1a18",
              fontFamily: "DM Sans, sans-serif",
            }}>
              {selected.alt}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}