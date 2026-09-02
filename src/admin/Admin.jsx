import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { importLocalMenu, ensureCategorias } from "../lib/importCatalog";
import { formatPrecio, parseFotoPos, withFotoPos } from "../lib/catalog";
import { fetchGaleria, saveGaleria, uploadGaleriaFoto } from "../lib/galeria";
import { asegurarStaff, isMissingTable } from "../lib/clientes";
import { useAuth } from "../auth/AuthContext";
import ClientesAdmin from "./Clientes";
import "./admin.css";

const EMPTY = {
  nombre: "",
  nombre_jp: "",
  descripcion: "",
  precio: "",
  imagen_url: "",
  badge: "",
  categoria_id: "",
  disponible: true,
  en_feed: false,
  destacado: false,
  wide: false,
  orden: 0,
  feed_orden: 0,
  imagen_x: 50,
  imagen_y: 50,
};

function clampPct(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 50;
  return Math.max(0, Math.min(100, v));
}

function FotoThumb({ url }) {
  const { src, x, y } = parseFotoPos(url);
  if (!src) return <div className="admin-thumb" />;
  return <img src={src} alt="" style={{ objectPosition: `${x}% ${y}%` }} />;
}

function PhotoPositioner({ src, x, y, onChange }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  const setPos = (nx, ny) => onChange(clampPct(nx), clampPct(ny));

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, x, y };
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    const box = stageRef.current;
    if (!drag || !box) return;
    const r = box.getBoundingClientRect();
    if (!r.width || !r.height) return;
    setPos(drag.x - ((e.clientX - drag.px) / r.width) * 100, drag.y - ((e.clientY - drag.py) / r.height) * 100);
  };

  const onPointerUp = () => { dragRef.current = null; };

  return (
    <div className="admin-photo-block">
      <div
        ref={stageRef}
        className="admin-photo-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img src={src} alt="" draggable={false} style={{ objectPosition: `${x}% ${y}%` }} />
        <i className="admin-photo-cross" aria-hidden />
      </div>
      <div className="admin-photo-nudge">
        <button type="button" onClick={() => setPos(x, y + 6)} aria-label="Mover arriba">↑</button>
        <div className="admin-photo-nudge-mid">
          <button type="button" onClick={() => setPos(x + 6, y)} aria-label="Mover a la izquierda">←</button>
          <button type="button" onClick={() => setPos(50, 50)}>Centrar</button>
          <button type="button" onClick={() => setPos(x - 6, y)} aria-label="Mover a la derecha">→</button>
        </div>
        <button type="button" onClick={() => setPos(x, y - 6)} aria-label="Mover abajo">↓</button>
      </div>
      <p className="admin-photo-hint">Arrastra la foto o usa las flechas para dejar el platillo al centro del recuadro.</p>
    </div>
  );
}

function friendlyError(msg = "") {
  const t = String(msg).toLowerCase();
  if (t.includes("bucket") || t.includes("not found")) return "Falta crear la carpeta de fotos en Supabase (Storage → bucket platillos).";
  if (t.includes("row-level security") || t.includes("rls") || t.includes("permission")) return "No hay permiso para guardar. Revisa que hayas iniciado sesión.";
  if (t.includes("invalid login") || t.includes("invalid credentials")) return "Email o contraseña incorrectos.";
  return msg || "Algo salió mal. Inténtalo de nuevo.";
}

function uniqueCategorias(categorias, platillos = []) {
  const counts = {};
  for (const p of platillos) {
    counts[p.categoria_id] = (counts[p.categoria_id] || 0) + 1;
  }
  const bySlug = new Map();
  for (const c of categorias) {
    const slug = String(c.slug || "").trim();
    if (!slug) continue;
    const prev = bySlug.get(slug);
    if (!prev || (counts[c.id] || 0) > (counts[prev.id] || 0)) bySlug.set(slug, c);
  }
  return [...bySlug.values()].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || String(a.nombre).localeCompare(String(b.nombre), "es"));
}

