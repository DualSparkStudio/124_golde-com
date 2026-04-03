"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Products", href: "/shop" },
  { label: "Gallery", href: "/gallery" },
  { label: "Certificates", href: "/certificates" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { wishlistCount, cartCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "#0A0A0A" : "#fff";
  const bg = scrolled ? "rgba(255,255,255,0.97)" : "transparent";
  const shadow = scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none";
  const border = scrolled ? "1px solid rgba(0,0,0,0.06)" : "none";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: bg, borderBottom: border, boxShadow: shadow,
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.4s ease",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        {/* Logo */}
        <Link href="/" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.5rem", fontWeight: 700, color: "#C9A84C", textDecoration: "none", letterSpacing: "0.02em" }}>
          Lumière
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }} className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} style={{ color: textColor, textDecoration: "none", fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = "#C9A84C"; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = textColor; }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Wishlist */}
          <Link href="/wishlist" aria-label="Wishlist" style={{ position: "relative", color: textColor, textDecoration: "none", display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#0A0A0A" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#C9A84C", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" aria-label="Cart" style={{ position: "relative", color: textColor, textDecoration: "none", display: "flex", alignItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#0A0A0A" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#C9A84C", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="hamburger-btn"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#0A0A0A" : "#fff"} strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: "#fff", borderTop: "1px solid #F0F0F0", padding: "16px 32px 24px" }}>
          {[...NAV_LINKS, { label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 0", color: "#0A0A0A", textDecoration: "none", fontSize: "1rem", borderBottom: "1px solid #F5F5F5" }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
