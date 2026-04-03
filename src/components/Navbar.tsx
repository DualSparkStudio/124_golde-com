'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Wishlist", href: "/wishlist" },
];

export default function Navbar() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function fetchWishlistCount() {
      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.count ?? data.items?.length ?? 0);
        }
      } catch {
        // ignore
      }
    }
    fetchWishlistCount();
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'background-color 0.4s, box-shadow 0.4s, border-color 0.4s',
        fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#C9A84C',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
        >
          Lumière
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: scrolled ? '#0A0A0A' : '#fff',
                textDecoration: 'none',
                fontSize: '0.875rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#C9A84C';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = scrolled ? '#0A0A0A' : '#fff';
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: Search + Wishlist + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SearchBar compact />

          {/* Wishlist */}
          <Link
            href="/wishlist"
            style={{
              position: 'relative',
              color: '#0A0A0A',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Wishlist"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#C9A84C',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
            className="hamburger-btn"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: '#FFF8F0',
            borderTop: '1px solid rgba(201,168,76,0.15)',
            padding: '16px 24px 24px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                color: '#0A0A0A',
                textDecoration: 'none',
                fontSize: '1rem',
                letterSpacing: '0.04em',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
              }}
            >
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
