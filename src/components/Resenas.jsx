import { useState, useEffect } from "react";
import { C, FONT, Section, SectionTitle, FrameCorners } from "./tokens";
import { StarIcon, ArrowLeft01Icon, ArrowRight01Icon } from "hugeicons-react";

const RESENAS = [
  { nombre: "Daniel Martínez",   avatar: "DM", color: "#2A8B8B", estrellas: 5, fecha: "hace 2 días",
    texto: "El Chimmy Roll es una experiencia aparte. Nunca pensé que en Iguala iba a encontrar sushi de este nivel. El servicio es increíble y el patio te da otra vibra. Ya voy seguido con mi familia.",
    platillo: "Chimmy Roll", ocasion: "En familia" },
  { nombre: "Andrés Uriostegui", avatar: "AU", color: "#E8915C", estrellas: 5, fecha: "hace 1 semana",
    texto: "Pedí el Omakase y fue la mejor decisión. El chef eligió por mí y cada tiempo fue una sorpresa. El Ramen Buldak Doble Picante casi me mata, pero valió totalmente la pena.",
    platillo: "Omakase + Buldak", ocasion: "Reto picante" },
  { nombre: "Alexa Yamm",        avatar: "AY", color: "#6B7270", estrellas: 5, fecha: "hace 3 días",
    texto: "El ambiente es muy bonito y el sushi se ve y sabe increíble. El Philadelphia es mi favorito, siempre fresco. Lo recomiendo muchísimo para una salida especial o con amigos.",
    platillo: "Philadelphia Roll", ocasion: "Cita" },
  { nombre: "Sofía Reyes",       avatar: "SR", color: "#1F6B6B", estrellas: 5, fecha: "hace 5 días",
    texto: "Vine con mis amigas a celebrar mi cumpleaños y fue perfecto. El trato es muy amable y la comida llegó rápido. Los Kushiagues de camarón estaban crujientes y el Mojito ayudó a la fiesta.",
    platillo: "Kushiagues + Mojito", ocasion: "Cumpleaños" },
  { nombre: "Carlos Mendoza",    avatar: "CM", color: "#2A5C8A", estrellas: 5, fecha: "hace 1 semana",
    texto: "El Snow Roll me sorprendió muchísimo. Nunca había probado algo así en la región. El Mogu Mogu de lychee es el complemento perfecto. Ya lo recomendé a todos en el trabajo.",
    platillo: "Snow Roll + Mogu Mogu", ocasion: "Después del trabajo" },
  { nombre: "Valeria Torres",    avatar: "VT", color: "#D17A45", estrellas: 5, fecha: "hace 2 semanas",
    texto: "Probé el Volcano Roll y wow, el chipotle sí pega rico. No esperaba encontrar algo tan bien hecho aquí. El lugar está limpio y los precios son justos para la calidad. 10/10.",
    platillo: "Volcano Roll", ocasion: "Primera visita" },
  { nombre: "Mariana Nava",      avatar: "MN", color: "#3D7A4A", estrellas: 5, fecha: "hace 4 días",
    texto: "Soy vegetariana y casi no pido sushi por miedo a que todo lleve pescado. El Veggi Roll y el Tropical me salvaron: piña, plátano frito y todo fresco. Hasta el chef me armó un omakase sin mariscos.",
    platillo: "Veggi + Tropical", ocasion: "Vegetariana" },
  { nombre: "Luis Pineda",       avatar: "LP", color: "#8A5A2A", estrellas: 4, fecha: "hace 6 días",
    texto: "El Kang de res está brutal, caldo con cuerpo. Un sábado en la noche se llenó y tardamos un poco, pero el ramen valió la espera. Volvería en un día entre semana para ir más tranquilo.",
    platillo: "Kang Res", ocasion: "Sábado ocupado" },
  { nombre: "Fernanda Solís",    avatar: "FS", color: "#B33A2B", estrellas: 5, fecha: "hace 3 semanas",
    texto: "Noche de sake Hide y Chimmy Roll. El patio, las luces y esa botella con el casco… se siente otro mundo. Mi pareja y yo ya lo tenemos como nuestro lugar para fechas importantes.",
    platillo: "Sake Hide + Chimmy", ocasion: "Aniversario" },
  { nombre: "Diego Catalán",     avatar: "DC", color: "#2A6B8B", estrellas: 5, fecha: "hace 8 días",
    texto: "Primera vez y salí confundido de lo bueno que está. Pedí Mar y Tierra y Pops de camarón. Pensé que el sushi “de pueblo” era otra cosa. Aquí no: se nota que lo hacen al momento.",
    platillo: "Mar y Tierra + Pops", ocasion: "Primera visita" },
  { nombre: "Paola Jiménez",     avatar: "PJ", color: "#C45C7A", estrellas: 5, fecha: "hace 2 días",
    texto: "Llevé a mis hijos. Pedimos California, palomitas flaming hot y un Mogu Mogu de fresa. Los niños felices, yo también. Hay espacio afuera y no te apuran. Ideal para ir en familia sin estrés.",
    platillo: "California + palomitas", ocasion: "Con niños" },
  { nombre: "Roberto Saavedra",  avatar: "RS", color: "#4A5C6B", estrellas: 4, fecha: "hace 12 días",
    texto: "Fui a comer entre semana con compañeros. El New York Roll y unos aros de cebolla nos alcanzaron bien. Precios honestos. Nada más que el café tardó un poco, por eso no le pongo el cinco.",
    platillo: "New York + aros", ocasion: "Comida de oficina" },
  { nombre: "Camila Beltrán",    avatar: "CB", color: "#7A4A8A", estrellas: 5, fecha: "hace 1 mes",
    texto: "El Almond Roll parece postre y roll al mismo tiempo: camarón tempura, piña, nuez. Lo subí a stories y me llovieron mensajes de “¿dónde es?”. Maki Nori, Iguala. Vayan.",
    platillo: "Almond Roll", ocasion: "Para Instagram" },
  { nombre: "Jorge Adame",       avatar: "JA", color: "#B33A2B", estrellas: 5, fecha: "hace 9 días",
    texto: "Acepté el reto del Buldak Doble Picante. Lloré, sudé, pedí Ramune de lychee y al final pedí otro. Si te gusta el fuego, este es tu templo. El chef se rió conmigo, buen ambiente.",
    platillo: "Buldak Doble Picante", ocasion: "Reto picante" },
  { nombre: "Elena Figueroa",    avatar: "EF", color: "#1A5E5E", estrellas: 5, fecha: "hace 3 semanas",
    texto: "No sabía qué pedir y dejé el omakase. Me armó una tabla con Tropical, Almond y un kushiague de plátano. Cada pieza distinta. Me sentí consentida, no como en una cadena.",
    platillo: "Omakase", ocasion: "Me dejé llevar" },
  { nombre: "Hugo Nava",         avatar: "HN", color: "#5C4A2A", estrellas: 4, fecha: "hace 2 semanas",
    texto: "Cerveza Lucky, Tsingtao y rolls para la mesa. Estuvo muy bien; el sábado hay más ruido y menos mesas, hay que llegar temprano. El soju de durazno se acaba rápido, pidan dos.",
    platillo: "Lucky + Soju", ocasion: "Con amigos" },
  { nombre: "Natalia Cruz",      avatar: "NC", color: "#C47A2A", estrellas: 5, fecha: "hace 1 día",
    texto: "El Tropical Roll con plátano frito y salsa de anguila me tiene soñando. Dulce-salado perfecto. Pedimos también Piña Colada y nos quedamos platicando en el patio hasta que cerraron casi.",
    platillo: "Tropical + Piña Colada", ocasion: "Tarde larga" },
  { nombre: "Iván Romero",       avatar: "IR", color: "#2A4A3A", estrellas: 5, fecha: "hace 4 semanas",
    texto: "Salí tarde y pedí Yakimeshi mixto para llevar. Llegó calientito, con el arroz suelto y el camarón al punto. A las once de la noche sabe a gloria. El WhatsApp del pedido es rapidísimo.",
    platillo: "Yakimeshi Mixto", ocasion: "Para llevar" },
  { nombre: "Ximena Abarca",     avatar: "XA", color: "#8B2A5C", estrellas: 5, fecha: "hace 6 días",
    texto: "Pedí Buldak Carbonara cremosa y un Calpis. Contraste perfecto: picante y suave. El lugar tiene esa mezcla rara de sushi-ya y patio iguala. Me encanta. Ya soy cliente de cada viernes.",
    platillo: "Buldak Carbonara", ocasion: "Viernes de ramen" },
  { nombre: "Miguel Á. Flores",  avatar: "MF", color: "#2A3A5C", estrellas: 5, fecha: "hace 5 semanas",
    texto: "Traje a unos primos de Chilpancingo “a ver si el sushi de Iguala sirve”. Se quedaron callados al segundo roll. Pedimos Arrachera, Philadelphia y hidromiel Rey Rurik. Repetiremos visita sí o sí.",
    platillo: "Arrachera + Hidromiel", ocasion: "Visita de fuera" },
];

