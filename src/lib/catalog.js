import { C } from "../components/tokens";
import { MENU_CATS, SNACKS, PRODUCTOS } from "../components/data";
import { supabase, PLATILLO_COLS, CATEGORIA_COLS } from "./supabase";

export const CAT_TINTS = {
  frescos: C.teal,
  empanizados: C.coral,
  ramen: C.tealD,
  snacks: C.coralD,
  bebidas: C.teal,
};

const SNACKS_META = {
  jp: "おつまみ",
  sub: "Botanitas y entradas · Para compartir o para ti solo",
};

const LOCAL_TABS = [
  { key: "frescos",     label: "Frescos",     jp: "握り",     tint: C.teal,   sub: MENU_CATS.frescos.sub },
  { key: "empanizados", label: "Empanizados", jp: "揚げ",     tint: C.coral,  sub: MENU_CATS.empanizados.sub },
  { key: "ramen",       label: "Ramen",       jp: "麺",       tint: C.tealD,  sub: MENU_CATS.ramen.sub },
  { key: "snacks",      label: "Snacks",      jp: "おつまみ",  tint: C.coralD, sub: SNACKS_META.sub },
  { key: "bebidas",     label: "Bebidas",     jp: "酒",       tint: C.teal,   sub: MENU_CATS.bebidas.sub },
];

export function formatPrecio(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "$0";
  return `$${Number.isInteger(v) ? v : v.toFixed(2).replace(/\.00$/, "")}`;
}

const FOTO_POS_RE = /#(\d{1,3}),(\d{1,3})$/;

function clampPct(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 50;
  return Math.max(0, Math.min(100, v));
}

/** Lee el recorte guardado al final de la URL: foto.jpg#40,70 */
export function parseFotoPos(url) {
  const raw = String(url || "");
  const m = raw.match(FOTO_POS_RE);
  return {
    src: m ? raw.slice(0, m.index) : raw,
    x: m ? clampPct(m[1]) : 50,
    y: m ? clampPct(m[2]) : 50,
  };
}

/** Guarda el recorte en la URL. Centro (50,50) se omite para no ensuciar el link. */
export function withFotoPos(url, x = 50, y = 50) {
  const { src } = parseFotoPos(url);
  if (!src) return "";
  const nx = clampPct(x);
  const ny = clampPct(y);
  if (nx === 50 && ny === 50) return src;
  return `${src}#${nx},${ny}`;
}

function badgesFor(platillo, slug) {
  const text = `${platillo.badge || ""} ${platillo.nombre || ""}`.toLowerCase();
  const picante = /picante|volcano|buldak|🔥/.test(text);
  const out = [];
  if (slug === "frescos" || slug === "empanizados") out.push("8 piezas");
  if (picante) out.push("🌶 Picante");
  if (slug === "ramen") out.push("Caldoso o seco");
  return out;
}

export function mapPlatilloToProducto(p, slug) {
  const tag = p.badge || "";
  return {
    id: p.id,
    tag,
    tagDark: /best seller|ramen|bebida/i.test(tag),
    featured: !!p.destacado,
    wide: !!p.wide,
    nombre: p.nombre,
    jp: p.nombre_jp || "",
    precio: formatPrecio(p.precio),
    desc: p.descripcion || "",
    badges: badgesFor(p, slug),
    badgePicante: /picante|volcano|buldak|🔥/i.test(`${tag} ${p.nombre}`),
    foto: p.imagen_url || null,
  };
}

export function mapPlatilloToMenuItem(p) {
  return {
    id: p.id,
    nombre: p.nombre,
    desc: p.descripcion || "",
    precio: formatPrecio(p.precio),
    foto: p.imagen_url || null,
    popular: /best seller|chef/i.test(p.badge || ""),
  };
}

export function localCatalog() {
  return {
    productos: PRODUCTOS,
    menuTabs: LOCAL_TABS,
    menuBySlug: {
      frescos: MENU_CATS.frescos,
      empanizados: MENU_CATS.empanizados,
      ramen: MENU_CATS.ramen,
      snacks: { ...SNACKS_META, items: SNACKS },
      bebidas: MENU_CATS.bebidas,
    },
    source: "local",
  };
}

function buildRemoteCatalog(categorias, platillos) {
  const visibles = platillos.filter((p) => p.disponible !== false);

  const allTabs = [...categorias]
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map((c) => ({
      key: c.slug || c.id,
      label: c.nombre,
      jp: c.nombre_jp || "",
      tint: CAT_TINTS[c.slug] || C.teal,
      sub: c.subtitulo || "",
      id: c.id,
    }));

  const menuBySlug = {};
  for (const tab of allTabs) {
    const items = visibles
      .filter((p) => p.categoria_id === tab.id)
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map(mapPlatilloToMenuItem);
    menuBySlug[tab.key] = {
      jp: tab.jp,
      sub: tab.sub,
      items,
    };
  }

  const menuTabs = allTabs.filter((tab) => (menuBySlug[tab.key]?.items.length || 0) > 0);

  const slugByCatId = Object.fromEntries(
    categorias.map((c) => [c.id, c.slug || c.id]),
  );

  const productos = visibles
    .filter((p) => p.en_feed)
    .sort((a, b) => (a.feed_orden ?? 0) - (b.feed_orden ?? 0))
    .slice(0, 8)
    .map((p) => mapPlatilloToProducto(p, slugByCatId[p.categoria_id]));

  return {
    productos,
    menuTabs,
    menuBySlug,
    source: "remote",
    categorias,
    platillos,
  };
}

export async function fetchCatalog() {
  const fallback = localCatalog();
  if (!supabase) return fallback;

  const [cats, plats] = await Promise.all([
    supabase.from("categorias").select(CATEGORIA_COLS).order("orden"),
    supabase.from("platillos").select(PLATILLO_COLS).order("orden"),
  ]);

  if (cats.error || plats.error) {
    console.warn("Catálogo remoto no disponible:", cats.error?.message || plats.error?.message);
    return fallback;
  }

  const categorias = cats.data || [];
  const platillos = plats.data || [];
  if (!categorias.length || !platillos.length) return fallback;

  const remote = buildRemoteCatalog(categorias, platillos);
  const menuListo = remote.menuTabs.length >= 5 && platillos.length >= 20;

  return {
    ...remote,
    productos: remote.productos.length ? remote.productos : fallback.productos,
    menuTabs: menuListo ? remote.menuTabs : fallback.menuTabs,
    menuBySlug: menuListo ? remote.menuBySlug : fallback.menuBySlug,
  };
}
