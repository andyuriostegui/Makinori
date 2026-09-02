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

const RECOVERY_FLAG = "maki-nori-password-recovery";

function storageFlag() {
  try {
    return sessionStorage.getItem(RECOVERY_FLAG) === "1";
  } catch {
    return false;
  }
}

export function markRecovery(on) {
  try {
    if (on) sessionStorage.setItem(RECOVERY_FLAG, "1");
    else sessionStorage.removeItem(RECOVERY_FLAG);
  } catch {
    /* ignore quota / private mode */
  }
}

export function readRecoveryFromUrl() {
  if (typeof window === "undefined") return false;
  try {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const type = (hash.get("type") || query.get("type") || "").toLowerCase();
    if (type === "recovery") return true;
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith("/recuperar") && (query.get("code") || hash.get("access_token"))) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function ensureRecuperarPath() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith("/recuperar")) return;
  window.history.replaceState(
    window.history.state,
    "",
    `/recuperar${window.location.search}${window.location.hash}`,
  );
}

// Leer el hash/query ANTES de createClient, que consume los tokens de recovery.
export const recoveryLinkPresent = (() => {
  const fromUrl = readRecoveryFromUrl();
  if (fromUrl) markRecovery(true);
  return fromUrl || storageFlag();
})();

export const supabase = url && key ? createClient(url, key) : null;

export const PLATILLO_COLS =
  "id, categoria_id, nombre, descripcion, precio, imagen_url, badge, disponible, orden, created_at, nombre_jp, en_feed, destacado, wide, feed_orden";

export const CATEGORIA_COLS =
  "id, nombre, subtitulo, orden, nombre_jp, slug";
