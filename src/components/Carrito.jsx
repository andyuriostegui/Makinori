import { useState, useEffect, useRef } from "react";
import { C } from "./tokens";
import { PRODUCTOS } from "./data";

// ─── Store global del carrito ────────────────────────────────
export function useCarrito() {
  const [items, setItems] = useState([]);
  const [modo, setModo] = useState("llevar"); // "llevar" | "mesa"
  const [mesa, setMesa] = useState("");
  const [open, setOpen] = useState(false);
  const [bounce, setBounce] = useState(false);

  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const agregar = (producto) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === producto.id);
      if (ex) return prev.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...producto, qty: 1, nota: "" }];
    });
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  const quitar = (id) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === id);
      if (ex?.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const setNota = (id, nota) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, nota } : i));
  };

  const limpiar = () => setItems([]);

  return { items, total, count, open, setOpen, agregar, quitar, setNota, limpiar, modo, setModo, mesa, setMesa, bounce };
}

// ─── Contexto para pasar el carrito a todos los componentes ──
import { createContext, useContext } from "react";
export const CarritoCtx = createContext(null);
export const useCarritoCtx = () => useContext(CarritoCtx);

// ─── Sugerencias automáticas ─────────────────────────────────
const SUGERENCIAS = {
  2: { id: 8, nombre: "Mogu Mogu", precio: 67, emoji: "🍹", msg: "¿Le agregas un Mogu Mogu?" },
  1: { id: 7, nombre: "Aros de Cebolla", precio: 65, emoji: "🧅", msg: "¿Unos aros para acompañar?" },
  3: { id: 9, nombre: "Palomitas Grande", precio: 80, emoji: "🍿", msg: "¿Unas palomitas también?" },
};

// ─── Botón de agregar en tarjeta ─────────────────────────────
export function BtnAgregar({ producto }) {
  const { items, agregar, quitar } = useCarritoCtx();
  const item = items.find(i => i.id === producto.id);
  const qty = item?.qty || 0;
  const [pop, setPop] = useState(false);

  const handleAgregar = () => {
    agregar(producto);
    setPop(true);
    setTimeout(() => setPop(false), 300);
  };

  return (
    <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {qty === 0 ? (
        <button onClick={handleAgregar} style={{
          background: pop ? "#C93D22" : C.coral,
          color: C.cream, border: "none", borderRadius: 6,
          padding: "8px 16px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "DM Sans, sans-serif",
          transition: "all 0.15s",
          transform: pop ? "scale(0.95)" : "scale(1)",
          width: "100%",
        }}>
          + Agregar al pedido
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
          <button onClick={() => quitar(producto.id)} style={{
            width: 32, height: 32, borderRadius: 6, border: `1.5px solid ${C.border}`,
            background: "transparent", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.ink, fontWeight: 700,
          }}>−</button>
          <span style={{
            flex: 1, textAlign: "center", fontWeight: 700,
            fontSize: 14, color: C.ink, fontFamily: "DM Sans, sans-serif",
          }}>{qty} en pedido</span>
          <button onClick={handleAgregar} style={{
            width: 32, height: 32, borderRadius: 6, border: "none",
            background: C.coral, fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.cream, fontWeight: 700,
            transform: pop ? "scale(0.9)" : "scale(1)",
            transition: "transform 0.15s",
          }}>+</button>
        </div>
      )}
    </div>
  );
}

// ─── Botón flotante del carrito ───────────────────────────────
export function CarritoBtn() {
  const { count, open, setOpen, bounce } = useCarritoCtx();
  return (
    <button onClick={() => setOpen(o => !o)} style={{
      position: "fixed", bottom: 92, right: 24, zIndex: 999,
      background: C.ink, color: C.cream,
      border: "none", borderRadius: 50, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 10,
      cursor: "pointer", fontFamily: "DM Sans, sans-serif",
      boxShadow: "0 8px 32px rgba(26,26,24,0.25)",
      transform: bounce ? "scale(1.12)" : "scale(1)",
      transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s",
    }}>
      <span style={{ fontSize: 20 }}>🛍️</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>
        {count === 0 ? "Tu pedido" : `${count} item${count > 1 ? "s" : ""}`}
      </span>
      {count > 0 && (
        <span style={{
          background: C.coral, color: C.cream,
          borderRadius: 20, padding: "2px 8px",
          fontSize: 11, fontWeight: 900,
        }}>{count}</span>
      )}
    </button>
  );
}

