"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter";
import type { CustomerProduct } from "@/types";

export default function WishlistPage() {
  const [items, setItems] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setItems((d.items ?? []).map((i: { product: CustomerProduct }) => i.product).filter(Boolean)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleWishlistChange(productId: string, inWishlist: boolean) {
    if (!inWishlist) setItems((prev) => prev.filter((p) => p.id !== productId));
  }

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <div style={{ paddingTop: "160px", paddingBottom: "80px", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Your Collection</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#FFF8F0", margin: 0 }}>My Wishlist</h1>
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px 100px" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
              {[1,2,3,4].map((i) => (
                <div key={i} style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <div style={{ aspectRatio: "1/1", backgroundColor: "#f5f5f5" }} />
                  <div style={{ padding: "16px", backgroundColor: "#fff" }}>
                    <div style={{ height: "16px", backgroundColor: "#f5f5f5", borderRadius: "4px", marginBottom: "8px" }} />
                    <div style={{ height: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px", width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", backgroundColor: "rgba(201,168,76,0.04)" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.8rem", color: "#0A0A0A", margin: "0 0 14px" }}>Your wishlist is empty</h2>
              <p style={{ color: "#888", fontSize: "1rem", margin: "0 0 36px", lineHeight: 1.7 }}>Discover pieces you love and save them here for later.</p>
              <Link href="/shop" style={{ display: "inline-block", padding: "16px 48px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px" }}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                <p style={{ color: "#555", fontSize: "0.95rem", margin: 0 }}>
                  <span style={{ color: "#0A0A0A", fontWeight: 600 }}>{items.length}</span> {items.length === 1 ? "piece" : "pieces"} saved
                </p>
                <Link href="/shop" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>
                  Continue Shopping →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} inWishlist={true} onWishlistChange={handleWishlistChange} />
                ))}
              </div>
            </>
          )}
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
