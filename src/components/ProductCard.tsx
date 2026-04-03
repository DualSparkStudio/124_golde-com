"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { CustomerProduct } from "@/types";

interface ProductCardProps {
  product: CustomerProduct;
  onWishlistChange?: (productId: string, inWishlist: boolean) => void;
  inWishlist?: boolean;
}

export default function ProductCard({ product, onWishlistChange, inWishlist = false }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(inWishlist);
  const [hovered, setHovered] = useState(false);

  const imageUrl = product.primaryImage?.url ?? null;
  const href = `/${product.category}/${product.slug}`;
  const displayPrice = product.discountPrice ?? product.salePrice;
  const hasDiscount = product.discountPrice != null && product.salePrice != null;

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const method = wishlisted ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
      if (res.ok) { setWishlisted(!wishlisted); onWishlistChange?.(product.id, !wishlisted); }
    } catch { /* ignore */ }
  }

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#fff",
          borderRadius: "6px",
          overflow: "hidden",
          boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          cursor: "pointer",
        }}
      >
        {/* Image container */}
        <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#FAF0E6" }}>
          {imageUrl ? (
            imageUrl.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s ease" }} />
            ) : (
              <Image src={imageUrl} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{ objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s ease" }} />
            )
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", fontSize: "2.5rem" }}>✦</div>
          )}

          {/* Badges */}
          <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {product.isFeatured && (
              <span style={{ backgroundColor: "#C9A84C", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Featured</span>
            )}
            <span style={{ backgroundColor: product.category === "gold" ? "rgba(201,168,76,0.9)" : "rgba(160,160,160,0.9)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {product.category.toUpperCase()}
            </span>
          </div>

          {/* Quick View overlay */}
          <div style={{
            position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
          }}>
            <span style={{ backgroundColor: "#fff", color: "#0A0A0A", fontSize: "0.75rem", fontWeight: 700, padding: "10px 24px", borderRadius: "2px", letterSpacing: "0.1em", textTransform: "uppercase", transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "transform 0.3s ease" }}>
              Quick View
            </span>
          </div>

          {/* Wishlist */}
          <button onClick={toggleWishlist} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.95)", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "transform 0.2s", transform: wishlisted ? "scale(1.1)" : "scale(1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: "16px 16px 20px" }}>
          {/* Type tag */}
          <p style={{ color: "#999", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 500 }}>
            {product.purity}
          </p>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "0.95rem", fontWeight: 600, color: "#0A0A0A", margin: "0 0 10px", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {displayPrice != null ? (
                <>
                  <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "1rem" }}>₹{displayPrice.toLocaleString("en-IN")}</span>
                  {hasDiscount && <span style={{ color: "#bbb", fontSize: "0.8rem", textDecoration: "line-through" }}>₹{product.salePrice!.toLocaleString("en-IN")}</span>}
                </>
              ) : (
                <span style={{ color: "#B8860B", fontSize: "0.82rem", fontWeight: 600 }}>Price on Request</span>
              )}
            </div>
            <span style={{ color: "#888", fontSize: "0.75rem" }}>{product.weight}g</span>
          </div>

          {/* Add to Cart button */}
          <button style={{
            width: "100%", marginTop: "12px", padding: "10px",
            backgroundColor: hovered ? "#C9A84C" : "transparent",
            color: hovered ? "#fff" : "#C9A84C",
            border: "1px solid #C9A84C", borderRadius: "2px",
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "background-color 0.25s, color 0.25s",
          }}>
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
}
