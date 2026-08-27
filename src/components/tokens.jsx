// ─── Design tokens ────────────────────────────────────────────
// Marca Maki Nori: azul petróleo del logo, naranja salmón, blanco
export const C = {
  teal:    "#1A8A96",
  tealD:   "#14707A",
  tealL:   "#E8F6F8",
  coral:   "#E8845C",
  coralD:  "#D46A42",
  shu:     "#E07048",
  cream:   "#FFFFFF",
  paper:   "#F3FAFB",
  washi:   "#FFFFFF",
  ink:     "#1A1A1A",
  inkSoft: "#0E3A42",
  navy:    "#0B2C32",
  muted:   "#5A6A6E",
  border:  "#C5DCDF",
  gold:    "#E8845C",
  wa:      "#25D366",
};

export const FONT = {
  serif: '"Shippori Mincho", "Noto Serif JP", serif',
  jp:    '"Noto Serif JP", "Shippori Mincho", serif',
  sans:  '"Noto Sans JP", sans-serif',
};

export function FrameCorners({ color = C.gold, size = 18, thick = 2, inset = 8 }) {
  const arm = {
    position: "absolute", width: size, height: size,
    pointerEvents: "none", zIndex: 3,
  };
  const b = `${thick}px solid ${color}`;
  return (
    <>
      <span aria-hidden style={{ ...arm, top: inset, left: inset, borderTop: b, borderLeft: b }} />
      <span aria-hidden style={{ ...arm, top: inset, right: inset, borderTop: b, borderRight: b }} />
      <span aria-hidden style={{ ...arm, bottom: inset, left: inset, borderBottom: b, borderLeft: b }} />
      <span aria-hidden style={{ ...arm, bottom: inset, right: inset, borderBottom: b, borderRight: b }} />
    </>
  );
}

export function OrnamentRow({ light = false, kanji = "花" }) {
  const color = light ? C.gold : C.teal;
  const mute = light ? "rgba(196,163,106,0.55)" : C.gold;
  return (
    <div aria-hidden style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 10, margin: "12px 0 4px",
    }}>
      <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <span style={{
        width: 7, height: 7, transform: "rotate(45deg)",
        background: mute, display: "inline-block",
      }} />
      <span style={{ fontFamily: FONT.jp, fontSize: 11, color, letterSpacing: "0.2em" }}>{kanji}</span>
      <span style={{
        width: 7, height: 7, transform: "rotate(45deg)",
        background: mute, display: "inline-block",
      }} />
      <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
}

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
    boxShadow: "0 10px 22px rgba(26,138,150,0.28)",
    transition: "background 0.2s, transform 0.15s",
    width: full ? "100%" : undefined, textAlign: "center",
    ...style,
  };
  if (href) {
    const ext = href.startsWith("http");
    return (
      <a href={href} style={base}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >{children}</a>
    );
  }
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
    boxShadow: "0 10px 22px rgba(232,132,92,0.32)",
    transition: "background 0.2s, transform 0.15s",
    width: full ? "100%" : undefined, textAlign: "center",
    ...style,
  };
  if (href) {
    const ext = href.startsWith("http");
    return (
      <a href={href} style={base}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >{children}</a>
    );
  }
  return (
    <button onClick={onClick}
      style={base}
      onMouseEnter={e => e.currentTarget.style.background = C.coralD}
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
      scrollMarginTop: 72,
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

export function SectionTitle({ kicker, jp, children, light = false, align = "center", ornament = "花" }) {
  return (
    <div style={{ textAlign: align, marginBottom: 48 }}>
      {kicker && <SectionTag light={light}>{kicker}</SectionTag>}
      <OrnamentRow light={light} kanji={ornament} />
      {jp && (
        <p style={{
          fontFamily: FONT.jp, fontSize: 13, letterSpacing: "0.32em",
          color: light ? "rgba(244,239,230,0.45)" : C.teal,
          margin: 0,
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
