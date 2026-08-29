import { C, BtnTeal, BtnGhost, FONT } from "./tokens";

const STATS = [
  { n: "+40", l: "Variedades", jp: "種類" },
  { n: "100%", l: "Fresco", jp: "新鮮" },
  { n: "10+", l: "Años", jp: "年" },
];

export default function Hero() {
  return (
    <section style={{ position: "relative", background: C.navy, overflow: "hidden" }}>
      <div className="noren-bar" />

      <div className="hero-split" style={{
        display: "flex", minHeight: "calc(100svh - 6px)", maxWidth: 1440, margin: "0 auto",
      }}>
        {/* Copy */}
        <div className="hero-copy" style={{
          flex: "1 1 46%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "120px 48px 72px",
          position: "relative",
          background: C.navy,
        }}>
          <div className="pattern-seigaiha-dark" style={{
            position: "absolute", inset: 0, opacity: 0.7, pointerEvents: "none",
          }} />

          <p className="v-kanji hide-mobile" style={{
            position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)",
            color: "rgba(244,239,230,0.14)", fontSize: 22, fontWeight: 700,
            pointerEvents: "none", userSelect: "none",
          }}>
            巻きのり · イグアラ
          </p>

          <div className="fade-up" style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
                border: `1px solid ${C.gold}`, flexShrink: 0,
              }}>
                <img src="/icon.png" alt="Logo de Maki Nori, sushi en Iguala" width="64" height="64" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <p style={{
                  fontFamily: FONT.jp, fontSize: 22, fontWeight: 700,
                  color: C.cream, margin: 0, letterSpacing: "0.12em",
                }}>まき のり</p>
                <p style={{
                  fontFamily: FONT.sans, fontSize: 11, color: C.gold,
                  letterSpacing: "0.28em", margin: "4px 0 0", textTransform: "uppercase",
                }}>Iguala · Guerrero</p>
              </div>
            </div>

            <p style={{
              fontFamily: FONT.sans, fontSize: 11, letterSpacing: "0.28em",
              textTransform: "uppercase", color: C.teal, margin: "0 0 18px", fontWeight: 600,
            }}>
              料理 · Cocina japonesa
            </p>

            <h1 style={{
              fontFamily: FONT.serif, fontWeight: 800,
              fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
              color: C.cream, lineHeight: 1.05,
              letterSpacing: "0.01em", margin: "0 0 10px",
            }}>
              Maki Nori
            </h1>
            <p style={{
              fontFamily: FONT.serif, fontSize: "clamp(1.25rem, 3vw, 1.85rem)",
              color: C.gold, fontStyle: "italic", fontWeight: 600,
              margin: "0 0 16px", lineHeight: 1.2,
            }}>
              Donde el sushi se hace arte
            </p>

            <div className="gold-line" style={{ width: 80, margin: "0 0 22px" }} />

            <p style={{
              fontFamily: FONT.sans, fontSize: 15, lineHeight: 1.85,
              color: "rgba(244,239,230,0.62)", margin: "0 0 32px", maxWidth: 420,
            }}>
              Sushi, ramen y barra en Iguala, Guerrero. Rolls a mano, sake y soju.
              Pedidos por WhatsApp o en Perif. Sur 12.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BtnTeal href="#menu">Ver menú</BtnTeal>
              <BtnGhost href="#productos" light>Armar pedido</BtnGhost>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="hero-photo" style={{
          flex: "1 1 54%", position: "relative", minHeight: "100svh", overflow: "hidden",
        }}>
          <img
            src="/IMG_7047.jpg"
            alt="Burguer Roll de Maki Nori, sushi hecho a mano en Iguala, Guerrero"
            fetchPriority="high"
            decoding="async"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: "center", display: "block",
              position: "absolute", inset: 0,
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(11,44,50,0.5) 0%, transparent 28%)",
          }} />
          <div style={{
            position: "absolute", bottom: 28, left: 28, right: 28,
            display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16,
          }}>
            <div>
              <span className="hanko" style={{ fontSize: 11, marginBottom: 10 }}>おすすめ</span>
              <p style={{
                fontFamily: FONT.serif, fontSize: 18, color: "#fff", margin: "10px 0 0",
                textShadow: "0 8px 24px rgba(0,0,0,0.45)",
              }}>Burguer Roll</p>
              <p style={{
                fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "2px 0 0",
              }}>Hecho a mano · Iguala</p>
            </div>
            <p style={{
              fontFamily: FONT.serif, fontSize: 22, color: C.gold, margin: 0, fontWeight: 700,
              textShadow: "0 8px 24px rgba(0,0,0,0.45)",
            }}>$100</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: C.cream, borderTop: `1px solid ${C.border}` }}>
        <div className="stats-strip" style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          padding: "28px 24px",
        }}>
          {STATS.map(({ n, l, jp }, i) => (
            <div key={l} style={{
              textAlign: "center",
              borderRight: i < 2 ? `1px solid ${C.border}` : "none",
              padding: "4px 8px",
            }}>
              <p style={{ fontFamily: FONT.jp, fontSize: 11, color: C.teal, letterSpacing: "0.2em", margin: "0 0 6px" }}>{jp}</p>
              <p style={{ fontFamily: FONT.serif, fontSize: "2rem", fontWeight: 800, color: C.ink, margin: 0 }}>{n}</p>
              <span style={{
                display: "inline-block", width: 18, height: 1,
                background: C.gold, margin: "8px 0 6px",
              }} />
              <p style={{
                fontFamily: FONT.sans, fontSize: 11, color: C.muted,
                letterSpacing: "0.16em", textTransform: "uppercase", margin: 0,
              }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
