"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/types", label: "Types", icon: "◉" },
  { href: "/admin/orders", label: "Orders", icon: "◎" },
  { href: "/admin/merchant-orders", label: "Merchant Orders", icon: "◇" },
  { href: "/admin/other-charges", label: "Other Charges", icon: "◆" },
  { href: "/admin/gold-rate", label: "Gold Rate", icon: "◈" },
  { href: "/admin/analytics", label: "Analytics", icon: "◉" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebarContent = (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "#111111",
        borderRight: "1px solid rgba(201,168,76,0.15)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.75rem 1.5rem 1.5rem",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "#C9A84C",
            letterSpacing: "0.02em",
          }}
        >
          Lumière Admin
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
        {NAV_LINKS.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 1.5rem",
                color: active ? "#C9A84C" : "#A0A0A0",
                backgroundColor: active ? "rgba(201,168,76,0.08)" : "transparent",
                borderLeft: active ? "2px solid #C9A84C" : "2px solid transparent",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: active ? 500 : 400,
                transition: "all 0.15s ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "#E8E8E8";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "#A0A0A0";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "1rem", opacity: 0.8 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            width: "100%",
            padding: "0.625rem 1rem",
            backgroundColor: "transparent",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "2px",
            color: "#A0A0A0",
            fontSize: "0.8125rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C9A84C";
            e.currentTarget.style.color = "#C9A84C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
            e.currentTarget.style.color = "#A0A0A0";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 100,
          backgroundColor: "#111111",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "2px",
          color: "#C9A84C",
          padding: "0.5rem 0.75rem",
          cursor: "pointer",
          fontSize: "1.25rem",
        }}
        className="admin-mobile-toggle"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">{sidebarContent}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
          }}
        >
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{ position: "relative", zIndex: 51 }}>{sidebarContent}</div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
