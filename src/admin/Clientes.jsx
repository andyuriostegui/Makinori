import { useEffect, useMemo, useState } from "react";
import { fetchClientesAdmin, formatCuando, friendlyAuthError, isMissingTable, patchCliente } from "../lib/clientes";
import { formatPrecio } from "../lib/catalog";

export default function ClientesAdmin({ setError, setOk }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);

  const reload = async () => {
    try {
      const list = await fetchClientesAdmin();
      setRows(list);
      setMissing(false);
      setError("");
    } catch (e) {
      if (isMissingTable(e)) {
        setMissing(true);
        setRows([]);
      } else {
        setError(friendlyAuthError(e.message));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await fetchClientesAdmin();
        if (!alive) return;
        setRows(list);
        setMissing(false);
        setError("");
      } catch (e) {
        if (!alive) return;
        if (isMissingTable(e)) {
          setMissing(true);
          setRows([]);
        } else {
          setError(friendlyAuthError(e.message));
        }
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [setError]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((c) =>
      `${c.nombre} ${c.tel} ${c.direccion}`.toLowerCase().includes(query),
    );
  }, [rows, q]);

  const destacados = filtered.filter((c) => c.destacado);
  const online = rows.filter((c) => c.enLinea).length;

  const toggleDestacado = async (c) => {
    setError("");
    try {
      await patchCliente(c.id, { destacado: !c.destacado });
      setOk(c.destacado ? "Ya no está en destacados." : "Cliente destacado. Ya le puedes poner descuento.");
      await reload();
    } catch (e) {
      setError(friendlyAuthError(e.message));
    }
  };

  const setDescuento = async (c, raw) => {
    const n = Math.max(0, Math.min(100, Number(raw) || 0));
    setError("");
    try {
      await patchCliente(c.id, { descuento: n });
      setOk(n > 0 ? `Descuento de ${n}% para ${c.nombre || "este cliente"}.` : "Sin descuento.");
      await reload();
    } catch (e) {
      setError(friendlyAuthError(e.message));
    }
  };

  if (missing) {
    return (
      <p className="admin-lead">
        Para ver clientes hay que correr el SQL de perfiles en Supabase (archivo supabase/setup.sql).
        Hasta entonces el menú sigue igual.
      </p>
    );
  }

  return (
    <>
      <p className="admin-lead">
        Quién entra, cuántos pedidos lleva y a quién le sueltas descuento.
        {online > 0 ? ` ${online} en línea ahora.` : ""}
      </p>
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Buscar por nombre, WhatsApp o colonia…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p className="admin-lead">Cargando clientes…</p>}
      {!loading && filtered.length === 0 && (
        <p className="admin-lead">Todavía no hay perfiles. Cuando alguien cree cuenta aquí aparece.</p>
      )}

      {destacados.length > 0 && (
        <p className="admin-clientes-kicker">
          {destacados.length} destacado{destacados.length === 1 ? "" : "s"} — ellos van primero
        </p>
      )}

      <div className="admin-list">
        {filtered.map((c) => (
          <ClienteCard
            key={c.id}
            c={c}
            open={openId === c.id}
            onToggle={() => setOpenId(openId === c.id ? null : c.id)}
            onDestacado={() => toggleDestacado(c)}
            onDescuento={(v) => setDescuento(c, v)}
          />
        ))}
      </div>
    </>
  );
}

function ClienteCard({ c, open, onToggle, onDestacado, onDescuento }) {
  const [desc, setDesc] = useState(null);
  const descValue = desc ?? String(c.descuento ?? 0);

  return (
    <div className={`admin-cliente ${c.destacado ? "feat" : ""}`}>
      <button type="button" className="admin-cliente-top" onClick={onToggle}>
        <span className={`admin-cliente-dot ${c.enLinea ? "on" : ""}`} aria-hidden />
        <div>
          <h3>{c.nombre?.trim() || "Sin nombre"}</h3>
          <p>
            {c.enLinea ? "En línea" : formatCuando(c.last_seen_at)}
            {" · "}
            {c.pedidosN} pedido{c.pedidosN === 1 ? "" : "s"}
            {c.gastado > 0 ? ` · ${formatPrecio(c.gastado)}` : ""}
          </p>
          <div className="admin-row-meta">
            {c.destacado && <span className="admin-pill hot">Destacado</span>}
            {Number(c.descuento) > 0 && <span className="admin-pill">{Number(c.descuento)}% off</span>}
          </div>
        </div>
      </button>
      {open && (
        <div className="admin-cliente-body">
          {c.tel && <p>WhatsApp: {c.tel}</p>}
          {c.direccion && <p>Dirección: {c.direccion}</p>}
          <p>Se registró {formatCuando(c.created_at)}</p>
          <div className="admin-feed-actions">
            <button type="button" className={c.destacado ? "hot" : ""} onClick={onDestacado}>
              {c.destacado ? "Quitar de destacados" : "Marcar destacado"}
            </button>
          </div>
          <div className="admin-field" style={{ marginTop: 10 }}>
            <label>Descuento %</label>
            <input
              type="number"
              min="0"
              max="100"
              inputMode="numeric"
              value={descValue}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={() => {
                if (String(c.descuento ?? 0) !== String(descValue)) onDescuento(descValue);
                setDesc(null);
              }}
            />
          </div>
          {c.pedidos.length > 0 && (
            <div className="admin-cliente-pedidos">
              <p className="admin-clientes-kicker">Últimos pedidos</p>
              {c.pedidos.slice(0, 8).map((o) => (
                <p key={o.id}>
                  {o.folio ? `#${o.folio}` : "Pedido"} · {formatPrecio(o.total)} · {formatCuando(o.created_at)}
                  {o.modo ? ` · ${o.modo}` : ""}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
