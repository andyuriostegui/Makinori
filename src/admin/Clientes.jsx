import { useEffect, useMemo, useState } from "react";
import { fetchClientesAdmin, formatCuando, friendlyAuthError, isMissingRegalo, isMissingTable, patchCliente } from "../lib/clientes";
import { fetchMenuOferta, formatPrecio, parseFotoPos } from "../lib/catalog";

export default function ClientesAdmin({ setError, setOk }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const [menu, setMenu] = useState({ categorias: [], platillos: [] });
  const [missingRegalo, setMissingRegalo] = useState(false);

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
        const [list, nextMenu] = await Promise.all([fetchClientesAdmin(), fetchMenuOferta()]);
        if (!alive) return;
        setRows(list);
        setMenu(nextMenu);
        setMissing(false);
        setMissingRegalo(list.some((c) => c.regalo_id === undefined));
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
      setOk(c.destacado ? "Ya no está en destacados." : "Cliente destacado. Ya le puedes ofrecer un platillo.");
      await reload();
    } catch (e) {
      setError(friendlyAuthError(e.message));
    }
  };

  const setRegalo = async (c, platilloId) => {
    const id = platilloId || null;
    const platillo = menu.platillos.find((p) => p.id === id);
    setError("");
    try {
      await patchCliente(c.id, { regalo_id: id });
      setMissingRegalo(false);
      setOk(
        platillo
          ? `Cortesía: ${platillo.nombre} para ${c.nombre || "este cliente"}.`
          : "Sin platillo de cortesía.",
      );
      await reload();
    } catch (e) {
      if (isMissingRegalo(e)) setMissingRegalo(true);
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
        Quién entra, cuántos pedidos lleva y a quién le ofreces un platillo de cortesía.
        {online > 0 ? ` ${online} en línea ahora.` : ""}
      </p>
      {missingRegalo && (
        <p className="admin-lead">
          Para asignar platillos hay que correr el SQL nuevo en Supabase (columna regalo_id al final de supabase/setup.sql).
        </p>
      )}
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
            onRegalo={(id) => setRegalo(c, id)}
            menu={menu}
          />
        ))}
      </div>
    </>
  );
}

function gruposMenu({ categorias, platillos }) {
  const used = new Set();
  const groups = [];
  const sortedCats = [...categorias].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  for (const cat of sortedCats) {
    const items = platillos.filter((p) => p.categoria_id === cat.id);
    if (!items.length) continue;
    items.forEach((p) => used.add(p.id));
    groups.push({ id: cat.id, nombre: cat.nombre, items });
  }
  const resto = platillos.filter((p) => !used.has(p.id));
  if (resto.length) groups.push({ id: "otros", nombre: "Otros", items: resto });
  return groups;
}

function ClienteCard({ c, open, onToggle, onDestacado, onRegalo, menu }) {
  const platillo = (menu.platillos || []).find((p) => p.id === c.regalo_id) || null;
  const groups = useMemo(() => gruposMenu(menu), [menu]);
  const foto = platillo ? parseFotoPos(platillo.imagen_url) : null;

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
            {platillo && <span className="admin-pill">Cortesía · {platillo.nombre}</span>}
            {!platillo && Number(c.descuento) > 0 && <span className="admin-pill">{Number(c.descuento)}% off</span>}
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
            <label>Platillo de cortesía</label>
            <select
              value={c.regalo_id || ""}
              onChange={(e) => onRegalo(e.target.value)}
            >
              <option value="">Sin cortesía</option>
              {c.regalo_id && !platillo && (
                <option value={c.regalo_id}>Platillo ya no está en el menú</option>
              )}
              {groups.map((g) => (
                <optgroup key={g.id} label={g.nombre}>
                  {g.items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} · {formatPrecio(p.precio)}
                      {p.disponible === false ? " (oculto)" : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {platillo && (
              <div className="admin-regalo-preview">
                {foto?.src
                  ? <img src={foto.src} alt="" style={{ objectPosition: `${foto.x}% ${foto.y}%` }} />
                  : <div className="admin-regalo-preview-empty" aria-hidden />}
                <div>
                  <strong>{platillo.nombre}</strong>
                  <span>Se agrega gratis en su próximo pedido · {formatPrecio(platillo.precio)}</span>
                </div>
              </div>
            )}
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
