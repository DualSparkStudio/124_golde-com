"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useStore } from "@/context/StoreContext";
import { db } from "@/lib/mockDb";
import type { MockProduct } from "@/lib/mockDb";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, addToCart } = useStore();
  const [products, setProducts] = useState<MockProduct[]>([]);

  useEffect(() => {
    // Load products from mockDb on client
    const all = db.products.getAll();
    setProducts(all.filter((p) => wishlistIds.includes(p.id) && p.status === "active"));
  }, [wishlistIds]);

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ paddingTop: "160px", paddingBottom: "80px", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80" alt="" aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))", pointerEvents: "none" }} />
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
          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", backgroundColor: "rgba(201,168,76,0.04)" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.8rem", color: "#0A0A0A", margin: "0 0 14px" }}>Your wishlist is empty</h2>
              <p style={{ color: "#888", fontSize: "1rem", margin: "0 0 36px", lineHeight: 1.7 }}>Discover pieces you love and save them here for later.</p>
              <Link href="/shop" style={{ display: "inline-block", padding: "16px 48px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px" }}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                <p style={{ color: "#555", fontSize: "0.95rem", margin: 0 }}>
                  <span style={{ color: "#0A0A0A", fontWeight: 600 }}>{products.length}</span> {products.length === 1 ? "piece" : "pieces"} saved
                </p>
                <Link href="/shop" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>
                  Continue Shopping →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "28px" }}>
                {products.map((product) => {
                  const img = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? null;
                  const price = product.discountPrice ?? product.salePrice;
                  return (
                    <div key={product.id} style={{ backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F5F5F5" }}>
                      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#FAF8F5" }}>
                        {img ? (
                          img.startsWith("data:") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <Image src={img} alt={product.name} fill style={{ objectFit: "cover" }} sizes="300px" />
                          )
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", fontSize: "3rem", opacity: 0.3 }}>✦</div>
                        )}
                        <button onClick={() => toggleWishlist(product.id)} style={{ position: "absolute", top: "12px", right: "12px", background: "#C9A84C", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <p style={{ color: "#999", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>{product.purity} · {product.weight}g</p>
                        <Link href={`/${product.category}/${product.slug}`} style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "0.95rem", fontWeight: 600, color: "#0A0A0A", textDecoration: "none", display: "block", marginBottom: "12px" }}>
                          {product.name}
                        </Link>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {price && (
                            <button onClick={() => addToCart({ productId: product.id, name: product.name, price, image: img ?? "", weight: product.weight, purity: product.purity, quantity: 1, slug: product.slug, category: product.category })}
                              style={{ flex: 1, padding: "10px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
                              Add to Cart · ₹{price.toLocaleString("en-IN")}
                            </button>
                          )}
                          <Link href={`/${product.category}/${product.slug}`} style={{ padding: "10px 14px", border: "1px solid #E8E8E8", borderRadius: "6px", color: "#555", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center" }}>
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
