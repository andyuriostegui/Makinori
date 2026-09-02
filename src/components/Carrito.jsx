import { useState, useEffect, useRef, createContext, useContext } from "react";
import { C } from "./tokens";
import { parseFotoPos } from "../lib/catalog";
import { WA_NUM } from "./data";
import { useAuth } from "../auth/AuthContext";
import { registrarPedido, saveMiPerfil } from "../lib/clientes";
import {
  ShoppingBag01Icon,
  Timer01Icon,
  Chair01Icon,
  Cancel01Icon,
  PencilEdit01Icon,
  WhatsappIcon,
  ServingFoodIcon,
  Delete02Icon,
  HandBag01Icon,
  Location01Icon,
} from "hugeicons-react";

const STORAGE_KEY = "makinori-pedido";
const FIEL_SEEN_KEY = "makinori-fiel-popup";
const WA_URL = `https://wa.me/${WA_NUM}`;

function fielYaVisto() {
  try {
    return sessionStorage.getItem(FIEL_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function marcarFielVisto() {
  try {
    sessionStorage.setItem(FIEL_SEEN_KEY, "1");
  } catch {
    /* modo privado / storage bloqueado */
  }
}

function leerPedido() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || !Array.isArray(raw.items)) return null;
    return raw;
  } catch {
    return null;
  }
}

function nuevoFolio() {
  return `MN-${Math.floor(1000 + Math.random() * 9000)}`;
}

function montosPedido(total, perfil) {
  const pct = Math.max(0, Math.min(100, Number(perfil?.descuento) || 0));
  const descuento = Math.round((Number(total) || 0) * pct / 100);
  return { pct, descuento, final: Math.max(0, (Number(total) || 0) - descuento) };
}

export function useCarrito() {
  const saved = typeof window !== "undefined" ? leerPedido() : null;
  const { user, perfil } = useAuth();
  const filledFromPerfil = useRef(false);
  const [items, setItems] = useState(saved?.items || []);
  const [modo, setModo] = useState(saved?.modo || "llevar");
  const [mesa, setMesa] = useState(saved?.mesa || "");
  const [cliente, setCliente] = useState(saved?.cliente || { nombre: "", tel: "", direccion: "" });
  const [open, setOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [folio, setFolio] = useState("");
  const [enviado, setEnviado] = useState(false);

  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, modo, mesa, cliente }));
  }, [items, modo, mesa, cliente]);

  useEffect(() => {
    if (!user) filledFromPerfil.current = false;
  }, [user]);

  useEffect(() => {
    if (!perfil || perfil.missingTable || filledFromPerfil.current) return;
    filledFromPerfil.current = true;
    setCliente((c) => ({
      nombre: (c.nombre || "").trim() || perfil.nombre || "",
      tel: (c.tel || "").trim() || perfil.tel || "",
      direccion: (c.direccion || "").trim() || perfil.direccion || "",
    }));
  }, [perfil]);

  const agregar = (producto) => {
    const id = producto.id || producto.nombre;
    setItems(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...producto, id, qty: 1, nota: producto.nota || "" }];
    });
    setBounce(true);
    setEnviado(false);
    setTimeout(() => setBounce(false), 400);
  };

  const quitar = (id) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex?.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
    setEnviado(false);
  };

  const setNota = (id, nota) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, nota } : i));
  };

  const setCampo = (k, v) => setCliente(c => ({ ...c, [k]: v }));

  const limpiar = () => {
    setItems([]);
    setFolio("");
    setEnviado(false);
  };

  return {
    items, total, count, open, setOpen, agregar, quitar, setNota, limpiar,
    modo, setModo, mesa, setMesa, bounce, cliente, setCampo,
    folio, setFolio, enviado, setEnviado,
  };
}

export const CarritoCtx = createContext(null);
export const useCarritoCtx = () => useContext(CarritoCtx);

