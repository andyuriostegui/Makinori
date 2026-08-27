import { useState } from "react";
import { C, FONT } from "./tokens";
import {
  InstagramIcon,
  Facebook01Icon,
  WhatsappIcon,
  Call02Icon,
  Mail01Icon,
  Location01Icon,
} from "hugeicons-react";

const LINKS = [
  { label: "Menú",         href: "#menu"      },
  { label: "Recomendados", href: "#productos"  },
  { label: "Omakase",      href: "#omakase"   },
  { label: "Síguenos",     href: "#linktree"  },
  { label: "Ubicación",    href: "#ubicacion" },
];

const SOCIAL = [
  { href: "https://www.instagram.com/sushi.makinori/", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.facebook.com/makinorisushi/?locale=es_LA",             label: "Facebook",  Icon: Facebook01Icon },
  { href: "https://wa.me/527331598996",        label: "WhatsApp",  Icon: WhatsappIcon  },
];

export default function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.cream, fontFamily: FONT.sans }}>
      <div className="noren-bar" />
      <div style={{ padding: "64px 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1px solid ${C.gold}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: FONT.jp, fontSize: 14, color: C.gold }}>海</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 20, letterSpacing: "0.04em", margin: 0, fontFamily: FONT.serif }}>Maki Nori</p>
                <p style={{ fontFamily: FONT.jp, fontSize: 10, color: "rgba(244,239,230,0.4)", letterSpacing: "0.18em", margin: 0 }}>巻きのり · IGUALA</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", lineHeight: 1.8, maxWidth: 280, margin: "0 0 20px" }}>
              Cocina japonesa en el corazón de Iguala, Guerrero. Rolls frescos, ramen especial y bebidas importadas.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIAL.map(({ href, label, Icon }) => (
                <SocialBtn key={href} href={href} Icon={Icon}>{label}</SocialBtn>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", margin: "0 0 16px" }}>Navegación</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LINKS.map(({ label, href }) => <FooterLink key={href} href={href}>{label}</FooterLink>)}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", margin: "0 0 16px" }}>Contacto</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FooterLink href="tel:+527331598996" icon={<Call02Icon size={13} />}>+52 733 159 89 96</FooterLink>
              <FooterLink href="https://wa.me/527331598996" icon={<WhatsappIcon size={13} />}>WhatsApp directo</FooterLink>
            </div>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", margin: "0 0 8px" }}>Dirección</p>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Location01Icon size={13} color="rgba(245,240,232,0.3)" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.7, margin: 0 }}>
                Perif. Sur 12, 24 de Febrero, 40000 Iguala de la Independencia, Gro.<br/>
                  Iguala, Guerrero, México
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,240,232,0.08)", padding: "20px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 11, color: "rgba(244,239,230,0.25)", margin: 0 }}>© 2026 Maki Nori · Todos los derechos reservados</p>
          <p style={{ fontSize: 11, color: "rgba(244,239,230,0.25)", margin: 0 }}>Hecho con <span style={{ color: C.gold, fontFamily: FONT.jp }}>愛</span> en Iguala, Guerrero, México</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 13, textDecoration: "none",
        color: hov ? C.gold : "rgba(244,239,230,0.55)",
        transition: "color 0.2s",
        display: "flex", alignItems: "center", gap: 8,
      }}
    >
      {icon && <span style={{ opacity: 0.5 }}>{icon}</span>}
      {children}
    </a>
  );
}

function SocialBtn({ href, children, Icon }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: 8,
        border: `1px solid ${hov ? C.gold : "rgba(244,239,230,0.2)"}`,
        color: hov ? C.gold : "rgba(244,239,230,0.5)",
        transition: "all 0.2s", textDecoration: "none",
      }}
      title={children}
    >
      <Icon size={16} color={hov ? C.gold : "rgba(244,239,230,0.5)"} />
    </a>
  );
}