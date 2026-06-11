// All product card SVG illustrations in one place.

export function IluSashimi() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="110" rx="70" ry="12" fill="#EDE8DC"/>
      <rect x="50" y="70" width="100" height="40" rx="20" fill="#F7F2EA"/>
      <ellipse cx="75"  cy="72" rx="14" ry="6" fill="#C0392B" opacity="0.9"/>
      <ellipse cx="100" cy="70" rx="14" ry="6" fill="#F26A4A" opacity="0.9"/>
      <ellipse cx="125" cy="72" rx="14" ry="6" fill="#E8A830" opacity="0.9"/>
      <ellipse cx="75"  cy="72" rx="10" ry="3" fill="#fff"    opacity="0.2"/>
      <ellipse cx="100" cy="70" rx="10" ry="3" fill="#fff"    opacity="0.2"/>
      <path d="M55 90 Q60 84 65 90" stroke="#4CAF7D" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function IluDragon() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="55" width="140" height="60" rx="30" fill="#EDE8DC" stroke="#C8BFB0" strokeWidth="1.5"/>
      <rect x="30" y="75" width="140" height="20"      fill="#2D4A1A" opacity="0.7"/>
      {[60,80,100,120,140].map((cx,i) => (
        <ellipse key={i} cx={cx} cy={i%2===0?55:52} rx="12" ry="18"
          fill={i%2===0?"#6DB86D":"#7FC97F"} opacity="0.85"/>
      ))}
      <path d="M50 115 Q70 108 90 116 Q110 124 130 112 Q150 100 165 110"
        stroke="#E8543A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function IluNigiri() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      {[{x:30,c:"#F26A4A"},{x:80,c:"#C0392B"},{x:130,c:"#E8C84A"}].map(({x,c},i)=>(
        <g key={i} transform={`translate(${x},60)`}>
          <ellipse cx="0" cy="20" rx="22" ry="8" fill="#F7F3EC"/>
          <ellipse cx="0" cy="14" rx="22" ry="7" fill={c}/>
          <ellipse cx="0" cy="12" rx="14" ry="3" fill="#fff" opacity="0.25"/>
          <rect x="-12" y="20" width="24" height="6" rx="1" fill="#2D4A1A" opacity="0.6"/>
        </g>
      ))}
      <ellipse cx="100" cy="105" rx="75" ry="12" fill="#EDE8DC" stroke="#C8BFB0" strokeWidth="1"/>
    </svg>
  );
}

export function IluRamen() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="118" rx="65" ry="10" fill="#1A1A18" opacity="0.08"/>
      <path d="M42 90 Q42 135 100 138 Q158 135 158 90 Z" fill="#FDECC8"/>
      <ellipse cx="100" cy="90" rx="58" ry="16" fill="#FDECC8" stroke="#C8BFB0" strokeWidth="1.5"/>
      <ellipse cx="100" cy="90" rx="50" ry="10" fill="#D4A843" opacity="0.4"/>
      <path d="M60 100 Q80 93 100 100 Q120 107 140 100" stroke="#F5E6C0" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M58 108 Q78 101 98 108 Q118 115 138 108" stroke="#F5E6C0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="85" cy="87" rx="14" ry="8" fill="#C0392B" opacity="0.85"/>
      <ellipse cx="85" cy="85" rx="8"  ry="4" fill="#E8543A" opacity="0.5"/>
      <circle cx="118" cy="86" r="11" fill="#FDECC8" stroke="#D4A843" strokeWidth="1.5"/>
      <circle cx="118" cy="86" r="7"  fill="#F5C842" opacity="0.8"/>
      <rect x="70" y="70" width="6" height="22" rx="2" fill="#2D4A1A" opacity="0.8"/>
      <circle cx="100" cy="82" r="3" fill="#4CAF7D" opacity="0.8"/>
      <line x1="55"  y1="65"  x2="115" y2="125" stroke="#8B6914" strokeWidth="4" strokeLinecap="round"/>
      <line x1="70"  y1="58"  x2="128" y2="118" stroke="#A0792A" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export function IluTemaki() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      <path d="M75 120 L120 45 L155 120 Z" fill="#2D4A1A" opacity="0.85"/>
      <path d="M78 120 L118 52 L148 120 Z" fill="#F7F3EC"/>
      <ellipse cx="115" cy="70" rx="15" ry="22" fill="#F26A4A" opacity="0.7" transform="rotate(-15,115,70)"/>
      <ellipse cx="118" cy="68" rx="8"  ry="14" fill="#6DB86D" opacity="0.7" transform="rotate(-10,118,68)"/>
      <ellipse cx="113" cy="105" rx="25" ry="8" fill="#F7F3EC" opacity="0.9"/>
      <circle cx="105" cy="100" r="1.5" fill="#C8BFB0"/>
      <circle cx="112" cy="97"  r="1.5" fill="#C8BFB0"/>
      <circle cx="120" cy="102" r="1.5" fill="#C8BFB0"/>
    </svg>
  );
}