function pickSugerencia(items) {
  if (!items.length) return null;
  const names = items.map(i => i.nombre);
  const inCart = n => names.includes(n);
  const has = re => items.some(i => re.test(i.nombre));
  const drink = /mogu|ramune|calpis|cerveza|refresco|soju|soyu|sake|mojito|colada|cuba|clericot|hidromiel|boing|agua |café/i;
  const snack = /aros|palomitas|kushi|pops|papiux|onigiri/i;
  const ramen = /ramen|buldak|kang/i;
  const roll = /roll/i;

  if (has(roll) && !has(drink) && !inCart("Mogu Mogu")) {
    return { id: "Mogu Mogu", nombre: "Mogu Mogu", precio: 67, foto: "/bebida.jpeg", msg: "¿Un Mogu Mogu para acompañar?" };
  }
  if (has(ramen) && !has(snack) && !inCart("Aros de Cebolla")) {
    return { id: "Aros de Cebolla", nombre: "Aros de Cebolla", precio: 65, foto: "/IMG_7072.jpg", msg: "¿Unos aros de cebolla?" };
  }
  if (has(roll) && !has(snack) && !inCart("Kushiagues Q+Camarón")) {
    return { id: "Kushiagues Q+Camarón", nombre: "Kushiagues Q+Camarón", precio: 55, foto: "/IMG_7094.jpg", msg: "¿Kushiagues de camarón para la mesa?" };
  }
  if (!has(drink) && !inCart("Ramunes")) {
    return { id: "Ramunes", nombre: "Ramunes", precio: 67, foto: "/bebida.jpeg", msg: "¿Una Ramune bien fría?" };
  }
  return null;
}

function armarMensaje({ items, total, modo, mesa, cliente, folio, descuento, pct }) {
  const modoStr = modo === "mesa"
    ? `En mesa ${mesa.trim()}`
    : modo === "domicilio"
      ? "A domicilio"
      : "Para llevar";

  const lineas = items.map(i => {
    const row = `• ${i.qty}x ${i.nombre} — $${i.precio} c/u = $${i.precio * i.qty}`;
    return i.nota ? `${row}\n  nota: ${i.nota}` : row;
  }).join("\n");

  const quien = [
    cliente.nombre?.trim() && `👤 ${cliente.nombre.trim()}`,
    cliente.tel?.trim() && `📱 ${cliente.tel.trim()}`,
    modo === "domicilio" && cliente.direccion?.trim() && `📍 ${cliente.direccion.trim()}`,
  ].filter(Boolean).join("\n");

  const cobro = descuento > 0
    ? [`Subtotal: $${total} MXN`, `Destacado · ${pct}% −$${descuento}`, `*Total: $${total - descuento} MXN*`]
    : [`*Total: $${total} MXN*`];

  return [
    `🍣 *Pedido Maki Nori*`,
    `Folio: *#${folio}*`,
    "",
    quien,
    `Modo: *${modoStr}*`,
    "",
    lineas,
    "",
    ...cobro,
    "",
    "Confirmo cuando me contesten. ¡Gracias!",
  ].filter(block => block !== "").join("\n").replace(/\n{3,}/g, "\n\n");
}

export function BtnAgregar({ producto }) {
  const { items, agregar, quitar } = useCarritoCtx();
  const id = producto.id || producto.nombre;
  const item = items.find(i => i.id === id);
  const qty = item?.qty || 0;
  const [pop, setPop] = useState(false);

  const handleAgregar = () => {
    agregar({ ...producto, id });
    setPop(true);
    setTimeout(() => setPop(false), 300);
  };

  return (
    <div style={{ marginTop: 12 }}>
      {qty === 0 ? (
        <button onClick={handleAgregar} style={{
          background: pop ? C.tealD : C.teal,
          color: C.cream, border: "none", borderRadius: 2,
          padding: "8px 16px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
          transform: pop ? "scale(0.95)" : "scale(1)",
          transition: "all 0.15s", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <ShoppingBag01Icon size={14} color={C.cream} />
          Agregar al pedido
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          <button onClick={() => quitar(id)} aria-label="Quitar uno" style={{
            width: 32, height: 32, borderRadius: 6, border: `1.5px solid ${C.border}`,
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.ink, fontWeight: 700, fontSize: 16,
          }}>−</button>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 14, color: C.ink, fontFamily: "Noto Sans JP, sans-serif" }}>
            {qty} en pedido
          </span>
          <button onClick={handleAgregar} aria-label="Agregar uno" style={{
            width: 32, height: 32, borderRadius: 6, border: "none",
            background: C.teal, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: pop ? "scale(0.9)" : "scale(1)", transition: "transform 0.15s",
            color: C.cream, fontWeight: 700, fontSize: 16,
          }}>+</button>
        </div>
      )}
    </div>
  );
}

