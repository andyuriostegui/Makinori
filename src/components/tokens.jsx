// ─── Design tokens ────────────────────────────────────────────
export const C = {
  coral:  "#E8543A",
  coralD: "#C93D22",
  cream:  "#F5F0E8",
  paper:  "#EDE8DC",
  ink:    "#1A1A18",
  muted:  "#6B6660",
  border: "#C8BFB0",
  wa:     "#25D366",
};

// ─── Reusable micro-components ────────────────────────────────

/** Horizontal rule-flanked label  ── Menú / おもてなし / etc. */
export function SectionTag({ children, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em",
      textTransform: "uppercase", color: C.coral,
      fontFamily: "DM Sans, sans-serif",
      ...style,
    }}>
      <span style={{ display: "block", height: 1, width: 28, background: C.coral }} />
      {children}
      <span style={{ display: "block", height: 1, width: 28, background: C.coral }} />
    </span>
  );
}

/** Coral filled button / link */
export function BtnCoral({ href, onClick, children, full = false, style = {} }) {
  const base = {
    display: "inline-block", background: C.coral, color: C.cream,
    padding: "12px 28px", borderRadius: 4, fontSize: 14, fontWeight: 600,
    letterSpacing: "0.05em", textDecoration: "none", border: "none",
    cursor: "pointer", fontFamily: "DM Sans, sans-serif",
    transition: "background 0.2s, transform 0.15s",
    width: full ? "100%" : undefined, textAlign: "center",
    ...style,
  };
  if (href) return <a href={href} style={base}>{children}</a>;
  return (
    <button onClick={onClick}
      style={base}
      onMouseEnter={e => e.currentTarget.style.background = C.coralD}
      onMouseLeave={e => e.currentTarget.style.background = C.coral}
    >{children}</button>
  );
}

/** Ghost (outline) button / link */
export function BtnGhost({ href, children, style = {} }) {
  const base = {
    display: "inline-block", background: "transparent",
    color: C.ink, border: `1.5px solid ${C.ink}`,
    padding: "12px 28px", borderRadius: 4, fontSize: 14, fontWeight: 500,
    letterSpacing: "0.03em", textDecoration: "none",
    cursor: "pointer", fontFamily: "DM Sans, sans-serif",
    transition: "background 0.2s, color 0.2s",
    ...style,
  };
  return (
    <a href={href} style={base}
      onMouseEnter={e => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.cream; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.ink; }}
    >{children}</a>
  );
}

/** Shared section wrapper */
export function Section({ id, bg, children, style = {} }) {
  return (
    <section id={id} style={{
      padding: "80px 16px",
      background: bg || "transparent",
      fontFamily: "DM Sans, sans-serif",
      ...style,
    }}>
      {children}
    </section>
  );
}

/** Inner max-width container */
export function Container({ max = 1200, children, style = {} }) {
  return (
    <div style={{ maxWidth: max, margin: "0 auto", ...style }}>
      {children}
    </div>
  );
}
