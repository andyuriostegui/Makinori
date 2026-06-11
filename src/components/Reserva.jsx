import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";

const HORAS = ["13:00","13:30","14:00","14:30","15:00","15:30","19:00","19:30","20:00","20:30","21:00","21:30"];
const PERSONAS_OPTS = ["1","2","3","4","5-6","7-12"];

const inputStyle = {
  width: "100%", padding: "14px 16px",
  border: `1.5px solid ${C.border}`, borderRadius: 8,
  fontSize: 14, color: C.ink, background: "#fff",
  fontFamily: "DM Sans, sans-serif", boxSizing: "border-box",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.15em",
        color: C.muted, marginBottom: 8, fontFamily: "DM Sans, sans-serif",
      }}>{label}</label>
      {children}
    </div>
  );
}

export default function Reserva() {
  const [sent, setSent] = useState(false);
  const [personas, setPersonas] = useState("");

  return (
    <Section id="reserva" style={{ background: C.cream }}>
      <Container max={680}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionTag>予約</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3.2rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Reserva <span style={{ color: C.coral }}>tu Mesa</span>
          </h2>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 12, fontFamily: "DM Sans, sans-serif" }}>
            Confirmamos en menos de 2 horas · Grupos de hasta 12 personas
          </p>
        </div>

        {sent ? <SuccessMsg /> : (
          <div style={{
            background: "#fff", borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: "40px 40px",
            boxShadow: "0 8px 40px rgba(26,26,24,0.06)",
          }}>
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Nombre completo">
                  <input required type="text" placeholder="Ej: María González" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.boxShadow = `0 0 0 3px rgba(232,84,58,0.1)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                  />
                </Field>
                <Field label="Teléfono">
                  <input required type="tel" placeholder="+52 733 000 0000" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.boxShadow = `0 0 0 3px rgba(232,84,58,0.1)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                  />
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Field label="Fecha">
                  <input required type="date" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.boxShadow = `0 0 0 3px rgba(232,84,58,0.1)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                  />
                </Field>
                <Field label="Hora">
                  <select required style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="" disabled>Selecciona hora</option>
                    {HORAS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Número de personas">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PERSONAS_OPTS.map(p => (
                    <button type="button" key={p} onClick={() => setPersonas(p)} style={{
                      padding: "10px 18px", borderRadius: 8, fontSize: 13,
                      fontWeight: 600, cursor: "pointer",
                      border: `1.5px solid ${personas === p ? C.coral : C.border}`,
                      background: personas === p ? C.coral : "transparent",
                      color: personas === p ? C.cream : C.muted,
                      fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
                    }}>{p}</button>
                  ))}
                </div>
              </Field>

              <Field label="Nota especial (opcional)">
                <textarea rows={3} placeholder="Alergias, celebraciones, peticiones especiales..."
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => { e.target.style.borderColor = C.coral; e.target.style.boxShadow = `0 0 0 3px rgba(232,84,58,0.1)`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </Field>

              {/* Info strip */}
              <div style={{
                display: "flex", gap: 20, flexWrap: "wrap",
                background: C.paper, borderRadius: 8, padding: "14px 16px",
              }}>
                {["✅ Sin costo de reserva", "📱 Confirmación por WhatsApp", "❌ Cancelación gratuita 24h antes"].map(t => (
                  <span key={t} style={{ fontSize: 11, color: C.muted, fontFamily: "DM Sans, sans-serif" }}>{t}</span>
                ))}
              </div>

              <button type="submit" style={{
                background: C.coral, color: C.cream, border: "none",
                padding: "16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C93D22"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.coral; e.currentTarget.style.transform = "translateY(0)"; }}
              >Solicitar Reserva →</button>
            </form>
          </div>
        )}
      </Container>
    </Section>
  );
}

function SuccessMsg() {
  return (
    <div style={{
      textAlign: "center", padding: "64px 32px",
      background: "#fff", borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: "0 8px 40px rgba(26,26,24,0.06)",
    }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>🎋</div>
      <h3 style={{ fontSize: 26, fontWeight: 900, color: C.ink, fontFamily: "DM Sans, sans-serif", margin: "0 0 12px" }}>
        ¡Reserva enviada!
      </h3>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: "DM Sans, sans-serif", lineHeight: 1.8, margin: 0 }}>
        Te confirmaremos por WhatsApp en menos de 2 horas.<br/>
        ¡Gracias por elegir <strong style={{ color: C.ink }}>Maki Nori</strong>!
      </p>
    </div>
  );
}