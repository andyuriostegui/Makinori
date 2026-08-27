import { C, FONT, Section, Container, SectionTitle } from "./tokens";
import { WA_PEDIDO } from "./data";
import { useCarritoCtx } from "./Carrito";

const STEPS = [
  {
    n: "01",
    title: "Mira el menú",
    text: "Rolls, ramen, snacks y bebidas. Toca + en lo que se antoje y se suma al pedido.",
    href: "#menu",
    cta: "Ver menú",
  },
  {
    n: "02",
    title: "Ármalo a tu gusto",
    text: "Sube o baja cantidades y deja nota: sin pepino, extra picante, el punto del ramen.",
    href: "#productos",
    cta: "Ver favoritos",
  },
  {
    n: "03",
    title: "Mándalo por WhatsApp",
    text: "Pedir arma el ticket con tu nombre, cómo lo quieres y el total. Nosotros confirmamos.",
    href: WA_PEDIDO,
    cta: "Abrir WhatsApp",
  },
];

export default function ComoPedir() {
  const { count, setOpen } = useCarritoCtx();

  const go = (s) => {
    if (s.n === "03" && count > 0) {
      setOpen(true);
      return;
    }
    if (s.href.startsWith("http")) {
      window.open(s.href, "_blank", "noopener,noreferrer");
      return;
    }
    document.querySelector(s.href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section id="como-pedir" style={{ background: C.navy }}>
      <Container>
        <SectionTitle kicker="ご注文" jp="HOW TO" light ornament="三">
          Cómo hacer tu pedido en <span style={{ color: C.coral, fontStyle: "italic" }}>3 pasos</span>
        </SectionTitle>

        <div className="como-steps-row" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18,
        }}>
          {STEPS.map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => go(s)}
              style={{
                textAlign: "left", cursor: "pointer",
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(255,255,255,0.14)",
                borderRadius: 14, padding: "28px 24px 24px",
                fontFamily: FONT.sans,
              }}
            >
              <span style={{
                fontFamily: FONT.serif, fontSize: 13, fontWeight: 800,
                color: C.coral, letterSpacing: "0.16em",
              }}>{s.n}</span>
              <h3 style={{
                fontFamily: FONT.serif, fontSize: 22, fontWeight: 700,
                color: "#fff", margin: "10px 0 10px",
              }}>{s.title}</h3>
              <p style={{
                margin: "0 0 16px", fontSize: 14, lineHeight: 1.7,
                color: "rgba(255,255,255,0.62)",
              }}>{s.text}</p>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: C.coral,
              }}>{s.cta} →</span>
            </button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