export function IluMatcha() {
  return (
    <svg viewBox="0 0 200 150" className="w-36 h-36" xmlns="http://www.w3.org/2000/svg">
      <rect x="75" y="50" width="50" height="75" rx="10" fill="#F5F0E8" stroke="#C8BFB0" strokeWidth="1.5"/>
      <rect x="76" y="75" width="48" height="49" fill="#6DB86D" opacity="0.7"/>
      <rect x="76" y="70" width="48" height="12" fill="#A3D9A5" opacity="0.4"/>
      <ellipse cx="100" cy="75" rx="24" ry="8" fill="#C8E6C9" opacity="0.8"/>
      <ellipse cx="100" cy="73" rx="18" ry="5" fill="#E8F5E9" opacity="0.7"/>
      <rect x="112" y="45" width="5" height="60" rx="2.5" fill="#F26A4A" opacity="0.8"/>
      <rect x="82"  y="90" width="14" height="14" rx="3" fill="#fff" opacity="0.4"/>
      <rect x="100" y="95" width="12" height="12" rx="3" fill="#fff" opacity="0.3"/>
      <ellipse cx="100" cy="72" rx="10" ry="3" fill="#4CAF7D" opacity="0.3"/>
    </svg>
  );
}

// Bowl illustration for hero fallback
export function HeroBowlSVG() {
  return (
    <svg viewBox="0 0 320 320" style={{ position:"relative", width:224, height:224, filter:"drop-shadow(0 20px 40px rgba(26,26,24,0.18))" }} xmlns="http://www.w3.org/2000/svg">
      <line x1="80"  y1="60"  x2="185" y2="175" stroke="#8B6914" strokeWidth="5" strokeLinecap="round"/>
      <line x1="100" y1="45"  x2="200" y2="165" stroke="#A0792A" strokeWidth="5" strokeLinecap="round"/>
      <ellipse cx="160" cy="260" rx="80" ry="12" fill="#1A1A18" opacity="0.08"/>
      <path d="M70 180 Q70 265 160 268 Q250 265 250 180 Z" fill="#F5F0E8" stroke="#C8BFB0" strokeWidth="2"/>
      <ellipse cx="160" cy="180" rx="90" ry="22" fill="#EDE8DC" stroke="#C8BFB0" strokeWidth="2"/>
      <ellipse cx="155" cy="177" rx="60" ry="10" fill="#F5F0E8" opacity="0.5"/>
      <path d="M70 195 Q70 250 160 255 Q250 250 250 195" fill="none" stroke="#E8543A" strokeWidth="1.5" opacity="0.3"/>
      <ellipse cx="160" cy="178" rx="55" ry="14" fill="#F7F3EC"/>
      <g transform="translate(120,155)">
        <ellipse cx="0" cy="0"  rx="22" ry="9" fill="#F7F3EC" transform="rotate(-12)"/>
        <ellipse cx="0" cy="-5" rx="22" ry="7" fill="#F26A4A" transform="rotate(-12)" opacity="0.9"/>
      </g>
      <g transform="translate(165,150)">
        <ellipse cx="0" cy="0"  rx="22" ry="9" fill="#F7F3EC" transform="rotate(8)"/>
        <ellipse cx="0" cy="-5" rx="22" ry="7" fill="#C0392B" transform="rotate(8)" opacity="0.85"/>
      </g>
      <g transform="translate(148,162)">
        <ellipse cx="0" cy="0"  rx="20" ry="8" fill="#F7F3EC" transform="rotate(-3)"/>
        <ellipse cx="0" cy="-4" rx="20" ry="6" fill="#E8A830" transform="rotate(-3)" opacity="0.85"/>
      </g>
      <ellipse cx="108" cy="200" rx="10" ry="6" fill="#4CAF7D" opacity="0.85"/>
      <path d="M220 195 Q228 189 232 196 Q225 205 220 195 Z" fill="#F4A8A8" opacity="0.85"/>
    </svg>
  );
}

// Map ilu key → component
export const ILU_MAP = {
  sashimi: IluSashimi,
  dragon:  IluDragon,
  nigiri:  IluNigiri,
  ramen:   IluRamen,
  temaki:  IluTemaki,
  matcha:  IluMatcha,
};
