import { createContext, useContext, useEffect, useState } from "react";
import { fetchCatalog, fetchPlatillo, localCatalog, ofertaFromPlatillo } from "../lib/catalog";

const CatalogCtx = createContext(null);

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(() => localCatalog());

  useEffect(() => {
    let alive = true;
    fetchCatalog().then((next) => {
      if (alive) setCatalog(next);
    });
    return () => { alive = false; };
  }, []);

  return (
    <CatalogCtx.Provider value={catalog}>
      {children}
    </CatalogCtx.Provider>
  );
}

export function useCatalog() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(CatalogCtx);
  return ctx || localCatalog();
}

export function useOferta(perfil) { // eslint-disable-line react-refresh/only-export-components
  const catalog = useCatalog();
  const id = perfil?.regalo_id || null;
  const fromCat = (catalog.platillos || []).find((p) => p.id === id) || null;
  const [extra, setExtra] = useState(null);
  const fromCatId = fromCat?.id || null;

  useEffect(() => {
    if (!id || fromCatId) return undefined;
    let alive = true;
    fetchPlatillo(id).then((p) => {
      if (alive) setExtra(p);
    });
    return () => { alive = false; };
  }, [id, fromCatId]);

  const platillo = fromCat || (extra?.id === id ? extra : null);
  return id ? ofertaFromPlatillo(platillo) : null;
}
