import { createClient } from "@supabase/supabase-js";

function env(name) {
  const v = import.meta.env[name];
  if (typeof v !== "string") return "";
  const t = v.trim();
  if (!t || t.includes("YOUR_PROJECT") || t.startsWith("your_")) return "";
  return t;
}

const url =
  env("VITE_SUPABASE_URL") || "https://sdqyzzmmfewjrzfnkqhz.supabase.co";
const key =
  env("VITE_SUPABASE_ANON_KEY") ||
  env("VITE_SUPABASE_PUBLISHABLE_KEY") ||
  "sb_publishable_9hZcmrz1fK0ApXPDtsy1bQ_PeJxY2EV";

export const supabase = url && key ? createClient(url, key) : null;

export const PLATILLO_COLS =
  "id, categoria_id, nombre, descripcion, precio, imagen_url, badge, disponible, orden, created_at, nombre_jp, en_feed, destacado, wide, feed_orden";

export const CATEGORIA_COLS =
  "id, nombre, subtitulo, orden, nombre_jp, slug";
