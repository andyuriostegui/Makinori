import { useState, useEffect } from "react";
import { C } from "./tokens";
import { useCarritoCtx } from "./Carrito";

const NAV_LINKS = [
  { href: "#",          label: "Inicio"    },
  { href: "#productos", label: "Favoritos" },
  { href: "#menu",      label: "Menú"      },
  { href: "#reserva",   label: "Reserva"   },
  { href: "#ubicacion", label: "Ubicación" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen: setCarritoOpen } = useCarritoCtx();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = () => setOpen(false);
  const dark = open || scrolled;
  const bg = dark ? "rgba(26,26,24,0.96)" : "rgba(245,240,232,0.0)";
  const textColor = dark ? C.cream : C.ink;
  const mutedColor = dark ? "rgba(245,240,232,0.45)" : C.muted;

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "14px 24px",
        background: bg,
        backdropFilter: dark ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(245,240,232,0.08)" : "none",
        transition: "background 0.35s, box-shadow 0.35s",
        fontFamily: "DM Sans, sans-serif",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `2px solid ${dark ? C.coral : C.ink}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.35s",
            }}>
              <span style={{ fontFamily: "Noto Serif JP, serif", fontSize: 13, fontWeight: 700, color: dark ? C.coral : C.ink, transition: "color 0.35s" }}>海</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", color: textColor, lineHeight: 1, margin: 0, transition: "color 0.35s" }}>Maki Nori</p>
              <p style={{ fontFamily: "Noto Serif JP, serif", fontSize: 9, color: mutedColor, letterSpacing: "0.2em", margin: 0, transition: "color 0.35s" }}>巻きのり · IGUALA</p>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="nav-desktop" style={{ alignItems: "center", gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map(l => <NavLink key={l.href} href={l.href} textColor={textColor}>{l.label}</NavLink>)}
            {count > 0 && (
              <li style={{ listStyle: "none" }}>
                <button onClick={() => setCarritoOpen(true)} style={{
                  background: "transparent",
                  border: `1.5px solid ${dark ? "rgba(245,240,232,0.3)" : C.border}`,
                  color: textColor, padding: "6px 14px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  🛍️
                  <span style={{ background: C.coral, color: C.cream, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 900 }}>{count}</span>
                </button>
              </li>
            )}
            <li style={{ listStyle: "none" }}>
              <a href="#reserva" style={{
                background: C.coral, color: C.cream,
                padding: "8px 20px", borderRadius: 20, fontSize: 12,
                fontWeight: 700, textDecoration: "none",
              }}>Hacer Reserva</a>
            </li>
          </ul>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setOpen(o => !o)}
            style={{ flexDirection: "column", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 2,
                background: textColor, borderRadius: 2,
                transition: "all 0.25s",
                transform: open
                  ? i === 0 ? "translateY(7px) rotate(45deg)"
                  : i === 2 ? "translateY(-7px) rotate(-45deg)"
                  : "scaleX(0)"
                  : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}/>
            ))}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div style={{
            marginTop: 12, paddingTop: 16, paddingBottom: 20,
            borderTop: "1px solid rgba(245,240,232,0.1)",
          }}>
            <ul style={{ listStyle: "none", margin: 0, padding: "0 8px", display: "flex", flexDirection: "column", gap: 18 }}>
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={close} style={{ fontSize: 15, fontWeight: 600, textDecoration: "none", color: C.cream }}>{l.label}</a>
                </li>
              ))}
              <li style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="#reserva" onClick={close} style={{
                  background: C.coral, color: C.cream,
                  padding: "10px 24px", borderRadius: 20,
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                }}>Hacer Reserva</a>
                {count > 0 && (
                  <button onClick={() => { setCarritoOpen(true); close(); }} style={{
                    background: "rgba(245,240,232,0.15)", color: C.cream, border: "none",
                    padding: "10px 16px", borderRadius: 20, fontSize: 13,
                    fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                  }}>🛍️ Pedido ({count})</button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({ href, children, textColor }) {
  const [hov, setHov] = useState(false);
  return (
    <li style={{ listStyle: "none" }}>
      <a href={href}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ color: hov ? C.coral : textColor, textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.2s" }}
      >{children}</a>
    </li>
  );
}