export function CarritoBtn() {
  const { count, setOpen, bounce, open } = useCarritoCtx();
  if (count === 0 || open) return null;
  return (
    <button onClick={() => setOpen(true)} aria-label={`Ver pedido, ${count} platillos`} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      background: C.ink, color: C.cream,
      border: "none", borderRadius: 50, padding: "8px 20px 8px 8px",
      display: "flex", alignItems: "center", gap: 8,
      cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
      boxShadow: "0 8px 32px rgba(26,26,24,0.25)",
      transform: bounce ? "scale(1.12)" : "scale(1)",
      transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: "50%",
        background: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <img src="/sushito.png" alt="" style={{ width: 30, height: "auto" }} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>
        {count} platillo{count === 1 ? "" : "s"}
      </span>
      <span style={{
        background: C.teal, color: C.cream,
        borderRadius: 20, padding: "2px 8px",
        fontSize: 11, fontWeight: 900,
      }}>{count}</span>
    </button>
  );
}

function leerSheet() {
  if (typeof window === "undefined") {
    return { mobile: false, height: "100%", offsetTop: 0, keyboard: false };
  }
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  const vv = window.visualViewport;
  const vh = vv?.height ?? window.innerHeight;
  const offsetTop = vv?.offsetTop ?? 0;
  const keyboard = mobile && window.innerHeight - vh > 80;
  return {
    mobile,
    height: mobile ? `${Math.round(vh)}px` : "100%",
    offsetTop: mobile ? offsetTop : 0,
    keyboard,
  };
}

function usePedidoSheet() {
  const [sheet, setSheet] = useState(leerSheet);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setSheet(leerSheet());
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  return sheet;
}

