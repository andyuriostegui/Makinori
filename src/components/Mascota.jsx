import { C } from "./Tokens";

// ─── Mascota: rollito de sushi kawaii ──────────────────────────
// pose: "feliz" | "hambriento"

function Cara({ pose }) {
  if (pose === "hambriento") {
    return (
      <>
        <path d="M68 76 Q72 70 76 76" stroke="#1A1A18" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 76 Q104 70 108 76" stroke="#1A1A18" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="64" cy="90" rx="8" ry="5" fill="#F2A6A0" opacity="0.75" />
        <ellipse cx="112" cy="90" rx="8" ry="5" fill="#F2A6A0" opacity="0.75" />
        <ellipse cx="88" cy="96" rx="10" ry="8" fill="#7A2E22" />
        <ellipse cx="88" cy="93" rx="6" ry="3" fill="#C0392B" />
      </>
    );
  }
  // "feliz" (default)
  return (
    <>
      <path d="M70 78 Q74 72 78 78" stroke="#1A1A18" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M98 78 Q102 72 106 78" stroke="#1A1A18" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="65" cy="88" rx="7" ry="4" fill="#F2A6A0" opacity="0.7" />
      <ellipse cx="111" cy="88" rx="7" ry="4" fill="#F2A6A0" opacity="0.7" />
      <path d="M78 92 Q88 102 98 92" stroke="#1A1A18" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="83" y="92" width="4" height="5" rx="1" fill="#fff" />
      <rect x="89" y="92" width="4" height="5" rx="1" fill="#fff" />
    </>
  );
}

/**
 * MascotaSushi — rollito de sushi kawaii con palillos.
 * pose: "feliz" | "hambriento"
 * size: alto en px (ancho se ajusta proporcional)
 */
export function MascotaSushi({ pose = "feliz", size = 96, style = {} }) {
  return (
    <svg
      width={size} height={size * 1.15}
      viewBox="0 0 176 202"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", ...style }}
    >
      {/* sombra */}
      <ellipse cx="88" cy="188" rx="42" ry="8" fill="#1A1A18" opacity="0.08" />

      {/* piernitas */}
      <rect x="70" y="160" width="6" height="24" rx="3" fill="#F5F0E8" stroke="#C8BFB0" strokeWidth="1.5" />
      <rect x="100" y="160" width="6" height="24" rx="3" fill="#F5F0E8" stroke="#C8BFB0" strokeWidth="1.5" />
      <ellipse cx="73" cy="186" rx="8" ry="4" fill="#fff" stroke="#C8BFB0" strokeWidth="1.5" />
      <ellipse cx="103" cy="186" rx="8" ry="4" fill="#fff" stroke="#C8BFB0" strokeWidth="1.5" />

      {/* cuerpo: rollito (nori afuera, arroz con sesamo) */}
      <rect x="32" y="55" width="112" height="115" rx="22" fill="#2D2A24" />
      <rect x="38" y="61" width="100" height="103" rx="18" fill="#F5F0E8" />
      {/* textura sesamo */}
      {[[52,80],[64,100],[50,118],[68,140],[120,82],[110,105],[124,128],[100,150],[80,150],[58,130]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#C8BFB0" />
      ))}

      {/* relleno salmón en la parte de arriba */}
      <path d="M38 70 Q88 50 138 70 L138 80 Q88 62 38 80 Z" fill={C.coral} />
      <path d="M38 70 Q88 50 138 70" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" />

      {/* cachetes y cara */}
      <Cara pose={pose} />

      {/* brazos */}
      {pose === "hambriento" ? (
        <>
          {/* palillos sostenidos arriba */}
          <line x1="42" y1="40" x2="62" y2="95" stroke="#B85F33" strokeWidth="5" strokeLinecap="round" />
          <line x1="56" y1="34" x2="70" y2="92" stroke="#D97A4A" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="46" cy="112" rx="9" ry="13" fill="#F5F0E8" stroke="#2D2A24" strokeWidth="2.5" transform="rotate(-25 46 112)" />
          <ellipse cx="130" cy="120" rx="9" ry="13" fill="#F5F0E8" stroke="#2D2A24" strokeWidth="2.5" transform="rotate(15 130 120)" />
        </>
      ) : (
        <>
          <ellipse cx="46" cy="120" rx="9" ry="14" fill="#F5F0E8" stroke="#2D2A24" strokeWidth="2.5" transform="rotate(-15 46 120)" />
          <ellipse cx="130" cy="120" rx="9" ry="14" fill="#F5F0E8" stroke="#2D2A24" strokeWidth="2.5" transform="rotate(15 130 120)" />
        </>
      )}
    </svg>
  );
}

/** Burbuja de diálogo con frase + mascota chica al lado, para tips/CTAs */
export function MascotaBubble({ pose = "feliz", children, accent = C.teal }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
      <MascotaSushi pose={pose} size={56} />
      <div style={{
        background: "#fff", border: `1.5px solid ${accent}`,
        borderRadius: 14, padding: "10px 16px",
        position: "relative", maxWidth: 260,
        fontFamily: "DM Sans, sans-serif", fontSize: 12.5,
        fontWeight: 600, color: C.ink, lineHeight: 1.5,
      }}>
        {children}
        <span style={{
          position: "absolute", left: -7, bottom: 14,
          width: 0, height: 0,
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          borderRight: `7px solid ${accent}`,
        }} />
      </div>
    </div>
  );
}