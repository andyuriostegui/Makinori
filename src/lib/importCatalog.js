import { MENU_CATS, SNACKS } from "../components/data";
import { supabase } from "./supabase";

const SNACKS_SUB = "Botanitas y entradas · Para compartir o para ti solo";

const CAT_DEFS = [
  { slug: "frescos",     nombre: "Frescos",     nombre_jp: "握り",    subtitulo: MENU_CATS.frescos.sub,     orden: 1, items: MENU_CATS.frescos.items },
  { slug: "empanizados", nombre: "Empanizados", nombre_jp: "揚げ",    subtitulo: MENU_CATS.empanizados.sub, orden: 2, items: MENU_CATS.empanizados.items },
  { slug: "ramen",       nombre: "Ramen",       nombre_jp: "麺",      subtitulo: MENU_CATS.ramen.sub,       orden: 3, items: MENU_CATS.ramen.items },
  { slug: "snacks",      nombre: "Snacks",      nombre_jp: "おつまみ", subtitulo: SNACKS_SUB,                orden: 4, items: SNACKS },
  { slug: "bebidas",     nombre: "Bebidas",     nombre_jp: "酒",      subtitulo: MENU_CATS.bebidas.sub,     orden: 5, items: MENU_CATS.bebidas.items },
];

const FEED_OVERRIDE = {
  "Philadelphia Roll": { en_feed: true, destacado: true, feed_orden: 0, badge: "CHEF'S PICK", nombre_jp: "フィラデルフィア" },
  "Mar y Tierra Roll": { en_feed: true, feed_orden: 1, badge: "BEST SELLER", nombre_jp: "海と陸" },
  "Yakimeshi Mixto":    { en_feed: true, feed_orden: 2, badge: "NUEVO", nombre_jp: "焼き飯" },
  "Buldak Carbonara":   { en_feed: true, feed_orden: 3, badge: "RAMEN", nombre_jp: "プルダックラーメン" },
  "Volcano Roll":       { en_feed: true, feed_orden: 4, badge: "PICANTE", nombre_jp: "ボルカノ" },
  "Mogu Mogu":          { en_feed: true, wide: true, feed_orden: 5, badge: "BEBIDA", nombre_jp: "もぐもぐ" },
};

function parsePrecio(s) {
  return Number(String(s).replace(/[^0-9.]/g, "")) || 0;
}

function altNombre(nombre) {
  return nombre.endsWith(" Roll") ? nombre.replace(/ Roll$/, "") : `${nombre} Roll`;
}

async function findCategoria(slug, nombre) {
  const bySlug = await supabase.from("categorias").select("id").eq("slug", slug).maybeSingle();
  if (bySlug.error) throw bySlug.error;
  if (bySlug.data) return bySlug.data;
  const byName = await supabase.from("categorias").select("id").eq("nombre", nombre).maybeSingle();
  if (byName.error) throw byName.error;
  return byName.data;
}

async function findPlatillo(nombre, categoriaId) {
  const inCat = await supabase
    .from("platillos")
    .select("id")
    .eq("categoria_id", categoriaId)
    .eq("nombre", nombre)
    .maybeSingle();
  if (inCat.error) throw inCat.error;
  if (inCat.data) return inCat.data;

  const byName = await supabase.from("platillos").select("id").eq("nombre", nombre).maybeSingle();
  if (byName.error) throw byName.error;
  if (byName.data) return byName.data;

  const byAlt = await supabase.from("platillos").select("id").eq("nombre", altNombre(nombre)).maybeSingle();
  if (byAlt.error) throw byAlt.error;
  return byAlt.data;
}

export async function importLocalMenu() {
  if (!supabase) throw new Error("Supabase no está configurado");

  const catIds = {};

  for (const cat of CAT_DEFS) {
    const catRow = {
      nombre: cat.nombre,
      nombre_jp: cat.nombre_jp,
      subtitulo: cat.subtitulo,
      orden: cat.orden,
      slug: cat.slug,
    };

    const existing = await findCategoria(cat.slug, cat.nombre);
    if (existing) {
      const { error } = await supabase.from("categorias").update(catRow).eq("id", existing.id);
      if (error) throw error;
      catIds[cat.slug] = existing.id;
    } else {
      const { data, error } = await supabase.from("categorias").insert(catRow).select("id").single();
      if (error) throw error;
      catIds[cat.slug] = data.id;
    }

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      const feed = FEED_OVERRIDE[item.nombre] || {};
      const row = {
        categoria_id: catIds[cat.slug],
        nombre: item.nombre,
        descripcion: item.desc,
        precio: parsePrecio(item.precio),
        imagen_url: item.foto || null,
        badge: feed.badge || null,
        disponible: true,
        orden: i,
        nombre_jp: feed.nombre_jp || null,
        en_feed: !!feed.en_feed,
        destacado: !!feed.destacado,
        wide: !!feed.wide,
        feed_orden: feed.feed_orden ?? 0,
      };

      const plat = await findPlatillo(item.nombre, catIds[cat.slug]);
      if (plat) {
        const { error } = await supabase.from("platillos").update(row).eq("id", plat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("platillos").insert(row);
        if (error) throw error;
      }
    }
  }

  return { categorias: CAT_DEFS.length, platillos: CAT_DEFS.reduce((n, c) => n + c.items.length, 0) };
}
