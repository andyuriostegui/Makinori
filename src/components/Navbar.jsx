import { useState, useEffect } from "react";
import { C, FONT } from "./tokens";
import { useCarritoCtx } from "./Carrito";
import { ShoppingBag01Icon, Menu01Icon, Cancel01Icon } from "hugeicons-react";

const NAV_LINKS = [
  { href: "#",          label: "Inicio"    },
  { href: "#productos", label: "Favoritos" },
  { href: "#menu",      label: "Menú"      },
  { href: "#galeria",   label: "Galería"   },
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
  const bg = dark ? "rgba(22,19,17,0.94)" : "transparent";
  const textColor = C.cream;
  const mutedColor = "rgba(244,239,230,0.5)";

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
        padding: "12px 24px",
        background: bg,
        backdropFilter: dark ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(196,163,106,0.18)" : "none",
        transition: "background 0.35s, box-shadow 0.35s",
        fontFamily: FONT.sans,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1px solid ${C.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: FONT.jp, fontSize: 13, fontWeight: 700, color: C.gold }}>海</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: textColor, lineHeight: 1, margin: 0, fontFamily: FONT.serif }}>Maki Nori</p>
              <p style={{ fontFamily: FONT.jp, fontSize: 9, color: mutedColor, letterSpacing: "0.22em", margin: "3px 0 0" }}>巻きのり · IGUALA</p>
            </div>
          </a>

          <ul className="nav-desktop" style={{ alignItems: "center", gap: 26, listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map(l => <NavLink key={l.href + l.label} href={l.href} textColor={textColor}>{l.label}</NavLink>)}
            {count > 0 && (
              <li style={{ listStyle: "none" }}>
                <button onClick={() => setCarritoOpen(true)} style={{
                  background: "transparent",
                  border: `1px solid rgba(244,239,230,0.28)`,
                  color: textColor, padding: "6px 14px", borderRadius: 2,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: FONT.sans,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <ShoppingBag01Icon size={14} color={textColor} />
                  <span style={{ background: C.shu, color: C.cream, borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{count}</span>
                </button>
              </li>
            )}
            <li style={{ listStyle: "none" }}>
              <a href="#menu" style={{
                background: C.teal, color: C.cream,
                padding: "8px 18px", borderRadius: 2, fontSize: 11,
                fontWeight: 700, textDecoration: "none", letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}>Ver Menú</a>
            </li>
          </ul>

          <button className="nav-hamburger" onClick={() => setOpen(o => !o)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {open
              ? <Cancel01Icon size={24} color={textColor} />
              : <Menu01Icon size={24} color={textColor} />
            }
          </button>
        </div>

        {open && (
          <div style={{
            marginTop: 12, paddingTop: 16, paddingBottom: 20,
            borderTop: "1px solid rgba(244,239,230,0.1)",
          }}>
            <ul style={{ listStyle: "none", margin: 0, padding: "0 8px", display: "flex", flexDirection: "column", gap: 18 }}>
              {NAV_LINKS.map(l => (
                <li key={l.href + l.label}>
                  <a href={l.href} onClick={close} style={{ fontSize: 16, fontWeight: 500, textDecoration: "none", color: C.cream, fontFamily: FONT.serif }}>{l.label}</a>
                </li>
              ))}
              <li style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="#menu" onClick={close} style={{
                  background: C.teal, color: C.cream,
                  padding: "10px 24px", borderRadius: 2,
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>Ver Menú</a>
                {count > 0 && (
                  <button onClick={() => { setCarritoOpen(true); close(); }} style={{
                    background: "rgba(244,239,230,0.12)", color: C.cream, border: "none",
                    padding: "10px 16px", borderRadius: 2, fontSize: 13,
                    fontWeight: 700, cursor: "pointer", fontFamily: FONT.sans,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <ShoppingBag01Icon size={14} color={C.cream} />
                    Pedido ({count})
                  </button>
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
        style={{
          color: hov ? C.gold : textColor, textDecoration: "none",
          fontSize: 12, fontWeight: 500, letterSpacing: "0.14em",
          textTransform: "uppercase", transition: "color 0.2s",
        }}
      >{children}</a>
    </li>
  );
}
