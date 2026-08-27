import { useState } from "react";
import { C, FONT, Section, Container, SectionTitle } from "./tokens";
import { WA_PEDIDO } from "./data";
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
    label: "Pide por WhatsApp",
    sub: "Entrega en Iguala · 30-45 min",
    href: WA_PEDIDO,
    Icon: WhatsappIcon,
    color: "#25D366",
  },
  {
    label: "Ver menú y armar pedido",
    sub: "Rolls, ramen, snacks y bebidas",
    href: "#menu",
    Icon: Menu01Icon,
    color: C.teal,
  },
  {
    label: "Cómo llegar",
    sub: "Perif. Sur 12, 24 de Febrero, Iguala",
    href: "#ubicacion",
    Icon: Location01Icon,
    color: C.coral,
  },
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
    href: "https://www.tiktok.com/@maki.nori1?_r=1&_t=ZS-97V2ldQ6NpE",
    Icon: TiktokIcon,
    color: "#1A2B2B",
  },
  {
    label: "Facebook",
    sub: "Maki Nori Iguala",
    href: "https://www.facebook.com/makinorisushi/?locale=es_LA",
    Icon: Facebook01Icon,
    color: "#1877F2",
  },
];

// ─── Videos (pega aquí los links de TikTok/Instagram) ─────────
// Para cada video pon el link del post. Al dar click abre el video.
const VIDEOS = [
  { titulo: "Vibra Maki Nori", red: "Instagram", href: "https://www.instagram.com/reel/DY0uJLjtdse/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==", thumb: "/IMG_7047.jpg" },
  { titulo: "Conócenos",      red: "Facebook",  href: "https://www.facebook.com/share/v/1BfXyEq5mR/", thumb: "/IMG_7156.jpg" },
  { titulo: "Detrás de la barra", red: "TikTok", href: "https://www.tiktok.com/@maki.nori1/video/7650002879431920914?is_from_webapp=1&sender_device=pc&web_id=7655232434535122450", thumb: "/IMG_7289.jpg" },
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
        borderRadius: 2, padding: "14px 18px",
        textDecoration: "none",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? `0 8px 24px ${color}22` : "0 1px 4px rgba(26,43,43,0.04)",
        transition: "all 0.18s",
      }}
    >
      <span style={{
        width: 44, height: 44, borderRadius: 2, flexShrink: 0,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={22} color={color} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: FONT.serif, fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.muted, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</p>
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
        borderRadius: 2, overflow: "hidden",
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
        fontFamily: FONT.sans,
      }}>{video.red}</span>
      {/* titulo */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(26,43,43,0.85))",
        padding: "28px 12px 12px",
      }}>
        <p style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
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

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src="/tree.jpg" alt="Gato ninja Maki Nori" loading="lazy" decoding="async" style={{
            width: 180, height: 180, objectFit: "contain",
            margin: "0 auto 16px", display: "block",
            mixBlendMode: "multiply",
          }} />
          <SectionTitle kicker="繋がり" jp="フォロー">
            Todo Maki Nori <span style={{ color: C.teal, fontStyle: "italic" }}>en un lugar</span>
          </SectionTitle>
          <p style={{ fontSize: 13, color: C.muted, fontFamily: FONT.sans, margin: "-20px 0 0" }}>
            Redes, pedidos y ubicación — todo a un click
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
          {LINKS.map(item => <LinkRow key={item.label} item={item} />)}
        </div>

        {/* Videos */}
        <SectionTitle kicker="動画" jp="ビデオ">
          Mira nuestros <span style={{ color: C.shu, fontStyle: "italic" }}>rolls</span>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
          {VIDEOS.map((v, i) => <VideoCard key={i} video={v} />)}
        </div>
        <div style={{
          marginTop: 28, position: "relative", width: "100%",
          paddingBottom: "56.25%", height: 0, overflow: "hidden",
          border: `1px solid ${C.border}`,
        }}>
          <iframe
            src="https://www.youtube.com/embed/ZoFwQlCwd8o?si=CvY9br27vUYSPHP6"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>

      </Container>
    </Section>
  );
}