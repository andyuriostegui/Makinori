import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";
import { HORARIOS, CONTACTO } from "./data";

export default function Ubicacion() {
  return (
    <Section id="ubicacion" style={{ background: C.paper, overflow: "hidden" }}>

      {/* Vision strip — full bleed coral */}
      <div style={{
        background: C.coral, padding: "56px 24px",
        textAlign: "center", marginBottom: 0,
      }}>
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
            color: "rgba(245,240,232,0.82)", lineHeight: 1.8, margin: 0, maxWidth: 580, marginInline: "auto",
          }}>
            En Maki Nori creemos que la buena comida no necesita ser importada — necesita ser hecha con intención. Cada roll, cada ramen y cada bebida sale de nuestras manos con el mismo respeto que un itamae dedica a su oficio. Sin atajos, sin congelados, sin pretensiones.
          </p>
        </div>
      </div>

      {/* Values row */}
      <div style={{
        background: C.ink, padding: "32px 24px",
        display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0,
      }}>
        {[
          { jp: "新鮮", label: "100% Fresco", sub: "Sin congelados" },
          { jp: "手作り", label: "Hecho a mano", sub: "Cada pieza" },
          { jp: "地元", label: "Iguala", sub: "Orgullo local" },
          { jp: "愛", label: "Con amor", sub: "En cada orden" },
        ].map(({ jp, label, sub }, i, arr) => (
          <div key={jp} style={{
            textAlign: "center", padding: "16px 32px",
            borderRight: i < arr.length - 1 ? "1px solid rgba(245,240,232,0.1)" : "none",
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

          {/* Map */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, height: 400, boxShadow: "0 8px 32px rgba(26,26,24,0.08)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30286.95!2d-99.5395!3d18.3503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdaee15ab33c8d%3A0x540ce5d45d9bb690!2sIguala%2C%20Guerrero%2C%20M%C3%A9xico!5e0!3m2!1ses!2smx!4v1"
              width="100%" height="400" style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Maki Nori Iguala"
            />
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28, fontFamily: "DM Sans, sans-serif" }}>

            <InfoBlock label="Dirección">
              <p style={{ fontWeight: 700, fontSize: 15, color: C.ink, margin: "0 0 2px" }}>Av. Bandera Nacional 120, Centro</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Iguala de la Independencia, Guerrero 40000, México</p>
            </InfoBlock>

            <InfoBlock label="Horarios">
              {HORARIOS.map(({ dia, hora }) => (
                <div key={dia} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 14, padding: "8px 0",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ color: C.muted }}>{dia}</span>
                  <span style={{ fontWeight: 700, color: C.ink }}>{hora}</span>
                </div>
              ))}
            </InfoBlock>

            <InfoBlock label="Contacto">
              {CONTACTO.map(({ href, label }) => (
                <ContactLink key={href} href={href}>{label}</ContactLink>
              ))}
            </InfoBlock>

            {/* WhatsApp CTA */}
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
                <WhatsappIcon />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>Pedir por WhatsApp</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Entrega en Iguala · 30-45 min</p>
              </div>
              <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 18 }}>→</span>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}><SectionTag>{label}</SectionTag></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

function ContactLink({ href, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ fontSize: 14, color: hov ? C.coral : C.ink, textDecoration: "none", transition: "color 0.2s", padding: "2px 0" }}
    >{children}</a>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}