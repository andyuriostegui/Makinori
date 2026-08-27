// ─── Design tokens ────────────────────────────────────────────
// Estética washitsu / sushi-ya: sumi, washi, teal de marca, shu y oro
export const C = {
  teal:    "#2A8B8B",
  tealD:   "#1A5E5E",
  tealL:   "#E6F0EF",
  coral:   "#E07A4A",
  coralD:  "#C96538",
  shu:     "#B33A2B",
  cream:   "#F4EFE6",
  paper:   "#E8E0D2",
  washi:   "#FAF6EE",
  ink:     "#161311",
  inkSoft: "#2A241E",
  muted:   "#6B655C",
  border:  "#D0C6B4",
  gold:    "#C4A36A",
  wa:      "#25D366",
};

export const FONT = {
  serif: '"Shippori Mincho", "Noto Serif JP", serif',
  jp:    '"Noto Serif JP", "Shippori Mincho", serif',
  sans:  '"Noto Sans JP", sans-serif',
};

export function SectionTag({ children, light = false, style = {} }) {
  const color = light ? C.gold : C.teal;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.22em",
      textTransform: "uppercase", color,
      fontFamily: FONT.sans,
      ...style,
    }}>
      <span style={{ display: "block", height: 1, width: 28, background: color, opacity: 0.7 }} />
      {children}
      <span style={{ display: "block", height: 1, width: 28, background: color, opacity: 0.7 }} />
    </span>
  );
}

export function BtnTeal({ href, onClick, children, full = false, style = {} }) {
  const base = {
    display: "inline-block", background: C.teal, color: C.cream,
    padding: "13px 30px", borderRadius: 2, fontSize: 13, fontWeight: 600,
    letterSpacing: "0.12em", textDecoration: "none", border: "none",
    cursor: "pointer", fontFamily: FONT.sans,
    textTransform: "uppercase",
    transition: "background 0.2s, transform 0.15s",
    width: full ? "100%" : undefined, textAlign: "center",
    ...style,
  };
  if (href) return <a href={href} style={base}>{children}</a>;
  return (
    <button onClick={onClick}
      style={base}
      onMouseEnter={e => e.currentTarget.style.background = C.tealD}
      onMouseLeave={e => e.currentTarget.style.background = C.teal}
    >{children}</button>
  );
}

export function BtnCoral({ href, onClick, children, full = false, style = {} }) {
  const base = {
    display: "inline-block", background: C.shu, color: C.cream,
    padding: "13px 30px", borderRadius: 2, fontSize: 13, fontWeight: 600,
    letterSpacing: "0.12em", textDecoration: "none", border: "none",
    cursor: "pointer", fontFamily: FONT.sans,
    textTransform: "uppercase",
    transition: "background 0.2s, transform 0.15s",
    width: full ? "100%" : undefined, textAlign: "center",
    ...style,
  };
  if (href) return <a href={href} style={base}>{children}</a>;
  return (
    <button onClick={onClick}
      style={base}
      onMouseEnter={e => e.currentTarget.style.background = "#8F2E22"}
      onMouseLeave={e => e.currentTarget.style.background = C.shu}
    >{children}</button>
  );
}

export function BtnGhost({ href, children, style = {}, light = false }) {
  const color = light ? C.cream : C.ink;
  const base = {
    display: "inline-block", background: "transparent",
    color, border: `1px solid ${light ? "rgba(244,239,230,0.45)" : C.ink}`,
    padding: "12px 28px", borderRadius: 2, fontSize: 13, fontWeight: 500,
    letterSpacing: "0.12em", textDecoration: "none",
    textTransform: "uppercase",
    cursor: "pointer", fontFamily: FONT.sans,
    transition: "background 0.2s, color 0.2s",
    ...style,
  };
  return (
    <a href={href} style={base}
      onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = light ? C.ink : C.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; }}
    >{children}</a>
  );
}

export function Section({ id, bg, children, style = {} }) {
  return (
    <section id={id} style={{
      padding: "88px 16px",
      background: bg || "transparent",
      fontFamily: FONT.sans,
      ...style,
    }}>
      {children}
    </section>
  );
}

export function Container({ max = 1200, children, style = {} }) {
  return (
    <div style={{ maxWidth: max, margin: "0 auto", ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ kicker, jp, children, light = false, align = "center" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 56 }}>
      {kicker && <SectionTag light={light}>{kicker}</SectionTag>}
      {jp && (
        <p style={{
          fontFamily: FONT.jp, fontSize: 13, letterSpacing: "0.32em",
          color: light ? "rgba(244,239,230,0.45)" : C.teal,
          margin: kicker ? "14px 0 0" : 0,
        }}>{jp}</p>
      )}
      <h2 style={{
        fontFamily: FONT.serif, fontWeight: 700,
        fontSize: "clamp(2rem, 5vw, 3.15rem)",
        color: light ? C.cream : C.ink,
        letterSpacing: "0.02em",
        margin: "10px 0 0",
        lineHeight: 1.15,
      }}>
        {children}
      </h2>
    </div>
  );
}