// ─── Panel del carrito ────────────────────────────────────────
export function CarritoPanel() {
  const { items, total, count, open, setOpen, quitar, agregar, setNota, limpiar, modo, setModo, mesa, setMesa } = useCarritoCtx();
  const [countdown, setCountdown] = useState(720); // 12 min
  const [sugerencia, setSugerencia] = useState(null);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 720), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = String(countdown % 60).padStart(2, "0");
  const urgente = countdown < 180;

  // Sugerencia automática
  useEffect(() => {
    const ids = items.map(i => i.id);
    for (const id of ids) {
      if (SUGERENCIAS[id]) { setSugerencia(SUGERENCIAS[id]); return; }
    }
    setSugerencia(null);
  }, [items]);

  const enviarWA = () => {
    if (items.length === 0) return;
    const lineas = items.map(i =>
      `• ${i.qty}x ${i.nombre} — $${i.precio * i.qty}${i.nota ? ` (${i.nota})` : ""}`
    ).join("\n");
    const modoStr = modo === "mesa" ? `📍 Mesa: ${mesa || "?"}` : "🥡 Para llevar";
    const msg = `¡Hola Maki Nori! Quiero hacer un pedido:\n\n${lineas}\n\n${modoStr}\n💰 Total: $${total} MXN\n\n¡Gracias!`;
    window.open(`https://wa.me/527331002030?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", justifyContent: "flex-end",
    }}>
      {/* Backdrop */}
      <div onClick={() => setOpen(false)} style={{
        position: "absolute", inset: 0,
        background: "rgba(26,26,24,0.5)", backdropFilter: "blur(4px)",
      }} />

      {/* Panel */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 420,
        background: C.cream, height: "100%",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(26,26,24,0.15)",
        overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 900, fontSize: 18, margin: 0, color: C.ink }}>
                Tu Pedido 🛍️
              </h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>
                {count === 0 ? "Agrega items del menú" : `${count} item${count > 1 ? "s" : ""} seleccionados`}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: C.paper, border: "none", borderRadius: 8,
              width: 36, height: 36, cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Countdown */}
          <div style={{
            marginTop: 12, background: urgente ? "rgba(232,84,58,0.1)" : C.paper,
            border: `1px solid ${urgente ? C.coral : C.border}`,
            borderRadius: 8, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>⏱</span>
            <div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 700, color: urgente ? C.coral : C.ink, margin: 0 }}>
                {urgente ? "¡Últimos minutos!" : "Pide ahora"} — entrega en 30-45 min
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: C.muted, margin: 0 }}>
                Tiempo estimado de espera: {mins}:{secs}
              </p>
            </div>
          </div>
        </div>

        {/* Modo mesa/llevar */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, margin: "0 0 10px" }}>¿Cómo lo quieres?</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[["llevar", "🥡 Para llevar"], ["mesa", "🪑 En mesa"]].map(([val, label]) => (
              <button key={val} onClick={() => setModo(val)} style={{
                flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                border: `1.5px solid ${modo === val ? C.coral : C.border}`,
                background: modo === val ? "rgba(232,84,58,0.08)" : "transparent",
                color: modo === val ? C.coral : C.muted,
                transition: "all 0.15s",
              }}>{label}</button>
            ))}
          </div>
          {modo === "mesa" && (
            <input
              type="text" placeholder="Número de mesa (ej: 3)"
              value={mesa} onChange={e => setMesa(e.target.value)}
              style={{
                marginTop: 10, width: "100%", padding: "10px 12px",
                border: `1.5px solid ${C.border}`, borderRadius: 8,
                fontSize: 13, fontFamily: "DM Sans, sans-serif",
                color: C.ink, background: "#fff", boxSizing: "border-box",
                outline: "none",
              }}
            />
          )}
        </div>

        {/* Items */}
        <div style={{ flex: 1, padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>
              <p style={{ fontSize: 40, margin: "0 0 12px" }}>🍱</p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: C.ink }}>Tu pedido está vacío</p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, margin: 0 }}>Agrega algo del menú para empezar</p>
            </div>
          ) : items.map(item => (
            <ItemRow key={item.id} item={item} onQuitar={() => quitar(item.id)} onAgregar={() => agregar(item)} onNota={(n) => setNota(item.id, n)} />
          ))}

          {/* Sugerencia */}
          {sugerencia && items.length > 0 && (
            <div style={{
              background: "rgba(232,84,58,0.06)", border: `1px dashed ${C.coral}`,
              borderRadius: 10, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{sugerencia.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 700, color: C.coral, margin: "0 0 2px" }}>
                  {sugerencia.msg}
                </p>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: C.muted, margin: 0 }}>
                  {sugerencia.nombre} · ${sugerencia.precio}
                </p>
              </div>
              <button onClick={() => agregar({ id: sugerencia.id, nombre: sugerencia.nombre, precio: sugerencia.precio, foto: null })}
                style={{
                  background: C.coral, color: C.cream, border: "none",
                  borderRadius: 6, padding: "6px 12px", fontSize: 11,
                  fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                }}>+ Sí</button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "16px 24px 28px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: C.muted }}>Total estimado</span>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 20, fontWeight: 900, color: C.ink }}>${total} MXN</span>
            </div>
            <button onClick={enviarWA} style={{
              width: "100%", background: "#25D366", color: "#fff",
              border: "none", borderRadius: 10, padding: "16px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <span style={{ fontSize: 20 }}>💬</span>
              Enviar pedido por WhatsApp
            </button>
            <button onClick={limpiar} style={{
              width: "100%", background: "transparent", color: C.muted,
              border: "none", padding: "10px", fontSize: 12,
              cursor: "pointer", fontFamily: "DM Sans, sans-serif", marginTop: 4,
            }}>Limpiar pedido</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Fila de item en el panel ─────────────────────────────────
function ItemRow({ item, onQuitar, onAgregar, onNota }) {
  const [editNota, setEditNota] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 10, overflow: "hidden",
      border: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", gap: 12, padding: "12px 12px 8px" }}>
        {/* Foto */}
        <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.paper }}>
          {item.foto
            ? <img src={item.foto} alt={item.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍱</div>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, color: C.ink, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.nombre}
          </p>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: C.coral, fontWeight: 700, margin: 0 }}>
            ${item.precio * item.qty} MXN
          </p>
        </div>

        {/* Qty controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button onClick={onQuitar} style={{
            width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border}`,
            background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.muted,
          }}>−</button>
          <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
          <button onClick={onAgregar} style={{
            width: 26, height: 26, borderRadius: 6, border: "none",
            background: C.coral, cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.cream,
          }}>+</button>
        </div>
      </div>

      {/* Nota */}
      <div style={{ padding: "0 12px 10px" }}>
        {editNota ? (
          <input
            autoFocus
            type="text" placeholder="Ej: sin pepino, extra picante..."
            value={item.nota} onChange={e => onNota(e.target.value)}
            onBlur={() => setEditNota(false)}
            style={{
              width: "100%", padding: "6px 10px", fontSize: 11,
              border: `1px solid ${C.coral}`, borderRadius: 6,
              fontFamily: "DM Sans, sans-serif", color: C.ink,
              background: "#fff", boxSizing: "border-box", outline: "none",
            }}
          />
        ) : (
          <button onClick={() => setEditNota(true)} style={{
            background: "none", border: "none", padding: 0,
            fontSize: 11, color: item.nota ? C.coral : C.muted,
            cursor: "pointer", fontFamily: "DM Sans, sans-serif",
          }}>
            {item.nota ? `📝 ${item.nota}` : "+ Agregar nota (sin pepino, etc.)"}
          </button>
        )}
      </div>
    </div>
  );
}