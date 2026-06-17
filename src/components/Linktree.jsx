import { useState } from "react";
import { C, SectionTag, Section, Container } from "./tokens";
import {
  InstagramIcon,
  TiktokIcon,
  WhatsappIcon,
  Facebook01Icon,
  Location01Icon,
  Menu01Icon,
} from "hugeicons-react";

// ─── Configura aquí tus links reales ──────────────────────────
const LINKS = [
  {
    label: "Instagram",
    sub: "@sushi.makinori",
    href: "https://www.instagram.com/sushi.makinori/",
    Icon: InstagramIcon,
    color: "#E1306C",
  },
  {
    label: "TikTok",
    sub: "@makinori.sushi",
    href: "https://www.tiktok.com/@makinori.sushi",
    Icon: TiktokIcon,
    color: "#1A2B2B",
  },
  {
    label: "Pide por WhatsApp",
    sub: "Entrega en Iguala · 30-45 min",
    href: "https://wa.me/527331002030",
    Icon: WhatsappIcon,
    color: "#25D366",
  },
  {
    label: "Facebook",
    sub: "Maki Nori Iguala",
    href: "https://facebook.com",
    Icon: Facebook01Icon,
    color: "#1877F2",
  },
  {
    label: "Ver Menú completo",
    sub: "Todos nuestros rolls y bebidas",
    href: "#menu",
    Icon: Menu01Icon,
    color: C.teal,
  },
  {
    label: "Cómo llegar",
    sub: "Av. Bandera Nacional 120, Centro",
    href: "#ubicacion",
    Icon: Location01Icon,
    color: C.coral,
  },
];

// ─── Videos (pega aquí los links de TikTok/Instagram) ─────────
// Para cada video pon el link del post. Al dar click abre el video.
const VIDEOS = [
  { titulo: "Cómo hacemos el Dragon Roll", red: "TikTok",    href: "https://www.tiktok.com/@makinori.sushi", thumb: "/maki2.jpeg" },
  { titulo: "Ramen Buldak en acción",      red: "Instagram", href: "https://www.instagram.com/sushi.makinori/", thumb: "/maki10.jpeg" },
  { titulo: "Detrás de la barra",          red: "TikTok",    href: "https://www.tiktok.com/@makinori.sushi", thumb: "/maki5.jpeg" },
];

function LinkRow({ item }) {
  const [hov, setHov] = useState(false);
  const { label, sub, href, Icon, color } = item;
  const isAnchor = href.startsWith("#");
  return (
    <a
      href={href}
      target={isAnchor ? undefined : "_blank"}
      rel={isAnchor ? undefined : "noreferrer"}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        background: "#fff",
        border: `1.5px solid ${hov ? color : C.border}`,
        borderRadius: 14, padding: "14px 18px",
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px ${color}22` : "0 1px 4px rgba(26,43,43,0.04)",
        transition: "all 0.18s",
      }}
    >
      <span style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={22} color={color} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: C.muted, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</p>
      </div>
      <span style={{ color: hov ? color : C.muted, fontSize: 18, transition: "color 0.18s" }}>→</span>
    </a>
  );
}

function VideoCard({ video }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={video.href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", position: "relative",
        borderRadius: 14, overflow: "hidden",
        aspectRatio: "9/16", background: C.ink,
        textDecoration: "none",
        border: `1.5px solid ${hov ? C.teal : C.border}`,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? "0 12px 28px rgba(26,43,43,0.18)" : "0 2px 10px rgba(26,43,43,0.06)",
        transition: "all 0.2s",
      }}
    >
      <img src={video.thumb} alt={video.titulo}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: hov ? 0.7 : 0.85, transition: "opacity 0.2s" }} />
      {/* play button */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 52, height: 52, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ marginLeft: 4, width: 0, height: 0,
          borderTop: "10px solid transparent", borderBottom: "10px solid transparent",
          borderLeft: `16px solid ${C.teal}` }} />
      </div>
      {/* badge red */}
      <span style={{
        position: "absolute", top: 10, left: 10,
        background: "rgba(26,43,43,0.78)", backdropFilter: "blur(4px)",
        color: "#fff", fontSize: 10, fontWeight: 700,
        padding: "3px 9px", borderRadius: 20,
        fontFamily: "DM Sans, sans-serif",
      }}>{video.red}</span>
      {/* titulo */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(26,43,43,0.85))",
        padding: "28px 12px 12px",
      }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
          {video.titulo}
        </p>
      </div>
    </a>
  );
}

export default function Linktree() {
  return (
    <Section id="linktree" style={{ background: C.tealL }}>
      <Container max={680}>

        {/* Header con gato ninja */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src="/tree.jpg" alt="Gato ninja Maki Nori" style={{
            width: 300, height: 300, objectFit: "contain",
            margin: "0 auto 8px", display: "block",
            mixBlendMode: "multiply",
          }} />
          <SectionTag>Síguenos</SectionTag>
          <h2 style={{
            fontWeight: 900, fontSize: "clamp(2rem,5vw,3rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "16px 0 8px",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Todo Maki Nori <span style={{ color: C.teal }}>en un lugar</span>
          </h2>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: "DM Sans, sans-serif", margin: 0 }}>
            Redes, pedidos y ubicación — todo a un click
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {LINKS.map(item => <LinkRow key={item.label} item={item} />)}
        </div>

        {/* Videos */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SectionTag>Videos</SectionTag>
          <h3 style={{
            fontWeight: 900, fontSize: "clamp(1.4rem,4vw,2rem)",
            color: C.ink, textTransform: "uppercase",
            letterSpacing: "-0.02em", margin: "12px 0 0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Mira nuestros <span style={{ color: C.coral }}>rolls</span>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          {VIDEOS.map((v, i) => <VideoCard key={i} video={v} />)}
        </div>

      </Container>
    </Section>
  );
}