function Switch({ on, onChange, label, hint }) {
  return (
    <button type="button" className={`admin-switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
      <i className="admin-knob" aria-hidden />
    </button>
  );
}

export default function Admin() {
  const { session, perfil, loading, setPerfil } = useAuth();
  const [tab, setTab] = useState("catalogo");

  useEffect(() => {
    if (loading || !session) return undefined;
    if (perfil?.rol === "admin" || perfil?.missingTable || perfil?.rol === "cliente") return undefined;
    let alive = true;
    asegurarStaff()
      .then((p) => { if (alive) setPerfil(p || { rol: "cliente" }); })
      .catch((e) => {
        if (!alive) return;
        setPerfil(isMissingTable(e) ? { missingTable: true } : { rol: "cliente" });
      });
    return () => { alive = false; };
  }, [loading, session, perfil, setPerfil]);

  if (!supabase) {
    return (
      <div className="admin-login">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Falta conectar</h1>
          <p>Aún no está ligada la base. Revisa el archivo .env.local.</p>
        </form>
      </div>
    );
  }

  if (loading || session === undefined) {
    return <div className="admin-login"><p style={{ color: "#fff" }}>Cargando…</p></div>;
  }

  if (!session) return <Login />;
  if (!perfil) {
    return <div className="admin-login"><p style={{ color: "#fff" }}>Cargando…</p></div>;
  }

  const canAdmin = perfil.missingTable || perfil.rol === "admin";
  if (!canAdmin) return <NotStaff />;

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <h1>Maki Nori</h1>
        <nav className="admin-tabs">
          <button className={tab === "catalogo" ? "active" : ""} onClick={() => setTab("catalogo")}>Menú</button>
          <button className={tab === "feed" ? "active" : ""} onClick={() => setTab("feed")}>Favoritos</button>
          <button className={tab === "rollos" ? "active" : ""} onClick={() => setTab("rollos")}>Rollos</button>
          <button className={tab === "clientes" ? "active" : ""} onClick={() => setTab("clientes")}>Clientes</button>
        </nav>
        <button className="admin-ghost" onClick={() => supabase.auth.signOut()}>Salir</button>
      </header>
      <nav className="admin-nav">
        <button className={tab === "catalogo" ? "active" : ""} onClick={() => setTab("catalogo")}>Menú</button>
        <button className={tab === "feed" ? "active" : ""} onClick={() => setTab("feed")}>Favoritos</button>
        <button className={tab === "rollos" ? "active" : ""} onClick={() => setTab("rollos")}>Rollos</button>
        <button className={tab === "clientes" ? "active" : ""} onClick={() => setTab("clientes")}>Clientes</button>
      </nav>
      <AdminBody tab={tab} />
    </div>
  );
}

function NotStaff() {
  return (
    <div className="admin-login">
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Esta cuenta es de cliente</h1>
        <p>El panel de cocina es solo para Maki Nori. Entra con la cuenta del restaurante, o vuelve a la web para armar tu pedido.</p>
        <button type="button" className="admin-btn" onClick={() => { window.location.href = "/"; }}>Ir al menú</button>
        <button type="button" className="admin-btn ghost" onClick={() => supabase.auth.signOut()}>Salir de esta cuenta</button>
      </form>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(friendlyError(err.message));
    setBusy(false);
  };

  return (
    <div className="admin-login">
      <form onSubmit={onSubmit}>
        <h1>Maki Nori</h1>
        <p>Entra para cambiar nombres, precios, fotos y lo que sale en la home.</p>
        {error && <div className="admin-alert">{error}</div>}
        <div className="admin-field">
          <label>Email</label>
          <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="admin-field">
          <label>Contraseña</label>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="admin-btn" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
      </form>
    </div>
  );
}

function AdminBody({ tab }) {
  const [categorias, setCategorias] = useState([]);
  const [platillos, setPlatillos] = useState([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const applyResult = (c, p) => {
    if (c.error || p.error) {
      setError(friendlyError(c.error?.message || p.error?.message || "No se pudo leer el menú."));
    } else {
      setCategorias(c.data || []);
      setPlatillos(p.data || []);
      setError("");
    }
    setLoading(false);
  };

  const reload = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("categorias").select("*").order("orden"),
      supabase.from("platillos").select("*").order("orden"),
    ]);
    applyResult(c, p);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ensured = await ensureCategorias();
        if (!alive) return;
        if (ensured.merged > 0) {
          setOk("Había categorías repetidas. Ya las junté: Parrilla Coreana queda una sola.");
        } else if (ensured.createdParrilla) {
          setOk("Listo: ya está Parrilla Coreana. En Menú, elige esa categoría y toca Nuevo para meter el platillo.");
        }
      } catch (e) {
        if (alive) setError(friendlyError(e.message));
      }
      const [c, p] = await Promise.all([
        supabase.from("categorias").select("*").order("orden"),
        supabase.from("platillos").select("*").order("orden"),
      ]);
      if (!alive) return;
      applyResult(c, p);
    })();
    return () => { alive = false; };
  }, []);

  const onImport = async () => {
    if (!confirm("Esto vuelve a cargar el menú original de la web. ¿Seguimos?")) return;
    setImporting(true);
    setOk("");
    setError("");
    try {
      const res = await importLocalMenu();
      setOk(`Listo: ${res.platillos} platillos cargados.`);
      await reload();
    } catch (e) {
      setError(friendlyError(e.message));
    }
    setImporting(false);
  };

  return (
    <div className="admin-body">
      {error && <div className="admin-alert">{error}</div>}
      {ok && <div className="admin-ok">{ok}</div>}
      {tab === "catalogo" && (
        <Catalogo
          categorias={categorias}
          platillos={platillos}
          loading={loading}
          importing={importing}
          onImport={onImport}
          onReload={reload}
          setError={setError}
          setOk={setOk}
        />
      )}
      {tab === "feed" && (
        <FeedAdmin
          platillos={platillos}
          onReload={reload}
          setError={setError}
        />
      )}
      {tab === "rollos" && (
        <GaleriaAdmin setError={setError} setOk={setOk} />
      )}
      {tab === "clientes" && (
        <ClientesAdmin setError={setError} setOk={setOk} />
      )}
    </div>
  );
}

function Catalogo({ categorias, platillos, loading, importing, onImport, onReload, setError, setOk }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState(null);
  const [moving, setMoving] = useState(false);
  const cats = uniqueCategorias(categorias, platillos);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = platillos.filter((p) => {
      if (cat !== "all" && p.categoria_id !== cat) return false;
      if (!query) return true;
      return `${p.nombre} ${p.descripcion || ""} ${p.badge || ""}`.toLowerCase().includes(query);
    });
    if (cat === "all") return list;
    return [...list].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"));
  }, [platillos, q, cat]);

  const canReorder = cat !== "all" && !q.trim() && filtered.length > 1;
  const catName = (id) => categorias.find((c) => c.id === id)?.nombre || "";
  const seccionNombre = cats.find((c) => c.id === cat)?.nombre || "esta sección";

  const openNew = () => {
    const inCat = platillos.filter((p) => cat !== "all" && p.categoria_id === cat);
    setEditing({
      ...EMPTY,
      categoria_id: (cat !== "all" && cat) || cats[0]?.id || categorias[0]?.id || "",
      orden: inCat.length || platillos.length,
    });
  };

  const writeOrden = async (ordered) => {
    setMoving(true);
    setError("");
    const results = await Promise.all(
      ordered.map((p, i) => supabase.from("platillos").update({ orden: i }).eq("id", p.id)),
    );
    const err = results.find((r) => r.error)?.error;
    if (err) setError(friendlyError(err.message));
    else await onReload();
    setMoving(false);
  };

  const move = async (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= filtered.length || moving) return;
    const ordered = filtered.slice();
    const [item] = ordered.splice(index, 1);
    ordered.splice(next, 0, item);
    await writeOrden(ordered);
  };

  const sortByPrice = async () => {
    if (moving) return;
    if (!confirm(`Esto acomoda ${seccionNombre} del más barato al más caro. Después puedes mover uno con las flechas. ¿Seguimos?`)) return;
    const ordered = [...filtered].sort((a, b) => {
      const pa = Number(a.precio) || 0;
      const pb = Number(b.precio) || 0;
      if (pa !== pb) return pa - pb;
      return String(a.nombre || "").localeCompare(String(b.nombre || ""), "es");
    });
    await writeOrden(ordered);
    setOk("Listo: quedaron del más barato al más caro.");
  };

  return (
    <>
      <p className="admin-lead">
        {canReorder
          ? "Toca un platillo para editarlo. Con las flechas lo mueves dentro de esta sección."
          : cat === "all"
            ? "Toca un platillo para cambiarle el nombre, el precio o la foto. Entra a una categoría para cambiar el orden."
            : "Toca un platillo para cambiarle el nombre, el precio o la foto."}
      </p>
      <div className="admin-toolbar">
        <div className="admin-toolbar-row">
          <input className="admin-search" placeholder="Buscar… Philadelphia, ramen" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="admin-btn small" onClick={openNew}>Nuevo</button>
        </div>
        <div className="admin-chips">
          <button type="button" className={`admin-chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>Todos</button>
          {cats.map((c) => (
            <button type="button" key={c.id} className={`admin-chip ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>
              {c.nombre}
            </button>
          ))}
        </div>
        {canReorder && (
          <button type="button" className="admin-sort-btn" disabled={moving} onClick={sortByPrice}>
            {moving ? "Acomodando…" : "Ordenar esta sección por precio"}
          </button>
        )}
      </div>

      {loading && <p className="admin-lead">Cargando menú…</p>}
      {!loading && filtered.length === 0 && (
        <p className="admin-lead">No hay platillos aquí. Prueba otra categoría o crea uno nuevo.</p>
      )}

      <div className="admin-list">
        {filtered.map((p, i) => (
          <div key={p.id} className="admin-row-wrap">
            <button className="admin-row" onClick={() => setEditing(p)}>
              <FotoThumb url={p.imagen_url} />
              <div>
                <h3>{p.nombre}</h3>
                <p>{catName(p.categoria_id)} · {formatPrecio(p.precio)}</p>
                <div className="admin-row-meta">
                  {p.en_feed && <span className="admin-pill">Favoritos</span>}
                  {p.destacado && <span className="admin-pill hot">Grande</span>}
                  {p.wide && <span className="admin-pill">Ancho</span>}
                  {!p.disponible && <span className="admin-pill off">Oculto</span>}
                </div>
              </div>
            </button>
            {canReorder && (
              <div className="admin-row-move">
                <button type="button" aria-label="Subir" disabled={moving || i === 0} onClick={() => move(i, -1)}>↑</button>
                <button type="button" aria-label="Bajar" disabled={moving || i === filtered.length - 1} onClick={() => move(i, 1)}>↓</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {platillos.length < 10 && (
        <div className="admin-more">
          <button type="button" disabled={importing} onClick={onImport}>
            {importing ? "Cargando menú…" : "Cargar el menú original"}
          </button>
        </div>
      )}

      {editing && (
        <Editor
          key={editing.id || "new"}
          initial={editing}
          categorias={cats.length ? cats : categorias}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); setOk("Guardado."); await onReload(); }}
          onDeleted={async () => { setEditing(null); setOk("Eliminado."); await onReload(); }}
          setError={setError}
        />
      )}
    </>
  );
}

function editorForm(initial) {
  const pos = parseFotoPos(initial?.imagen_url);
  return {
    ...EMPTY,
    ...initial,
    precio: initial?.precio ?? "",
    imagen_url: pos.src,
    imagen_x: pos.x,
    imagen_y: pos.y,
  };
}

function Editor({ initial, categorias, onClose, onSaved, onDeleted, setError }) {
  const [form, setForm] = useState(() => editorForm(initial));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const isNew = !initial.id;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("platillos").upload(path, file, { upsert: false });
    if (error) {
      setError(friendlyError(error.message));
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("platillos").getPublicUrl(path);
    setForm((f) => ({ ...f, imagen_url: data.publicUrl, imagen_x: 50, imagen_y: 50 }));
    setUploading(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const row = {
      nombre: form.nombre.trim(),
      nombre_jp: form.nombre_jp || null,
      descripcion: form.descripcion || null,
      precio: Number(form.precio) || 0,
      imagen_url: withFotoPos(form.imagen_url, form.imagen_x, form.imagen_y) || null,
      badge: form.badge || null,
      categoria_id: form.categoria_id || null,
      disponible: !!form.disponible,
      en_feed: !!form.en_feed,
      destacado: !!form.destacado,
      wide: !!form.wide,
      orden: Number(form.orden) || 0,
      feed_orden: Number(form.feed_orden) || 0,
    };
    if (!row.nombre) {
      setError("Ponle un nombre al platillo.");
      setBusy(false);
      return;
    }
    try {
      if (row.destacado) {
        await supabase.from("platillos").update({ destacado: false }).neq("id", form.id || "00000000-0000-0000-0000-000000000000");
      }
      if (row.wide) {
        await supabase.from("platillos").update({ wide: false }).neq("id", form.id || "00000000-0000-0000-0000-000000000000");
      }
      if (isNew) {
        const { error } = await supabase.from("platillos").insert(row);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("platillos").update(row).eq("id", form.id);
        if (error) throw error;
      }
      await onSaved();
    } catch (err) {
      setError(friendlyError(err.message));
    }
    setBusy(false);
  };

  const remove = async () => {
    if (!form.id) return;
    if (!confirm(`¿Borrar ${form.nombre}?`)) return;
    setBusy(true);
    const { error } = await supabase.from("platillos").delete().eq("id", form.id);
    if (error) setError(friendlyError(error.message));
    else await onDeleted();
    setBusy(false);
  };

  return (
    <div className="admin-editor" onClick={onClose}>
      <form className="admin-panel" onClick={(e) => e.stopPropagation()} onSubmit={save}>
        <div className="admin-panel-head">
          <h2>{isNew ? "Platillo nuevo" : form.nombre || "Editar"}</h2>
          <button type="button" className="admin-btn ghost" onClick={onClose}>Cerrar</button>
        </div>
        <div className="admin-fields">
          {form.imagen_url ? (
            <>
              <PhotoPositioner
                src={form.imagen_url}
                x={Number.isFinite(Number(form.imagen_x)) ? Number(form.imagen_x) : 50}
                y={Number.isFinite(Number(form.imagen_y)) ? Number(form.imagen_y) : 50}
                onChange={(nx, ny) => setForm((f) => ({ ...f, imagen_x: nx, imagen_y: ny }))}
              />
              <label className="admin-photo-change">
                {uploading ? "Subiendo foto…" : "Cambiar foto"}
                <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
              </label>
            </>
          ) : (
            <label className="admin-photo">
              <span>{uploading ? "Subiendo foto…" : "Toca para subir una foto"}</span>
              <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          )}
          {!showLink ? (
            <button type="button" className="admin-more" style={{ marginTop: 0 }} onClick={() => setShowLink(true)}>
              Prefiero pegar un link
            </button>
          ) : (
            <div className="admin-field">
              <label>Link de la foto</label>
              <input
                placeholder="https://…"
                value={form.imagen_url || ""}
                onChange={(e) => {
                  const pos = parseFotoPos(e.target.value);
                  setForm((f) => ({ ...f, imagen_url: pos.src, imagen_x: pos.x, imagen_y: pos.y }));
                }}
              />
            </div>
          )}

          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Nombre</label>
              <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Precio</label>
              <input type="number" inputMode="numeric" step="1" min="0" value={form.precio} onChange={(e) => set("precio", e.target.value)} />
            </div>
          </div>

          <div className="admin-field">
            <label>Descripción</label>
            <textarea rows={3} value={form.descripcion || ""} onChange={(e) => set("descripcion", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Categoría</label>
            <div className="admin-chips">
              {categorias.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`admin-chip ${form.categoria_id === c.id ? "on" : ""}`}
                  onClick={() => set("categoria_id", c.id)}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-field">
            <label>Sello (opcional)</label>
            <input placeholder="NUEVO, CHEF'S PICK, PICANTE…" value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} />
          </div>

          <div className="admin-field">
            <label>Nombre en japonés (opcional)</label>
            <input value={form.nombre_jp || ""} onChange={(e) => set("nombre_jp", e.target.value)} />
          </div>

          <Switch
            on={!!form.disponible}
            onChange={(v) => set("disponible", v)}
            label="Se puede pedir"
            hint="Si lo apagas, no sale en la web"
          />
          <Switch
            on={!!form.en_feed}
            onChange={(v) => set("en_feed", v)}
            label="Sale en favoritos"
            hint="La fila de la home, junto a Philadelphia"
          />
          {form.en_feed && (
            <>
              <Switch
                on={!!form.destacado}
                onChange={(v) => set("destacado", v)}
                label="Card grande"
                hint="La pieza principal del día"
              />
              <Switch
                on={!!form.wide}
                onChange={(v) => set("wide", v)}
                label="A lo ancho"
                hint="Como el Mogu Mogu, todo el renglón"
              />
            </>
          )}
        </div>
        <div className="admin-panel-foot">
          <button className="admin-btn" disabled={busy || uploading}>{busy ? "Guardando…" : "Guardar"}</button>
          {!isNew && (
            <button type="button" className="admin-btn danger" disabled={busy} onClick={remove}>Eliminar platillo</button>
          )}
        </div>
      </form>
    </div>
  );
}

function FeedAdmin({ platillos, onReload, setError }) {
  const feed = [...platillos]
    .filter((p) => p.en_feed)
    .sort((a, b) => (a.feed_orden ?? 0) - (b.feed_orden ?? 0));

  const move = async (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= feed.length) return;
    const a = feed[index];
    const b = feed[next];
    const { error: e1 } = await supabase.from("platillos").update({ feed_orden: b.feed_orden ?? next }).eq("id", a.id);
    const { error: e2 } = await supabase.from("platillos").update({ feed_orden: a.feed_orden ?? index }).eq("id", b.id);
    if (e1 || e2) setError(friendlyError(e1?.message || e2?.message));
    else await onReload();
  };

  const toggle = async (p, field) => {
    const patch = { [field]: !p[field] };
    if (field === "destacado" && patch.destacado) {
      await supabase.from("platillos").update({ destacado: false }).neq("id", p.id);
    }
    if (field === "wide" && patch.wide) {
      await supabase.from("platillos").update({ wide: false }).neq("id", p.id);
    }
    const { error } = await supabase.from("platillos").update(patch).eq("id", p.id);
    if (error) setError(friendlyError(error.message));
    else await onReload();
  };

  return (
    <>
      <p className="admin-lead">
        Esto es lo que sale en la home. El de arriba es el primero. Ideal: 6 platillos, uno grande y uno a lo ancho.
      </p>
      {feed.length > 6 && (
        <div className="admin-alert">Hay más de 6. En la web se ven los primeros.</div>
      )}
      <div className="admin-feed">
        {feed.map((p, i) => (
          <div key={p.id} className={`admin-feed-card ${p.destacado ? "feat" : ""} ${p.wide ? "wide" : ""}`}>
            <FotoThumb url={p.imagen_url} />
            <div className="admin-feed-body">
              <h3>{p.nombre}</h3>
              <p>{p.badge || "Sin sello"} · {formatPrecio(p.precio)}</p>
              <div className="admin-feed-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>Subir</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === feed.length - 1}>Bajar</button>
                <button type="button" className={p.destacado ? "hot" : ""} onClick={() => toggle(p, "destacado")}>
                  {p.destacado ? "Es el grande" : "Hacer grande"}
                </button>
                <button type="button" className={p.wide ? "on" : ""} onClick={() => toggle(p, "wide")}>
                  {p.wide ? "Es a lo ancho" : "A lo ancho"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {feed.length === 0 && (
        <p className="admin-lead">Todavía no hay favoritos. Ábrelo en Menú y activa “Sale en favoritos”.</p>
      )}
    </>
  );
}

function GaleriaAdmin({ setError, setOk }) {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const persist = async (next, okMsg) => {
    setBusy(true);
    setError("");
    try {
      const saved = await saveGaleria(next);
      setFotos(saved);
      if (okMsg) setOk(okMsg);
    } catch (e) {
      setError(friendlyError(e.message));
    }
    setBusy(false);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { fotos: next } = await fetchGaleria();
        if (alive) setFotos(next);
      } catch (e) {
        if (alive) setError(friendlyError(e.message));
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [setError]);

  const uploadAt = async (file, index) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const src = await uploadGaleriaFoto(file);
      if (index == null) {
        await persist([...fotos, { src, alt: "Roll Maki Nori", span: 1 }], "Foto agregada.");
      } else {
        const next = fotos.map((f, i) => (i === index ? { ...f, src } : f));
        await persist(next, "Foto cambiada.");
      }
    } catch (e) {
      setError(friendlyError(e.message));
      setBusy(false);
    }
  };

  const move = (index, dir) => {
    const nextI = index + dir;
    if (nextI < 0 || nextI >= fotos.length || busy) return;
    const next = fotos.slice();
    const [item] = next.splice(index, 1);
    next.splice(nextI, 0, item);
    persist(next);
  };

  const setAlt = (index, alt) => {
    setFotos((list) => list.map((f, i) => (i === index ? { ...f, alt } : f)));
  };

  const toggleSpan = (index) => {
    const next = fotos.map((f, i) => (i === index ? { ...f, span: f.span === 2 ? 1 : 2 } : f));
    persist(next);
  };

  const remove = (index) => {
    if (!confirm("¿Quitar esta foto de Nuestros rolls?")) return;
    persist(fotos.filter((_, i) => i !== index), "Foto quitada.");
  };

  return (
    <>
      <p className="admin-lead">
        Estas fotos salen en “Nuestros rolls”. Toca una para cambiarla, ponle nombre y si quieres que se vea grande.
      </p>
      <label className={`admin-photo-change ${busy ? "is-busy" : ""}`} style={{ marginBottom: 14 }}>
        {busy ? "Subiendo…" : "Agregar foto"}
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            uploadAt(file, null);
          }}
        />
      </label>

      {loading && <p className="admin-lead">Cargando fotos…</p>}

      <div className="admin-list">
        {fotos.map((f, i) => (
          <div key={`${f.src}-${i}`} className="admin-row-wrap">
            <div className="admin-row admin-galeria-row">
              <label className="admin-galeria-thumb">
                <FotoThumb url={f.src} />
                <span>{busy ? "…" : "Cambiar"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    uploadAt(file, i);
                  }}
                />
              </label>
              <div>
                <div className="admin-field" style={{ margin: 0 }}>
                  <label>Nombre en la foto</label>
                  <input
                    value={f.alt || ""}
                    onChange={(e) => setAlt(i, e.target.value)}
                    onBlur={(e) => {
                      const alt = e.target.value;
                      persist(fotos.map((row, j) => (j === i ? { ...row, alt } : row)));
                    }}
                    placeholder="Philadelphia Roll"
                  />
                </div>
                <div className="admin-feed-actions" style={{ marginTop: 8 }}>
                  <button type="button" className={f.span === 2 ? "on" : ""} onClick={() => toggleSpan(i)} disabled={busy}>
                    {f.span === 2 ? "Es grande" : "Hacer grande"}
                  </button>
                  <button type="button" className="hot" onClick={() => remove(i)} disabled={busy}>Quitar</button>
                </div>
              </div>
            </div>
            <div className="admin-row-move">
              <button type="button" aria-label="Subir" disabled={busy || i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" aria-label="Bajar" disabled={busy || i === fotos.length - 1} onClick={() => move(i, 1)}>↓</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
