import { useEffect, useState } from "react";
import { friendlyAuthError } from "../lib/clientes";
import { etiquetaCorta, fetchResumenVisitas, isMissingVisitas } from "../lib/visitas";

export default function VisitasAdmin({ setError }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const next = await fetchResumenVisitas(14);
        if (!alive) return;
        setData(next);
        setMissing(false);
        setError("");
      } catch (e) {
        if (!alive) return;
        if (isMissingVisitas(e)) {
          setMissing(true);
          setData(null);
        } else {
          setError(friendlyAuthError(e.message));
        }
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [setError]);

  if (missing) {
    return (
      <p className="admin-lead">
        Para ver visitas hay que correr el SQL nuevo en Supabase (archivo supabase/visitas.sql).
        Hasta entonces el menú sigue igual.
      </p>
    );
  }

  const max = Math.max(1, ...(data?.serie || []).map((d) => d.personas));

  return (
    <>
      <p className="admin-lead">
        Cuánta gente abre la página. Si recargan el mismo día, cuentan como una sola persona.
      </p>

      {loading && <p className="admin-lead">Cargando visitas…</p>}

      {!loading && data && (
        <>
          <div className="admin-visitas-kpis">
            <article className="admin-visitas-kpi">
              <p>Hoy</p>
              <strong>{data.hoyPersonas}</strong>
              <span>
                {data.hoyPersonas === 1 ? "persona" : "personas"}
                {" · "}
                {data.hoyEntradas} {data.hoyEntradas === 1 ? "entrada" : "entradas"}
              </span>
            </article>
            <article className="admin-visitas-kpi">
              <p>Esta semana</p>
              <strong>{data.semanaPersonas}</strong>
              <span>
                {data.semanaPersonas === 1 ? "persona" : "personas"}
                {" · "}
                {data.semanaEntradas} {data.semanaEntradas === 1 ? "entrada" : "entradas"}
              </span>
            </article>
          </div>

          <div className="admin-visitas-chart">
            <h3>Últimos 7 días</h3>
            <div className="admin-visitas-bars" role="img" aria-label="Personas por día">
              {data.serie.map((d) => {
                const today = d.dia === data.hoy;
                return (
                  <div key={d.dia} className={`admin-visitas-col ${today ? "today" : ""}`}>
                    <b>{d.personas}</b>
                    <div className="admin-visitas-track">
                      <span className="admin-visitas-spacer" style={{ flex: max - d.personas }} />
                      <i
                        className="admin-visitas-bar"
                        style={{ flex: Math.max(d.personas, 0.04) }}
                        title={`${etiquetaCorta(d.dia)}: ${d.personas} personas`}
                      />
                    </div>
                    <small>{etiquetaCorta(d.dia)}</small>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
