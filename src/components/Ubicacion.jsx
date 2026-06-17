import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";
import { HORARIOS, CONTACTO } from "./data";
import {
  WhatsappIcon,
  Location01Icon,
  Clock01Icon,
  Call02Icon,
  Mail01Icon,
  InstagramIcon,
  ArrowRight01Icon,
} from "hugeicons-react";

const CONTACT_ICONS = {
  "tel:": Call02Icon,
  "mailto:": Mail01Icon,
  "https://instagram": InstagramIcon,
};

function getIcon(href) {
  for (const [key, Icon] of Object.entries(CONTACT_ICONS)) {
    if (href.startsWith(key)) return Icon;
  }
  return Location01Icon;
}

export default function Ubicacion() {
  return (
    <Section id="ubicacion" style={{ background: C.paper, overflow: "hidden" }}>

      {/* Vision strip */}
      <div style={{ background: C.coral, padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "Noto Serif JP, serif", fontSize: 13,
            color: "rgba(245,240,232,0.7)", letterSpacing: "0.2em",
            textTransform: "uppercase", margin: "0 0 16px",
          }}>理念 · Nuestra visión</p>
          <h3 style={{
            fontFamily: "DM Sans, sans-serif", fontWeight: 900,
            fontSize: "clamp(1.4rem,3.5vw,2.2rem)",
            color: C.cream, lineHeight: 1.15,
            textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 20px",
          }}>
            Traer la esencia de Japón<br/>al corazón de Iguala
          </h3>
          <p style={{
            fontFamily: "DM Sans, sans-serif", fontSize: 15,
            color: "rgba(245,240,232,0.82)", lineHeight: 1.8,
            margin: 0, maxWidth: 580, marginInline: "auto",
          }}>
            En Maki Nori creemos que la buena comida no necesita ser importada — necesita ser hecha con intención. Cada roll, cada ramen y cada bebida sale de nuestras manos con el mismo respeto que un itamae dedica a su oficio.
          </p>
        </div>
      </div>

      {/* Values row */}
      <div style={{
        background: C.ink, padding: "32px 24px",
        display: "flex", justifyContent: "center", flexWrap: "wrap",
        position: "relative", overflow: "hidden",
      }}>
        <style>{`
          .ubi-img { display: block; }
          @media (max-width: 900px) {
            .ubi-img {
              height: 100% !important;
              width: 100% !important;
              right: 0 !important;
              top: 0 !important;
              object-fit: cover;
              opacity: 0.1 !important;
              mask-image: none !important;
              -webkit-mask-image: none !important;
            }
          }
        `}</style>

        {/* Imagen ubi fundiéndose desde la derecha (fondo negro = se funde) */}
        <img src="/ubi.png" alt="Maki Nori" className="ubi-img" style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          height: "180%", width: "auto", opacity: 0.85,
          pointerEvents: "none", userSelect: "none", zIndex: 0,
          maskImage: "linear-gradient(to left, black 60%, transparent)",
          WebkitMaskImage: "linear-gradient(to left, black 60%, transparent)",
        }} />

        {[
          { jp: "新鮮", label: "100% Fresco",  sub: "Sin congelados" },
          { jp: "手作り", label: "Hecho a mano", sub: "Cada pieza"    },
          { jp: "地元", label: "Iguala",        sub: "Orgullo local"  },
          { jp: "愛", label: "Con amor",        sub: "En cada orden"  },
        ].map(({ jp, label, sub }, i, arr) => (
          <div key={jp} style={{
            textAlign: "center", padding: "16px 32px",
            borderRight: i < arr.length - 1 ? "1px solid rgba(245,240,232,0.1)" : "none",
            position: "relative", zIndex: 1,
          }}>
            <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 22, color: C.coral, margin: "0 0 4px" }}>{jp}</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: C.cream, margin: "0 0 2px" }}>{label}</p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "rgba(245,240,232,0.4)", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Map + info */}
      <Container style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionTag>場所</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Visítanos <span style={{ color: C.coral }}>Pronto</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "start" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, height: 400, boxShadow: "0 8px 32px rgba(26,26,24,0.08)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30286.95!2d-99.5395!3d18.3503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdaee15ab33c8d%3A0x540ce5d45d9bb690!2sIguala%2C%20Guerrero%2C%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1"
              width="100%" height="400" style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Maki Nori Iguala"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "DM Sans, sans-serif" }}>

            <InfoBlock label="Dirección" icon={<Location01Icon size={14} color={C.coral} />}>
              <p style={{ fontWeight: 700, fontSize: 15, color: C.ink, margin: "0 0 2px" }}>Av. Bandera Nacional 120, Centro</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Iguala de la Independencia, Guerrero 40000, México</p>
            </InfoBlock>

            <InfoBlock label="Horarios" icon={<Clock01Icon size={14} color={C.coral} />}>
              {HORARIOS.map(({ dia, hora }) => (
                <div key={dia} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 14, padding: "8px 0", borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ color: C.muted }}>{dia}</span>
                  <span style={{ fontWeight: 700, color: C.ink }}>{hora}</span>
                </div>
              ))}
            </InfoBlock>

            <InfoBlock label="Contacto" icon={<Call02Icon size={14} color={C.coral} />}>
              {CONTACTO.map(({ href, label }) => {
                const Icon = getIcon(href);
                return <ContactLink key={href} href={href} Icon={Icon}>{label}</ContactLink>;
              })}
            </InfoBlock>

            <a href="https://wa.me/527331002030" target="_blank" rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#25D366", borderRadius: 10, padding: "16px 20px",
                textDecoration: "none", transition: "opacity 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <WhatsappIcon size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Pedir por WhatsApp</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Entrega en Iguala · 30-45 min</p>
              </div>
              <ArrowRight01Icon size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: "auto" }} />
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function InfoBlock({ label, icon, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        {icon}
        <SectionTag>{label}</SectionTag>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

function ContactLink({ href, children, Icon }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 14, color: hov ? C.coral : C.ink,
        textDecoration: "none", transition: "color 0.2s",
        padding: "4px 0", display: "flex", alignItems: "center", gap: 8,
      }}
    >
      <Icon size={14} color={hov ? C.coral : C.muted} />
      {children}
    </a>
  );
}