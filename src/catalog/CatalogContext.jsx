import { createContext, useContext, useEffect, useState } from "react";
import { fetchCatalog, localCatalog } from "../lib/catalog";

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
