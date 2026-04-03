"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#0A0A0A", color: "rgba(255,248,240,0.6)", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* CTA Banner */}
      <div style={{ backgroundColor: "#1A1A1A", borderTop: "1px solid rgba(201,168,76,0.2)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "48px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FFF8F0", margin: "0 0 12px" }}>
          Book Your Favourite Jewelry Today
        </h2>
        <p style={{ color: "rgba(255,248,240,0.6)", margin: "0 0 28px", fontSize: "0.95rem" }}>
          Reserve online and visit our store for a personalised experience
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" style={{ padding: "12px 32px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "2px" }}>
            Browse Collection
          </Link>
          <Link href="/about" style={{ padding: "12px 32px", background: "transparent", color: "#FFF8F0", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.2)" }}>
            Contact Us
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
        {/* Brand */}
        <div>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.4rem", color: "#C9A84C", margin: "0 0 16px" }}>Lumière Jewels</h3>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 20px", color: "rgba(255,248,240,0.55)" }}>
            Your trusted destination for premium gold and silver jewelry. Quality craftsmanship, timeless designs.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {["📘", "📸", "🐦"].map((icon, i) => (
              <div key={i} style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", cursor: "pointer" }}>{icon}</div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#FFF8F0", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>Quick Links</h4>
          {[["Home", "/"], ["Shop", "/shop"], ["Wishlist", "/wishlist"], ["About Us", "/about"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ display: "block", color: "rgba(255,248,240,0.55)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "10px", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,248,240,0.55)")}>
              {label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: "#FFF8F0", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>Categories</h4>
          {[["Gold Jewelry", "/shop?category=gold"], ["Silver Jewelry", "/shop?category=silver"], ["Necklaces", "/shop?typeId=type-2"], ["Rings", "/shop?typeId=type-3"], ["Earrings", "/shop?typeId=type-4"], ["Bangles", "/shop?typeId=type-7"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ display: "block", color: "rgba(255,248,240,0.55)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "10px" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,248,240,0.55)")}>
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "#FFF8F0", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px", fontWeight: 600 }}>Contact Us</h4>
          {[
            ["📍", "123 Jewelry Street, Gold District"],
            ["📞", "+91 98765 43210"],
            ["✉️", "info@lumierejewels.com"],
            ["🕐", "Mon–Sat: 10AM – 8PM"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.9rem", marginTop: "1px" }}>{icon}</span>
              <span style={{ color: "rgba(255,248,240,0.55)", fontSize: "0.875rem", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", maxWidth: "1280px", margin: "0 auto" }}>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,248,240,0.4)" }}>
          © {new Date().getFullYear()} Lumière Jewels. All rights reserved. BIS Hallmark Certified.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy Policy", "Terms", "Shipping", "Returns"].map((label) => (
            <span key={label} style={{ color: "rgba(255,248,240,0.4)", fontSize: "0.8rem", cursor: "pointer" }}>{label}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
