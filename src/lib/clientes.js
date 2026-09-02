import { supabase } from "./supabase";

export function isMissingTable(error) {
  const t = String(error?.message || error?.code || "").toLowerCase();
  return (
    t.includes("does not exist") ||
    t.includes("schema cache") ||
    t.includes("42p01") ||
    t.includes("pgrst205") ||
    error?.code === "42P01" ||
    error?.code === "PGRST205"
  );
}

export function friendlyAuthError(msg = "") {
  const t = String(msg).toLowerCase();
  if (t.includes("invalid login") || t.includes("invalid credentials")) return "Email o contraseña incorrectos.";
  if (t.includes("already registered") || t.includes("already been registered") || t.includes("user already")) {
    return "Ese correo ya tiene cuenta. Entra con tu contraseña.";
  }
  if (t.includes("same password") || t.includes("different from the old") || t.includes("should be different")) {
    return "La nueva contraseña tiene que ser distinta a la anterior.";
  }
  if (t.includes("auth session missing") || t.includes("not authenticated")) {
    return "Abre el enlace del correo otra vez.";
  }
  if (t.includes("password should") || t.includes("at least") || t.includes("password")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (t.includes("rate") || t.includes("too many")) return "Demasiados intentos. Espera un momento.";
  if (t.includes("email not confirmed")) return "Revisa tu correo y confirma la cuenta para entrar.";
  if (isMissingTable({ message: msg })) return "Falta correr el SQL de perfiles en Supabase.";
  if (t.includes("row-level security") || t.includes("rls")) return "No hay permiso para guardar. Revisa que hayas iniciado sesión.";
  return msg || "Algo salió mal. Inténtalo de nuevo.";
}

export async function cambiarPassword(password, confirm) {
  if (!supabase) throw new Error("Falta conectar.");
  if (String(password || "").length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
  if (password !== confirm) {
    throw new Error("Las contraseñas no coinciden.");
  }
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(friendlyAuthError(error.message));
}

export async function fetchPerfil(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from("perfiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    if (isMissingTable(error)) return { missingTable: true };
    console.warn("perfil:", error.message);
    return null;
  }
  return data;
}

export async function saveMiPerfil(userId, fields) {
  if (!supabase || !userId) throw new Error("No hay sesión.");
  const row = { id: userId };
  if (fields.nombre != null) row.nombre = String(fields.nombre).trim();
  if (fields.tel != null) row.tel = String(fields.tel).trim();
  if (fields.direccion != null) row.direccion = String(fields.direccion).trim();
  const { data, error } = await supabase
    .from("perfiles")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function touchLastSeen(userId) {
  if (!supabase || !userId) return;
  await supabase.from("perfiles").update({ last_seen_at: new Date().toISOString() }).eq("id", userId);
}

export async function registrarPedido({ userId, folio, items, total, descuento, modo, mesa, cliente }) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from("pedidos").insert({
    perfil_id: userId,
    folio: folio || null,
    items: (items || []).map((i) => ({
      id: i.id,
      nombre: i.nombre,
      qty: i.qty,
      precio: i.precio,
      nota: i.nota || "",
    })),
    total: Number(total) || 0,
    descuento: Number(descuento) || 0,
    modo: modo || null,
    mesa: mesa || null,
    direccion: cliente?.direccion || null,
    nombre: cliente?.nombre || null,
    tel: cliente?.tel || null,
  }).select("id").single();
  if (error) throw error;
  return data;
}

export async function asegurarStaff() {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("asegurar_staff");
  if (error) {
    if (isMissingTable(error)) return { missingTable: true };
    throw error;
  }
  return data;
}

function minutosDesde(iso) {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return Infinity;
  return (Date.now() - t) / 60000;
}

export function formatCuando(iso) {
  if (!iso) return "Nunca";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "Nunca";
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const dias = Math.round(hrs / 24);
  if (dias < 8) return `Hace ${dias} día${dias === 1 ? "" : "s"}`;
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function armarCliente(p, pedidos = []) {
  const list = [...pedidos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const gastado = list.reduce((s, o) => s + (Number(o.total) || 0), 0);
  return {
    ...p,
    pedidos: list,
    pedidosN: list.length,
    gastado,
    enLinea: minutosDesde(p.last_seen_at) <= 10,
  };
}

export async function fetchClientesAdmin() {
  if (!supabase) throw new Error("Supabase no está configurado");
  const embedded = await supabase
    .from("perfiles")
    .select("id, nombre, tel, direccion, rol, destacado, descuento, last_seen_at, created_at, pedidos(id, total, created_at, folio, modo)")
    .eq("rol", "cliente")
    .order("created_at", { ascending: false });

  if (!embedded.error) {
    return (embedded.data || []).map((p) => armarCliente(p, p.pedidos)).sort(sortClientes);
  }

  const { data: perfiles, error } = await supabase
    .from("perfiles")
    .select("id, nombre, tel, direccion, rol, destacado, descuento, last_seen_at, created_at")
    .eq("rol", "cliente")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const { data: pedidos, error: pe } = await supabase
    .from("pedidos")
    .select("id, perfil_id, total, created_at, folio, modo");
  if (pe) throw pe;
  const byUser = {};
  for (const o of pedidos || []) {
    if (!o.perfil_id) continue;
    (byUser[o.perfil_id] ||= []).push(o);
  }
  return (perfiles || []).map((p) => armarCliente(p, byUser[p.id] || [])).sort(sortClientes);
}

function sortClientes(a, b) {
  if (a.destacado !== b.destacado) return a.destacado ? -1 : 1;
  if (b.pedidosN !== a.pedidosN) return b.pedidosN - a.pedidosN;
  return String(b.last_seen_at || "").localeCompare(String(a.last_seen_at || ""));
}

export async function patchCliente(id, patch) {
  const { error } = await supabase.from("perfiles").update(patch).eq("id", id);
  if (error) throw error;
}