function Stars({ count = 5, filled = 5, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} size={size} color={i < filled ? "#F5B841" : "rgba(245,240,232,0.2)"} />
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: 0.7 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function ResenaCard({ resena, active }) {
  return (
    <div style={{
      background: active
        ? "linear-gradient(180deg, rgba(245,240,232,0.11), rgba(245,240,232,0.04))"
        : "rgba(245,240,232,0.04)",
      borderRadius: 6, padding: "28px 26px 22px",
      border: `1.5px solid ${active ? C.gold : "rgba(244,239,230,0.12)"}`,
      boxShadow: active ? "0 14px 40px rgba(196,163,106,0.18)" : "none",
      transition: "all 0.4s ease",
      opacity: active ? 1 : 0.5,
      transform: active ? "scale(1)" : "scale(0.97)",
      minHeight: 268, display: "flex", flexDirection: "column", gap: 14,
      backdropFilter: "blur(4px)",
      position: "relative",
    }}>
      {active && <FrameCorners color={C.gold} size={14} thick={1.5} inset={8} />}

      <div style={{
        fontFamily: FONT.serif, fontSize: 42, lineHeight: 0.6,
        color: C.gold, opacity: 0.45, marginBottom: -4,
      }}>“</div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: "50%", background: resena.color,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: `0 0 0 2px ${C.gold}55`,
        }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>{resena.avatar}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: FONT.serif, fontSize: 15, fontWeight: 700, color: C.cream, margin: 0 }}>{resena.nombre}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
            <Stars filled={resena.estrellas} />
            <span style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(244,239,230,0.4)" }}>{resena.fecha}</span>
          </div>
        </div>
        <GoogleMark />
      </div>

      <p style={{
        fontFamily: FONT.serif, fontSize: 14, color: "rgba(244,239,230,0.82)",
        lineHeight: 1.85, margin: 0, flex: 1, fontStyle: "italic",
      }}>
        {resena.texto}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <span style={{
          background: "rgba(42,139,139,0.18)", border: "1px solid rgba(42,139,139,0.4)",
          borderRadius: 4, padding: "5px 11px",
          fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, color: C.gold,
        }}>
          {resena.platillo}
        </span>
        {resena.ocasion && (
          <span style={{
            background: "rgba(196,163,106,0.12)", border: "1px solid rgba(196,163,106,0.35)",
            borderRadius: 4, padding: "5px 11px",
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, color: "rgba(244,239,230,0.7)",
          }}>
            {resena.ocasion}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Resenas() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrent(c => (c + 1) % RESENAS.length);
  const prev = () => setCurrent(c => (c - 1 + RESENAS.length) % RESENAS.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5200);
    return () => clearInterval(t);
  }, [paused, current]);

  const len = RESENAS.length;
  const visible = [(current - 1 + len) % len, current, (current + 1) % len];
  const avg = (RESENAS.reduce((s, r) => s + r.estrellas, 0) / len).toFixed(1);

  const navBtn = (onClick, Icon) => (
    <button onClick={onClick} style={{
      width: 42, height: 42, borderRadius: "50%",
      border: `1.5px solid rgba(245,240,232,0.22)`, background: "rgba(245,240,232,0.06)",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = "rgba(196,163,106,0.15)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,240,232,0.22)"; e.currentTarget.style.background = "rgba(245,240,232,0.06)"; }}
    >
      <Icon size={16} color={C.cream} />
    </button>
  );

  return (
    <Section id="resenas" style={{ background: C.navy, overflow: "hidden", position: "relative" }}>
      <style>{`
        .resenas-geisha { display: block; }
        @media (max-width: 1000px) {
          .resenas-geisha {
            height: 100% !important;
            width: 100% !important;
            left: 0 !important;
            bottom: 0 !important;
            top: 0 !important;
            object-fit: cover;
            opacity: 0.1 !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
        }
      `}</style>

      <div className="pattern-seigaiha-dark" style={{ position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none" }} />

      <img src="/comensal.png" alt="" className="resenas-geisha" loading="lazy" decoding="async" style={{
        position: "absolute", left: 0, bottom: 0,
        height: "88%", width: "auto", opacity: 0.9,
        pointerEvents: "none", userSelect: "none",
        maskImage: "linear-gradient(to right, black 65%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, black 65%, transparent)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <SectionTitle kicker="口コミ" jp="レビュー" light ornament="声">
          Lo que dicen <span style={{ color: C.gold, fontStyle: "italic" }}>nuestros clientes</span>
        </SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: -28, marginBottom: 44, flexWrap: "wrap" }}>
          <Stars filled={5} size={16} />
          <span style={{ fontFamily: FONT.serif, fontSize: 18, fontWeight: 700, color: C.cream }}>{avg}</span>
          <span style={{ fontFamily: FONT.sans, fontSize: 13, color: "rgba(244,239,230,0.5)" }}>
            · {len} opiniones en Google
          </span>
        </div>

        <div
          className="resenas-grid resena-in"
          key={current}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 36 }}
        >
          {visible.map((idx, pos) => <ResenaCard key={idx} resena={RESENAS[idx]} active={pos === 1} />)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {navBtn(prev, ArrowLeft01Icon)}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
            {RESENAS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Opinión ${i + 1}`} style={{
                width: i === current ? 22 : 7, height: 7, borderRadius: 4,
                border: "none", background: i === current ? C.gold : "rgba(244,239,230,0.22)",
                cursor: "pointer", transition: "all 0.3s", padding: 0,
              }}/>
            ))}
          </div>
          {navBtn(next, ArrowRight01Icon)}
        </div>
        <p style={{
          textAlign: "center", margin: "16px 0 0",
          fontFamily: FONT.sans, fontSize: 11, color: "rgba(244,239,230,0.35)",
          letterSpacing: "0.08em",
        }}>
          Cambian solas · pasa el cursor para pausar
        </p>
      </div>
    </Section>
  );
}