function scrollCampoVisible(e) {
  const el = e.target;
  window.setTimeout(() => {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, 350);
}

export function CarritoPanel() {
  const {
    items, total, count, open, setOpen, quitar, agregar, setNota, limpiar,
    modo, setModo, mesa, setMesa, cliente, setCampo,
    folio, setFolio, enviado, setEnviado,
  } = useCarritoCtx();
  const { user, perfil, setCuentaOpen } = useAuth();
  const [error, setError] = useState("");
  const sugerencia = pickSugerencia(items);
  const sheet = usePedidoSheet();
  const { pct, descuento, final } = montosPedido(total, perfil);
  const [fielDismissed, setFielDismissed] = useState(() => fielYaVisto());
  const fielOpen = open && pct > 0 && !fielDismissed;

  const cerrarFiel = () => {
    marcarFielVisto();
    setFielDismissed(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (fielOpen) {
        cerrarFiel();
        return;
      }
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen, fielOpen]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      htmlOverflow: html.style.overflow,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      html.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const validar = () => {
    if (items.length === 0) return "Agrega algo del menú";
    if (modo === "mesa" && !mesa.trim()) return "Indica el número de mesa";
    if (modo !== "mesa" && !cliente.nombre.trim()) return "Escribe tu nombre";
    if (modo !== "mesa" && !cliente.tel.trim()) return "Escribe tu WhatsApp";
    if (modo === "domicilio" && !cliente.direccion.trim()) return "Escribe colonia y calle";
    return "";
  };

  const enviarWA = async () => {
    const err = validar();
    if (err) { setError(err); return; }
    setError("");
    const f = folio || nuevoFolio();
    setFolio(f);
    const msg = armarMensaje({ items, total, modo, mesa, cliente, folio: f, descuento, pct });
    window.open(`${WA_URL}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setEnviado(true);
    if (!user) return;
    try {
      await registrarPedido({
        userId: user.id,
        folio: f,
        items,
        total: final,
        descuento,
        modo,
        mesa,
        cliente,
      });
      const patch = { nombre: cliente.nombre, tel: cliente.tel };
      if (modo === "domicilio") patch.direccion = cliente.direccion;
      await saveMiPerfil(user.id, patch);
    } catch {
      // El WhatsApp ya salió; el historial se puede perder si falla la base.
    }
  };

  const irAlMenu = () => {
    setOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!open) return null;

  return (
    <div className="pedido-shell">
      <div className="pedido-backdrop" onClick={() => setOpen(false)} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedido-titulo"
        className="pedido-panel"
        style={sheet.mobile ? {
          position: "absolute",
          top: sheet.offsetTop,
          left: 0,
          right: 0,
          height: sheet.height,
          maxWidth: "100%",
        } : undefined}
      >
        <div className="pedido-header">
          <div className="pedido-handle" aria-hidden />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <ShoppingBag01Icon size={22} color={C.ink} />
              <div style={{ minWidth: 0 }}>
                <h3 id="pedido-titulo" style={{ fontFamily: "Noto Sans JP, sans-serif", fontWeight: 900, fontSize: 18, margin: 0, color: C.ink }}>Tu Pedido</h3>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>
                  {count === 0 ? "Agrega platillos del menú" : `${count} platillo${count === 1 ? "" : "s"}`}
                  {folio ? ` · #${folio}` : ""}
                </p>
              </div>
            </div>
            <button className="pedido-close" onClick={() => setOpen(false)} aria-label="Cerrar pedido" style={{
              background: C.paper, border: "none", borderRadius: 8,
              width: 36, height: 36, cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cancel01Icon size={16} color={C.muted} />
            </button>
          </div>
        </div>

        <div className="pedido-body">
          <div>
            <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, margin: "0 0 10px" }}>¿Cómo lo quieres?</p>
            <div className="pedido-modos">
              {[
                ["llevar",    "Llevar",     HandBag01Icon],
                ["mesa",      "En mesa",    Chair01Icon],
                ["domicilio", "Domicilio",  Location01Icon],
              ].map(([val, label, Icon]) => (
                <button
                  key={val}
                  className="pedido-modo"
                  onClick={() => { setModo(val); setError(""); }}
                  style={{
                    border: `1.5px solid ${modo === val ? C.teal : C.border}`,
                    background: modo === val ? "rgba(42,139,139,0.08)" : "transparent",
                    color: modo === val ? C.teal : C.muted,
                  }}
                >
                  <Icon size={18} color={modo === val ? C.teal : C.muted} /> {label}
                </button>
              ))}
            </div>

            {user && (
              <p className="pedido-saludo">
                {perfil?.nombre ? `Hola, ${perfil.nombre.split(" ")[0]}` : "Tu perfil"}
                {pct > 0 ? ` · ${pct}% de descuento` : ""}
              </p>
            )}

            {modo === "mesa" && (
              <input
                type="text"
                className="pedido-input"
                placeholder="Número de mesa (ej: 3)"
                value={mesa}
                onChange={e => { setMesa(e.target.value); setError(""); }}
                onFocus={scrollCampoVisible}
                style={{ marginTop: 12 }}
                inputMode="numeric"
              />
            )}

            {modo !== "mesa" && (
              <div className="pedido-campos" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {!user && (
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setCuentaOpen(true); }}
                    style={{
                      background: "rgba(42,139,139,0.08)", border: `1.5px dashed ${C.teal}`,
                      borderRadius: 8, padding: "10px 12px", textAlign: "left",
                      cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
                      fontSize: 12, fontWeight: 700, color: C.teal,
                    }}
                  >
                    Crea tu perfil para no volver a escribir tu dirección
                  </button>
                )}
                <input
                  type="text"
                  className="pedido-input"
                  placeholder="Tu nombre"
                  value={cliente.nombre}
                  onChange={e => { setCampo("nombre", e.target.value); setError(""); }}
                  onFocus={scrollCampoVisible}
                  autoComplete="name"
                />
                <input
                  type="tel"
                  className="pedido-input"
                  placeholder="WhatsApp (733…)"
                  value={cliente.tel}
                  onChange={e => { setCampo("tel", e.target.value); setError(""); }}
                  onFocus={scrollCampoVisible}
                  autoComplete="tel"
                />
                {modo === "domicilio" && (
                  <input
                    type="text"
                    className="pedido-input"
                    placeholder="Colonia, calle y referencias"
                    value={cliente.direccion}
                    onChange={e => { setCampo("direccion", e.target.value); setError(""); }}
                    onFocus={scrollCampoVisible}
                    autoComplete="street-address"
                  />
                )}
              </div>
            )}

            <div style={{
              marginTop: 12, background: C.paper, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <Timer01Icon size={18} color={C.muted} />
              <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 11, fontWeight: 700, color: C.ink, margin: 0 }}>
                Preparación 30–45 min · Iguala y alrededores
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <img src="/sushito.png" alt="" style={{
                width: 130, height: "auto", margin: "0 auto 16px", display: "block",
              }} />
              <div style={{
                display: "inline-block", background: "#fff",
                border: `1.5px solid ${C.teal}`, borderRadius: 14,
                padding: "10px 18px", marginBottom: 4,
              }}>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 13, fontWeight: 700, color: C.teal, margin: 0 }}>
                  ¡Aún no me has alimentado!
                </p>
              </div>
              <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, margin: "8px 0 16px", color: C.muted }}>Agrega algo del menú para empezar</p>
              <button onClick={irAlMenu} style={{
                background: C.teal, color: C.cream, border: "none", borderRadius: 8,
                padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "Noto Sans JP, sans-serif",
              }}>Ver el menú</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, margin: 0 }}>Tu orden</p>
              {items.map(item => (
                <ItemRow key={item.id} item={item}
                  onQuitar={() => quitar(item.id)}
                  onAgregar={() => agregar(item)}
                  onNota={n => setNota(item.id, n)}
                />
              ))}
            </div>
          )}

          {sugerencia && items.length > 0 && (
            <div className="pedido-sugerencia" style={{
              background: "rgba(42,139,139,0.06)", border: `1px dashed ${C.coral}`,
              borderRadius: 10, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <ServingFoodIcon size={24} color={C.coral} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, fontWeight: 700, color: C.coral, margin: "0 0 2px" }}>{sugerencia.msg}</p>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>{sugerencia.nombre} · ${sugerencia.precio}</p>
              </div>
              <button onClick={() => agregar(sugerencia)}
                style={{
                  background: C.teal, color: C.cream, border: "none",
                  borderRadius: 6, padding: "10px 14px", fontSize: 12,
                  fontWeight: 700, cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
                  flexShrink: 0,
                }}>+ Sí</button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={`pedido-footer${sheet.keyboard ? " kb-open" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, gap: 12 }}>
              <span style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 14, color: C.muted }}>
                {descuento > 0 ? "Total con descuento" : "Total estimado"}
              </span>
              <span style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 20, fontWeight: 900, color: C.ink }}>
                {descuento > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: "line-through", marginRight: 8 }}>${total}</span>
                )}
                ${final} MXN
              </span>
            </div>

            {error && (
              <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, color: C.shu, margin: "0 0 10px", fontWeight: 600 }}>
                {error}
              </p>
            )}

            {enviado && (
              <div style={{
                background: "rgba(37,211,102,0.12)", border: "1px solid #25D366",
                borderRadius: 8, padding: "10px 12px", marginBottom: 10,
              }}>
                <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, fontWeight: 700, color: C.ink, margin: 0 }}>
                  Pedido #{folio} abierto en WhatsApp. Si no saltó, pulsa de nuevo.
                </p>
              </div>
            )}

            <button onClick={enviarWA} style={{
              width: "100%", background: "#25D366", color: "#fff",
              border: "none", borderRadius: 10, padding: "16px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "Noto Sans JP, sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <WhatsappIcon size={20} color="#fff" />
              {enviado ? "Reenviar por WhatsApp" : "Enviar pedido por WhatsApp"}
            </button>

            {enviado ? (
              <button onClick={() => { limpiar(); setOpen(false); }} style={{
                width: "100%", background: "transparent", color: C.teal,
                border: "none", padding: "12px", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
                marginTop: 4, minHeight: 44,
              }}>
                Ya lo envié — vaciar pedido
              </button>
            ) : (
              <button onClick={limpiar} style={{
                width: "100%", background: "transparent", color: C.muted,
                border: "none", padding: "12px", fontSize: 12,
                cursor: "pointer", fontFamily: "Noto Sans JP, sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                marginTop: 4, minHeight: 44,
              }}>
                <Delete02Icon size={14} color={C.muted} />
                Limpiar pedido
              </button>
            )}
          </div>
        )}
      </div>

      {fielOpen && pct > 0 && (
        <FielPopup pct={pct} onClose={cerrarFiel} />
      )}
    </div>
  );
}

function FielPopup({ pct, onClose }) {
  const btnRef = useRef(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div className="fiel-overlay" onClick={onClose}>
      <div
        className="fiel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fiel-titulo"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" className="fiel-modal-close" onClick={onClose} aria-label="Cerrar">
          <Cancel01Icon size={16} color="#F3FAFB" />
        </button>
        <div className="fiel-modal-foto">
          <img src="/fiel-roll.jpg" alt="" />
        </div>
        <div className="fiel-modal-body">
          <span className="fiel-modal-ornament" aria-hidden />
          <h3 id="fiel-titulo">Cliente fiel</h3>
          <p>Por ser cliente fiel tienes {pct}% de descuento.</p>
          <button ref={btnRef} type="button" className="fiel-modal-btn" onClick={onClose}>
            Aprovecharlo
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, onQuitar, onAgregar, onNota }) {
  const foto = parseFotoPos(item.foto);
  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <div className="pedido-item-top">
        <div className="pedido-item-foto" style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.paper, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.foto
            ? <img src={foto.src} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${foto.x}% ${foto.y}%` }} />
            : <ServingFoodIcon size={24} color={C.border} />
          }
        </div>

        <div className="pedido-item-info" style={{ flex: 1, minWidth: 0 }}>
          <p className="pedido-item-nombre" style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 13, fontWeight: 700, color: C.ink, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.nombre}
          </p>
          <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>
            ${item.precio} c/u
          </p>
          <p style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 12, color: C.coral, fontWeight: 700, margin: 0 }}>
            ${item.precio * item.qty} MXN
          </p>
        </div>

        <div className="pedido-item-qty">
          <span className="pedido-qty-label">Cantidad</span>
          <button className="pedido-qty-btn" onClick={onQuitar} aria-label="Quitar uno" style={{
            border: `1px solid ${C.border}`,
            background: "transparent", color: C.muted,
          }}>−</button>
          <span style={{ fontFamily: "Noto Sans JP, sans-serif", fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
          <button className="pedido-qty-btn" onClick={onAgregar} aria-label="Agregar uno" style={{
            border: "none",
            background: C.teal, color: C.cream,
          }}>+</button>
        </div>
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{ display: "flex", flexShrink: 0 }}>
            <PencilEdit01Icon size={14} color={item.nota ? C.coral : C.muted} />
          </span>
          <input
            type="text"
            className="pedido-nota-input"
            placeholder="Nota: sin pepino, extra picante…"
            value={item.nota || ""}
            onChange={e => onNota(e.target.value)}
            onFocus={scrollCampoVisible}
            style={{ borderColor: item.nota ? C.coral : C.border }}
          />
        </label>
      </div>
    </div>
  );
}
