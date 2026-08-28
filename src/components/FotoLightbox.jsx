import { useEffect, useRef } from "react";
import { C, FONT } from "./tokens";

export default function FotoLightbox({ fotos, index, onClose, onIndex }) {
  const list = (fotos || []).filter((f) => f?.src);
  const i = Math.max(0, Math.min(index ?? 0, list.length - 1));
  const current = list[i];
  const startX = useRef(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && list.length > 1) onIndex((i - 1 + list.length) % list.length);
      if (e.key === "ArrowRight" && list.length > 1) onIndex((i + 1) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [i, list.length, onClose, onIndex]);

  if (!current) return null;

  const go = (dir) => {
    if (list.length < 2) return;
    onIndex((i + dir + list.length) % list.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || "Foto"}
      onClick={onClose}
      onTouchStart={(e) => { startX.current = e.changedTouches[0].clientX; }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx > 56) go(-1);
        else if (dx < -56) go(1);
      }}
      style={{
        position: "fixed", inset: 0, zIndex: 2200,
        background: "rgba(11,44,50,0.94)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "72px 16px 28px",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          background: "transparent", border: `1px solid ${C.gold}`,
          color: C.gold, width: 44, height: 44, borderRadius: "50%",
          fontSize: 18, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
        }}
      >
        &#x2715;
      </button>

      {list.length > 1 && (
        <>
          <NavBtn side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
          <NavBtn side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
        </>
      )}

      <div
        style={{ position: "relative", maxWidth: "94vw", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt || ""}
          draggable={false}
          style={{
            maxWidth: "94vw",
            maxHeight: "78vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
            border: `1px solid ${C.gold}`,
            background: C.navy,
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
        />
        {(current.alt || list.length > 1) && (
          <p style={{
            textAlign: "center", margin: "14px 0 0",
            fontFamily: FONT.serif, fontSize: 16, color: C.cream, letterSpacing: "0.08em",
          }}>
            {current.alt}
            {list.length > 1 && (
              <span style={{
                display: "block", marginTop: 4,
                fontFamily: FONT.sans, fontSize: 12, color: "rgba(244,239,230,0.55)",
              }}>
                {i + 1} / {list.length}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function NavBtn({ side, onClick }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [side]: 8,
        transform: "translateY(-50%)",
        width: 44, height: 44, borderRadius: "50%",
        border: `1px solid ${C.gold}`,
        background: "rgba(11,44,50,0.55)",
        color: C.gold, fontSize: 22, cursor: "pointer",
        zIndex: 2,
      }}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
