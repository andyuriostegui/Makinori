// ─── Design tokens ────────────────────────────────────────────
// Paleta Makinori: teal (azul) protagonista + salmón suave de acento
export const C = {
  teal:    "#2A8B8B",   // PRINCIPAL — azul teal del logo
  tealD:   "#1F6B6B",   // hover/oscuro del teal
  tealL:   "#E3F0EF",   // teal muy claro para fondos suaves
  coral:   "#E8915C",   // salmón suave (acento secundario)
  coralD:  "#D17A45",   // hover del salmón
  cream:   "#F5F0E8",
  paper:   "#EDE8DC",
  ink:     "#1A2B2B",   // tinta con tinte azulado (combina con teal)
  muted:   "#6B7270",
  border:  "#C8C3B8",
  wa:      "#25D366",
};

// ─── Reusable micro-components ────────────────────────────────

/** Horizontal rule-flanked label  ── Menú / おもてなし / etc. */
export function SectionTag({ children, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em",
      textTransform: "uppercase", color: C.teal,
      fontFamily: "DM Sans, sans-serif",
      ...style,
    }}>
      <span style={{ display: "block", height: 1, width: 28, background: C.teal }} />
      {children}
      <span style={{ display: "block", height: 1, width: 28, background: C.teal }} />
    </span>
  );
}

/** Teal filled button / link (acción principal) */
export function BtnTeal({ href, onClick, children, full = false, style = {} }) {
  const base = {
    display: "inline-block", background: C.teal, color: C.cream,
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
      onMouseEnter={e => e.currentTarget.style.background = C.tealD}
      onMouseLeave={e => e.currentTarget.style.background = C.teal}
    >{children}</button>
  );
}

/** Coral/salmón filled button / link (acento secundario) */
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