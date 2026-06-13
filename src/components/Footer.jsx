import { useState } from "react";
import { C } from "./tokens";
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
  { label: "Reserva",      href: "#reserva"   },
  { label: "Ubicación",    href: "#ubicacion" },
];

const SOCIAL = [
  { href: "https://instagram.com/makinorimx", label: "Instagram", Icon: InstagramIcon },
  { href: "https://facebook.com",             label: "Facebook",  Icon: Facebook01Icon },
  { href: "https://wa.me/527331002030",        label: "WhatsApp",  Icon: WhatsappIcon  },
];

export default function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.cream, fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ padding: "64px 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1px solid ${C.coral}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "Noto Serif JP, serif", fontSize: 14, color: C.coral }}>海</span>
              </div>
              <div>
                <p style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em", margin: 0 }}>Maki Nori</p>
                <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 10, color: "rgba(245,240,232,0.4)", letterSpacing: "0.15em", margin: 0 }}>巻きのり · IGUALA</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", lineHeight: 1.8, maxWidth: 280, margin: "0 0 20px" }}>
              Cocina japonesa boutique en el corazón de Iguala, Guerrero. Rolls frescos, ramen especial y bebidas importadas.
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
              <FooterLink href="tel:+527331002030" icon={<Call02Icon size={13} />}>+52 733 100 2030</FooterLink>
              <FooterLink href="mailto:hola@makinori.mx" icon={<Mail01Icon size={13} />}>hola@makinori.mx</FooterLink>
              <FooterLink href="https://wa.me/527331002030" icon={<WhatsappIcon size={13} />}>WhatsApp directo</FooterLink>
            </div>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", margin: "0 0 8px" }}>Dirección</p>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Location01Icon size={13} color="rgba(245,240,232,0.3)" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", lineHeight: 1.7, margin: 0 }}>
                  Av. Bandera Nacional 120, Centro<br/>
                  Iguala, Guerrero, México
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(245,240,232,0.08)", padding: "20px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 11, color: "rgba(245,240,232,0.25)", margin: 0 }}>© 2026 Maki Nori · Todos los derechos reservados</p>
          <p style={{ fontSize: 11, color: "rgba(245,240,232,0.25)", margin: 0 }}>Hecho con <span style={{ color: C.coral }}>愛</span> en Iguala, Guerrero, México</p>
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
        color: hov ? C.coral : "rgba(245,240,232,0.55)",
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
        border: `1px solid ${hov ? C.coral : "rgba(245,240,232,0.2)"}`,
        color: hov ? C.coral : "rgba(245,240,232,0.5)",
        transition: "all 0.2s", textDecoration: "none",
      }}
      title={children}
    >
      <Icon size={16} color={hov ? C.coral : "rgba(245,240,232,0.5)"} />
    </a>
  );
}