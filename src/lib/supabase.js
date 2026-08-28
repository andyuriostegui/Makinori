import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export const PLATILLO_COLS =
  "id, categoria_id, nombre, descripcion, precio, imagen_url, badge, disponible, orden, created_at, nombre_jp, en_feed, destacado, wide, feed_orden";

export const CATEGORIA_COLS =
  "id, nombre, subtitulo, orden, nombre_jp, slug";
