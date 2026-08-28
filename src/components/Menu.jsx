import { useState } from "react";
import { C, FONT, Section, Container, SectionTitle, FrameCorners } from "./tokens";
import { useCarritoCtx } from "./Carrito";
import { useCatalog } from "../catalog/CatalogContext";

function ItemRow({ item, index, total }) {
  const { items, agregar, quitar } = useCarritoCtx();
  const itemId = item.id || item.nombre;
  const precioNum = parseInt(String(item.precio).replace("$", ""), 10);
  const enCarrito = items.find(i => i.id === itemId || i.nombre === item.nombre);
  const qty = enCarrito?.qty || 0;
  const [pop, setPop] = useState(false);

  const handleAgregar = () => {
    agregar({ id: itemId, nombre: item.nombre, precio: precioNum, foto: item.foto || null });
    setPop(true);
    setTimeout(() => setPop(false), 300);
  };

  return (
    <div className="menu-item-row" style={{
      display: "flex", alignItems: "center",
      padding: "14px 20px",
      borderBottom: index < total - 1 ? `1px dashed ${C.border}` : "none",
      fontFamily: FONT.sans,
      gap: 14,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 4, flexShrink: 0,
        overflow: "hidden", background: C.paper,
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 12px rgba(22,19,17,0.08)",
      }}>
        {item.foto
          ? <img src={item.foto} alt={item.nombre} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{
              width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontFamily: FONT.jp, fontSize: 16, color: C.gold,
            }}>鮨</div>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0, fontFamily: FONT.serif }}>
            {item.nombre}
          </p>
          {item.popular && (
            <span className="hanko" style={{ fontSize: 8, padding: "1px 5px", transform: "rotate(-8deg)" }}>人気</span>
          )}
          <span className="menu-dots" style={{
            flex: 1, borderBottom: `1px dotted ${C.border}`,
            minWidth: 16, transform: "translateY(-4px)",
          }} />
          <p style={{
            fontSize: 16, fontWeight: 800, color: C.shu, margin: 0,
            fontFamily: FONT.serif, flexShrink: 0,
          }}>{item.precio}</p>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 0", lineHeight: 1.55 }}>{item.desc}</p>
      </div>

      <div style={{ flexShrink: 0 }}>
        {qty === 0 ? (
          <button onClick={handleAgregar} aria-label={`Agregar ${item.nombre}`} style={{
            width: 36, height: 36, borderRadius: 4,
            background: pop ? C.ink : C.teal,
            border: "none", color: C.cream,
            fontSize: 20, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: pop ? "scale(0.88)" : "scale(1)",
            boxShadow: "0 6px 14px rgba(42,139,139,0.28)",
            transition: "all 0.15s",
          }}>+</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => quitar(itemId)} style={{
              width: 28, height: 28, borderRadius: 4,
              border: `1.5px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={handleAgregar} style={{
              width: 28, height: 28, borderRadius: 4,
              border: "none", background: C.teal,
              color: C.cream, fontSize: 16, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transform: pop ? "scale(0.88)" : "scale(1)",
              transition: "transform 0.15s",
            }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Menu() {
  const { menuTabs, menuBySlug } = useCatalog();
  const tabs = menuTabs || [];
  const [cat, setCat] = useState(tabs[0]?.key || "frescos");
  const active = tabs.some(c => c.key === cat) ? cat : (tabs[0]?.key || cat);

  const meta = tabs.find(c => c.key === active);
  const data = menuBySlug?.[active] || { jp: "", sub: "", items: [] };

  return (
    <Section id="menu" bg={C.paper} style={{ position: "relative", overflow: "hidden" }}>
      <div className="pattern-seigaiha" style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none" }} />
      <div className="pattern-asanoha" style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }} />

      <Container max={920} style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle kicker="お品書き" jp="メニュー" ornament="鮨">
          Menú <span style={{ color: C.teal, fontStyle: "italic" }}>completo</span>
        </SectionTitle>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 10,
          justifyContent: "center", marginBottom: 36,
        }}>
          {tabs.map(c => (
            <TabBtn key={c.key} active={active === c.key} tint={c.tint} jp={c.jp} onClick={() => setCat(c.key)}>
              {c.label}
            </TabBtn>
          ))}
        </div>

        <div className="menu-carta">
          <FrameCorners color={C.shu} size={22} thick={2} inset={10} />

          <div style={{ textAlign: "center", padding: "8px 24px 18px" }}>
            <div className="noren-bar" style={{ width: 120, height: 5, margin: "0 auto 14px" }} />
            <p style={{
              fontFamily: FONT.jp, fontSize: 12, color: meta?.tint || C.teal,
              letterSpacing: "0.28em", margin: "0 0 4px",
            }}>{data.jp}</p>
            <p style={{
              fontFamily: FONT.serif, fontSize: 22, fontWeight: 700,
              color: C.ink, margin: "0 0 6px",
            }}>{meta?.label}</p>
            <p style={{
              fontSize: 11, color: C.muted, letterSpacing: "0.12em",
              textTransform: "uppercase", margin: 0, fontFamily: FONT.sans,
            }}>{data.sub}</p>
          </div>

          <div style={{ padding: "0 8px 16px" }}>
            {(data.items || []).map((item, i) => (
              <ItemRow key={item.id || item.nombre} item={item} index={i} total={data.items.length} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TabBtn({ active, onClick, children, jp, tint }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 18px 9px",
      borderRadius: 4,
      cursor: "pointer",
      border: `1.5px solid ${active ? tint : C.border}`,
      background: active ? tint : C.washi,
      color: active ? C.cream : C.ink,
      fontFamily: FONT.sans,
      boxShadow: active ? `0 8px 18px ${tint}44` : "0 2px 8px rgba(22,19,17,0.05)",
      transition: "all 0.2s",
      minWidth: 108,
    }}>
      <span style={{
        display: "block", fontFamily: FONT.jp, fontSize: 11,
        letterSpacing: "0.16em", opacity: 0.8, marginBottom: 2,
      }}>{jp}</span>
      <span style={{
        display: "block", fontSize: 12, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>{children}</span>
    </button>
  );
}
