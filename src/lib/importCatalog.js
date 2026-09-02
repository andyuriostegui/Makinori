import { MENU_CATS, SNACKS } from "../components/data";
import { supabase } from "./supabase";

const SNACKS_SUB = "Botanitas y entradas · Para compartir o para ti solo";

const CAT_DEFS = [
  { slug: "frescos",           nombre: "Frescos",           nombre_jp: "握り",    subtitulo: MENU_CATS.frescos.sub,     orden: 1, items: MENU_CATS.frescos.items },
  { slug: "empanizados",       nombre: "Empanizados",       nombre_jp: "揚げ",    subtitulo: MENU_CATS.empanizados.sub, orden: 2, items: MENU_CATS.empanizados.items },
  { slug: "ramen",             nombre: "Ramen",             nombre_jp: "麺",      subtitulo: MENU_CATS.ramen.sub,       orden: 3, items: MENU_CATS.ramen.items },
  { slug: "parrilla-coreana",  nombre: "Parrilla Coreana",  nombre_jp: "焼肉",    subtitulo: MENU_CATS.parrilla.sub,    orden: 4, items: MENU_CATS.parrilla.items },
  { slug: "snacks",            nombre: "Snacks",            nombre_jp: "おつまみ", subtitulo: SNACKS_SUB,                orden: 5, items: SNACKS },
  { slug: "bebidas",           nombre: "Bebidas",           nombre_jp: "酒",      subtitulo: MENU_CATS.bebidas.sub,     orden: 6, items: MENU_CATS.bebidas.items },
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

async function firstRow(query) {
  const { data, error } = await query.limit(1);
  if (error) throw error;
  return data?.[0] || null;
}

async function findCategoria(slug, nombre) {
  const bySlug = await firstRow(supabase.from("categorias").select("id").eq("slug", slug));
  if (bySlug) return bySlug;
  return firstRow(supabase.from("categorias").select("id").eq("nombre", nombre));
}

async function platilloCount(categoriaId) {
  const { count, error } = await supabase
    .from("platillos")
    .select("id", { count: "exact", head: true })
    .eq("categoria_id", categoriaId);
  if (error) throw error;
  return count || 0;
}

async function movePlatillos(fromId, toId) {
  const { data: froms, error: fromErr } = await supabase
    .from("platillos")
    .select("id, nombre")
    .eq("categoria_id", fromId);
  if (fromErr) throw fromErr;
  const { data: tos, error: toErr } = await supabase
    .from("platillos")
    .select("nombre")
    .eq("categoria_id", toId);
  if (toErr) throw toErr;
  const taken = new Set((tos || []).map((p) => p.nombre));
  for (const p of froms || []) {
    if (taken.has(p.nombre)) {
      const { error } = await supabase.from("platillos").delete().eq("id", p.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("platillos").update({ categoria_id: toId }).eq("id", p.id);
      if (error) throw error;
      taken.add(p.nombre);
    }
  }
}

/** Junta categorías con el mismo slug (Parrilla Coreana se creó dos veces). */
async function dedupeCategorias(list) {
  const groups = new Map();
  for (const c of list) {
    const slug = String(c.slug || "").trim();
    if (!slug) continue;
    const rows = groups.get(slug) || [];
    rows.push(c);
    groups.set(slug, rows);
  }
  let merged = 0;
  for (const rows of groups.values()) {
    if (rows.length < 2) continue;
    const scored = await Promise.all(rows.map(async (c) => ({ c, n: await platilloCount(c.id) })));
    scored.sort((a, b) => b.n - a.n || String(a.c.id).localeCompare(String(b.c.id)));
    const keeper = scored[0].c;
    for (const { c } of scored.slice(1)) {
      await movePlatillos(c.id, keeper.id);
      const { error } = await supabase.from("categorias").delete().eq("id", c.id);
      if (error) throw error;
      merged += 1;
    }
  }
  return merged;
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

/** Crea categorías nuevas (Parrilla Coreana), quita duplicados y corrige textos si faltan. */
export async function ensureCategorias() {
  if (!supabase) return { changed: false, createdParrilla: false, merged: 0 };
  let changed = false;
  let createdParrilla = false;

  const { data: cats, error } = await supabase
    .from("categorias")
    .select("id, slug, nombre, subtitulo, orden");
  if (error) throw error;

  let list = cats || [];
  const merged = await dedupeCategorias(list);
  if (merged > 0) {
    changed = true;
    const again = await supabase.from("categorias").select("id, slug, nombre, subtitulo, orden");
    if (again.error) throw again.error;
    list = again.data || [];
  }

  const bySlug = Object.fromEntries(list.filter((c) => c.slug).map((c) => [c.slug, c]));

  for (const slug of ["frescos", "empanizados"]) {
    const existing = bySlug[slug];
    const def = CAT_DEFS.find((c) => c.slug === slug);
    if (!existing || !def || existing.subtitulo === def.subtitulo) continue;
    const { error: e } = await supabase
      .from("categorias")
      .update({ subtitulo: def.subtitulo })
      .eq("id", existing.id);
    if (e) throw e;
    changed = true;
  }

  if (!bySlug["parrilla-coreana"]) {
    const ramen = bySlug["ramen"];
    const orden = ramen
      ? Number(ramen.orden || 0) + 1
      : Math.max(0, ...list.map((c) => c.orden || 0)) + 1;
    const toShift = [...list]
      .filter((c) => (c.orden ?? 0) >= orden)
      .sort((a, b) => (b.orden ?? 0) - (a.orden ?? 0));
    for (const c of toShift) {
      const { error: e } = await supabase
        .from("categorias")
        .update({ orden: (c.orden || 0) + 1 })
        .eq("id", c.id);
      if (e) throw e;
    }
    const def = CAT_DEFS.find((c) => c.slug === "parrilla-coreana");
    const { error: e } = await supabase.from("categorias").insert({
      slug: def.slug,
      nombre: def.nombre,
      nombre_jp: def.nombre_jp,
      subtitulo: def.subtitulo,
      orden,
    });
    if (e) throw e;
    changed = true;
    createdParrilla = true;
  }

  return { changed, createdParrilla, merged };
}
