import { GALERIA_FOTOS } from "../components/data";
import { supabase } from "./supabase";

const FILE = "galeria.json";

export function normalizeGaleria(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((f) => f && f.src)
    .map((f, i) => ({
      src: String(f.src),
      alt: f.alt || "Roll Maki Nori",
      span: f.span === 2 ? 2 : 1,
      orden: Number.isFinite(Number(f.orden)) ? Number(f.orden) : i,
    }))
    .sort((a, b) => a.orden - b.orden);
}

export async function fetchGaleria() {
  if (!supabase) return { fotos: GALERIA_FOTOS, remote: false };
  try {
    const { data, error } = await supabase.storage.from("platillos").download(FILE);
    if (error || !data) return { fotos: GALERIA_FOTOS, remote: false };
    const parsed = normalizeGaleria(JSON.parse(await data.text()));
    if (!parsed.length) return { fotos: GALERIA_FOTOS, remote: false };
    return { fotos: parsed, remote: true };
  } catch {
    return { fotos: GALERIA_FOTOS, remote: false };
  }
}

export async function saveGaleria(fotos) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const payload = normalizeGaleria(fotos).map((f, i) => ({ ...f, orden: i }));
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const { error } = await supabase.storage.from("platillos").upload(FILE, blob, {
    upsert: true,
    contentType: "application/json",
    cacheControl: "0",
  });
  if (error) throw error;
  return payload;
}

export async function uploadGaleriaFoto(file) {
  if (!file) throw new Error("Elige una foto");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `galeria/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("platillos").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("platillos").getPublicUrl(path);
  return data.publicUrl;
}
