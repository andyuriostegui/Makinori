import { useState } from "react";
import { C, FONT, Section, Container, SectionTitle, FrameCorners } from "./tokens";
import { ILU_MAP } from "./illustrations";
import { BtnAgregar } from "./Carrito";
import { useCatalog } from "../catalog/CatalogContext";
import { parseFotoPos } from "../lib/catalog";

function ProductCard({ producto, featured = false, wide = false }) {
  const { tag, tagDark, nombre, jp, precio, desc, badges = [], badgePicante, ilu, foto } = producto;
  const fotoPos = parseFotoPos(foto);
  const [hov, setHov] = useState(false);
  const Ilu = ILU_MAP[ilu];
  const precioNum = parseInt(String(precio || "0").replace("$", ""), 10);
  const horizontal = featured || wide;
  const cls = [featured ? "feat" : "", wide ? "wide" : "", horizontal ? "prod-card-h" : ""].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.washi, overflow: "hidden",
        position: "relative",
        border: `1.5px solid ${hov ? C.gold : C.border}`,
        fontFamily: FONT.sans,
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hov
          ? "0 22px 48px rgba(22,19,17,0.16)"
          : "0 10px 28px rgba(22,19,17,0.07)",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
        display: "flex",
        flexDirection: horizontal ? undefined : "column",
        height: "100%",
      }}
    >
      <FrameCorners color={hov ? C.shu : C.gold} size={featured ? 22 : 14} thick={2} inset={featured ? 12 : 8} />

      <div className="prod-photo" style={{
        height: horizontal ? undefined : 200,
        background: C.paper,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        {foto
          ? <img src={fotoPos.src} alt={`${nombre} de Maki Nori`}
              loading={featured ? "eager" : "lazy"}
              decoding="async"
              style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: `${fotoPos.x}% ${fotoPos.y}%`,
              transform: hov ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s ease",
            }} />
          : Ilu && <Ilu />
        }
        <div style={{
          position: "absolute", inset: 0,
          background: featured
            ? "linear-gradient(180deg, rgba(22,19,17,0.05) 40%, rgba(22,19,17,0.55) 100%)"
            : "linear-gradient(180deg, transparent 60%, rgba(22,19,17,0.28) 100%)",
          pointerEvents: "none",
        }} />
        {tag && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            background: tagDark ? C.ink : C.shu,
            color: C.cream, fontSize: 9, fontWeight: 700,
            padding: "5px 12px", letterSpacing: "0.14em",
            fontFamily: FONT.sans,
            boxShadow: "0 6px 16px rgba(22,19,17,0.25)",
          }}>{tag}</span>
        )}
        <span style={{
          position: "absolute", bottom: 12, left: 14,
          fontFamily: FONT.jp, fontSize: featured ? 13 : 11,
          color: "rgba(255,255,255,0.85)", letterSpacing: "0.16em",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}>{jp}</span>
      </div>

      <div style={{
        padding: featured ? "22px 24px 24px" : "18px 20px 20px",
        display: "flex", flexDirection: "column", flex: 1,
        backgroundImage: "linear-gradient(180deg, rgba(244,239,230,0.4), transparent)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 }}>
          <h3 style={{
            fontSize: featured ? 24 : 16, fontWeight: 700, color: C.ink, margin: 0,
            fontFamily: FONT.serif, lineHeight: 1.2,
          }}>{nombre}</h3>
          <span style={{
            flexShrink: 0,
            background: C.shu, color: C.cream,
            fontFamily: FONT.serif, fontWeight: 700,
            fontSize: featured ? 16 : 14,
            padding: "6px 10px",
            boxShadow: "0 6px 14px rgba(179,58,43,0.28)",
          }}>{precio}</span>
        </div>
        <p style={{
          fontSize: featured ? 14 : 13, color: C.muted,
          lineHeight: 1.75, margin: 0, flex: 1,
        }}>{desc}</p>
        {featured && (
          <p style={{
            fontFamily: FONT.jp, fontSize: 12, color: C.teal,
            letterSpacing: "0.08em", margin: "10px 0 0",
          }}>職人 · Lo arma el chef al momento, pieza por pieza</p>
        )}
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {badges.map((b, i) => (
            <span key={i} style={{
              background: badgePicante && i === 0 ? "rgba(179,58,43,0.12)" : C.paper,
              color: badgePicante && i === 0 ? C.shu : C.ink,
              border: `1px solid ${badgePicante && i === 0 ? "rgba(179,58,43,0.25)" : C.border}`,
              fontSize: 10, padding: "4px 9px", fontWeight: 600, letterSpacing: "0.04em",
            }}>{b}</span>
          ))}
        </div>
        <BtnAgregar producto={{ id: producto.id || nombre, nombre, precio: precioNum, foto }} />
      </div>
    </div>
  );
}

export default function Productos() {
  const { productos } = useCatalog();
  const list = productos || [];

  return (
    <Section id="productos" style={{ position: "relative", overflow: "hidden", background: C.cream }}>
      <div className="pattern-asanoha" style={{ position: "absolute", inset: 0, opacity: 0.65, pointerEvents: "none" }} />
      <div className="pattern-seigaiha" style={{ position: "absolute", inset: 0, opacity: 0.2, pointerEvents: "none" }} />
      <Container style={{ position: "relative" }}>
        <SectionTitle kicker="おすすめ" jp="今日のおすすめ" ornament="旬">
          Nuestros <span style={{ color: C.teal, fontStyle: "italic" }}>favoritos</span>
        </SectionTitle>
        <p style={{
          textAlign: "center", fontFamily: FONT.serif, fontStyle: "italic",
          color: C.muted, margin: "-28px auto 40px", maxWidth: 520, fontSize: 15, lineHeight: 1.7,
        }}>
          Lo que más pedimos, lo que más duele terminar y lo que el chef pondría en tu mesa si le dejas elegir.
        </p>

        <div className="productos-bento">
          {list.map(p => (
            <ProductCard key={p.id} producto={p} featured={!!p.featured} wide={!!p.wide} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
