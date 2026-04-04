"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/products", label: "Products", icon: "💎" },
  { href: "/admin/types", label: "Jewelry Types", icon: "🏷️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/merchant-orders", label: "Merchant Orders", icon: "🏪" },
  { href: "/admin/appointments", label: "Appointments", icon: "📅" },
  { href: "/admin/offers", label: "Offers & Discounts", icon: "🎁" },
  { href: "/admin/other-charges", label: "Other Charges", icon: "⚙️" },
  { href: "/admin/gold-rate", label: "Gold Rate", icon: "✦" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
  { href: "/admin/maintenance", label: "Maintenance", icon: "🔧" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
  { href: "/admin/test-orders", label: "Test Orders", icon: "🧪" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <div style={{
      width: "240px", minWidth: "240px", backgroundColor: "#fff",
      borderRight: "1px solid #E8E8E8", display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
      boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #B8860B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>✦</div>
          <div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1rem", fontWeight: 700, color: "#0A0A0A", lineHeight: 1.2 }}>Lumière</div>
            <div style={{ fontSize: "0.65rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.65rem", color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, padding: "0 0.75rem", marginBottom: "8px" }}>Main Menu</div>
        {NAV.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "0.6rem 0.75rem", borderRadius: "8px", marginBottom: "2px",
              color: active ? "#B8860B" : "#555",
              backgroundColor: active ? "rgba(201,168,76,0.1)" : "transparent",
              textDecoration: "none", fontSize: "0.875rem",
              fontWeight: active ? 600 : 400,
              transition: "all 0.15s",
              border: active ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
            }}
            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "#F8F9FA"; e.currentTarget.style.color = "#0A0A0A"; } }}
            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#555"; } }}
            >
              <span style={{ fontSize: "1rem", width: "20px", textAlign: "center" }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid #F0F0F0" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.6rem 0.75rem", borderRadius: "8px", color: "#555", textDecoration: "none", fontSize: "0.875rem", marginBottom: "4px" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F8F9FA"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
          <span>🌐</span> View Store
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/admin/login" })} style={{
          width: "100%", padding: "0.6rem 0.75rem", backgroundColor: "transparent",
          border: "1px solid #E8E8E8", borderRadius: "8px", color: "#e05252",
          fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(224,82,82,0.06)"; e.currentTarget.style.borderColor = "rgba(224,82,82,0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#E8E8E8"; }}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="admin-mobile-toggle" aria-label="Toggle sidebar"
        style={{ display: "none", position: "fixed", top: "1rem", left: "1rem", zIndex: 100, backgroundColor: "#fff", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "0.5rem 0.75rem", cursor: "pointer", fontSize: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        ☰
      </button>
      <div className="admin-sidebar-desktop">{sidebar}</div>
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: "relative", zIndex: 51 }}>{sidebar}</div>
        </div>
      )}
      <style>{`@media(max-width:768px){.admin-sidebar-desktop{display:none}.admin-mobile-toggle{display:block!important}}`}</style>
    </>
  );
}
