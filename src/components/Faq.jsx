import { useEffect, useState } from "react";
import { C, FONT, Section, Container, SectionTitle } from "./tokens";

const FAQS = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Entra al menú, toca + en lo que se antoje y pulsa Pedir. Se arma un mensaje de WhatsApp con tu orden, notas y total. También puedes escribirnos directo al 733 159 89 96.",
  },
  {
    q: "¿Hacen domicilio en Iguala?",
    a: "Sí. Entregamos en Iguala de la Independencia y alrededores, en unos 30–45 minutos según la zona. Al mandar el pedido por WhatsApp confirmamos si llegamos a tu colonia.",
  },
  {
    q: "¿Cuál es el horario?",
    a: "Lunes a viernes 13:00 a 22:00. Sábado 12:00 a 23:00. Domingo 12:00 a 20:00.",
  },
  {
    q: "¿Qué es el omakase?",
    a: "Dejas el menú en manos del chef. Le dices si quieres mariscos, vegetariano, picante o si hay alergias, y arma una selección con lo más fresco del día. Se pide por WhatsApp.",
  },
  {
    q: "¿Puedo pedir en mesa o para llevar?",
    a: "Las tres: en mesa (pones el número), para llevar, o a domicilio con colonia, calle y referencias.",
  },
  {
    q: "¿Hacen cambios? Sin pepino, extra picante…",
    a: "Sí. En cada platillo hay un campo de nota. Escríbelo ahí y viaja en el WhatsApp para que la barra lo vea.",
  },
  {
    q: "¿Hay opciones sin pescado o vegetarianas?",
    a: "El Veggi Roll y el Tropical van sin pescado. Si tienes otra restricción, el omakase también se arma a tu medida.",
  },
  {
    q: "¿Dónde están?",
    a: "Perif. Sur 12, colonia 24 de Febrero, Iguala de la Independencia, Guerrero. Hay mapa en la sección de ubicación.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
    document.getElementById("faq-schema")?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <Section id="faq" style={{ background: C.washi, position: "relative", overflow: "hidden" }}>
      <div className="pattern-asanoha" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
      <Container max={760} style={{ position: "relative" }}>
        <SectionTitle kicker="よくある質問" jp="FAQ" ornament="問">
          Preguntas <span style={{ color: C.teal, fontStyle: "italic" }}>frecuentes</span>
        </SectionTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((item, i) => {
            const on = open === i;
            return (
              <div
                key={item.q}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${on ? C.teal : C.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: on ? "0 10px 28px rgba(26,138,150,0.1)" : "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                  style={{
                    width: "100%", textAlign: "left", background: "none", border: "none",
                    padding: "16px 20px", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "space-between", gap: 16,
                    fontFamily: FONT.serif, fontSize: 17, fontWeight: 700, color: C.ink,
                  }}
                >
                  {item.q}
                  <span aria-hidden style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                    border: `1.5px solid ${on ? C.coral : C.border}`,
                    color: on ? C.coral : C.muted,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700, fontFamily: FONT.sans,
                    transform: on ? "rotate(45deg)" : "none",
                    transition: "transform 0.2s, border-color 0.2s, color 0.2s",
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: on ? 240 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s ease",
                }}>
                  <p style={{
                    margin: 0, padding: "0 20px 18px",
                    fontFamily: FONT.sans, fontSize: 14, color: C.muted, lineHeight: 1.75,
                  }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
