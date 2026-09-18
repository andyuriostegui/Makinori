import { supabase } from "./supabase";
import { isMissingTable } from "./clientes";

const VID_KEY = "mn_vid";
const TZ = "America/Mexico_City";
const DIA_CORTO = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

let pinged = false;

export function isMissingVisitas(error) {
  const t = String(error?.message || error?.code || "").toLowerCase();
  return (
    isMissingTable(error) ||
    t.includes("registrar_visita") ||
    t.includes("resumen_visitas") ||
    error?.code === "PGRST202" ||
    (t.includes("visitas") && (t.includes("does not exist") || t.includes("schema cache") || t.includes("pgrst")))
  );
}

function isLocalHost() {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function isAdminPath() {
  const path = (typeof window === "undefined" ? "" : window.location.pathname).toLowerCase();
  return (
    path.startsWith("/admin") ||
    path.startsWith("/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/recuperar")
  );
}

function getVisitorId() {
  try {
    let id = localStorage.getItem(VID_KEY);
    if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return id.toLowerCase();
    }
    id = crypto.randomUUID();
    localStorage.setItem(VID_KEY, id);
    return id;
  } catch {
    return null;
  }
}

export async function registrarVisita() {
  if (pinged || !supabase) return;
  if (typeof window === "undefined") return;
  if (isLocalHost() || isAdminPath()) return;
  if (window.navigator?.webdriver) return;

  const id = getVisitorId();
  if (!id) return;

  pinged = true;
  const { error } = await supabase.rpc("registrar_visita", { p_visitor_id: id });
  if (error && !isMissingVisitas(error)) {
    console.warn("visita:", error.message);
  }
}

export function ymdMexico(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
}

export function shiftYmd(ymd, days) {
  const [y, m, d] = String(ymd).slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function dowUtc(ymd) {
  const [y, m, d] = String(ymd).slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function etiquetaCorta(ymd) {
  const day = Number(String(ymd).slice(8, 10));
  return `${DIA_CORTO[dowUtc(ymd)]} ${day}`;
}

function asYmd(v) {
  if (!v) return "";
  return String(v).slice(0, 10);
}

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function fillDias(rows, hoy, cantidad) {
  const byDay = new Map((rows || []).map((r) => [asYmd(r.dia), r]));
  const out = [];
  for (let i = cantidad - 1; i >= 0; i -= 1) {
    const dia = shiftYmd(hoy, -i);
    const row = byDay.get(dia);
    out.push({
      dia,
      personas: n(row?.personas),
      entradas: n(row?.entradas),
    });
  }
  return out;
}

export async function fetchResumenVisitas(dias = 14) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { data, error } = await supabase.rpc("resumen_visitas", { p_dias: dias });
  if (error) throw error;
  const raw = data && typeof data === "object" ? data : {};
  const hoy = asYmd(raw.hoy) || ymdMexico();
  const serie = fillDias(raw.dias || [], hoy, 7);
  return {
    hoy,
    lunes: asYmd(raw.lunes) || hoy,
    hoyPersonas: n(raw.hoy_personas),
    hoyEntradas: n(raw.hoy_entradas),
    semanaPersonas: n(raw.semana_personas),
    semanaEntradas: n(raw.semana_entradas),
    serie,
  };
}
