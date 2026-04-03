"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import type { CustomerProduct } from "@/types";
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_IMAGES, PRODUCT_IMAGE_OVERRIDES, pickFrom } from "@/constants/images";
import { isValidRemoteImageUrl } from "@/utils/images";

interface ProductCardProps {
  product: CustomerProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const fallback = pickFrom(DEFAULT_PRODUCT_IMAGES, product.id || product.name || product.slug);
  const nameKey = (product.name || product.slug || "").toLowerCase();
  const override = PRODUCT_IMAGE_OVERRIDES[nameKey];
  const preferredUrl = override || product.primaryImage?.url;
  const imageUrl = (isValidRemoteImageUrl(preferredUrl) ? preferredUrl : fallback) || DEFAULT_PRODUCT_IMAGE;
  const isFallback = !isValidRemoteImageUrl(preferredUrl);
  const href = `/${product.category}/${product.slug}`;
  const displayPrice = product.discountPrice ?? product.salePrice;
  const hasDiscount = product.discountPrice != null && product.salePrice != null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!displayPrice) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: imageUrl ?? "",
      weight: product.weight,
      purity: product.purity,
      quantity: 1,
      slug: product.slug,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "box-shadow 0.35s ease, transform 0.35s ease",
          cursor: "pointer",
          border: "1px solid #F5F5F5",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", backgroundColor: "#FAF8F5" }}>
          {imageUrl ? (
            // Use plain img when using fallback to avoid any optimization quirks
            isFallback ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={product.name} referrerPolicy="no-referrer"
                   style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.55s ease" }} />
            ) : imageUrl.startsWith("data:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={product.name}
                   style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s ease" }} />
            ) : (
              <Image src={imageUrl} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" quality={85} loading="lazy" decoding="async" unoptimized
                style={{ objectFit: "cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.55s ease", willChange: "transform" }} />
            )
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%, #FFF8F0, #FAF0E6)", borderTop: "1px solid #F5F5F5", color: "#C9A84C", fontSize: "2.6rem", opacity: 0.4 }}>
              ✦
            </div>
          )}

          {/* Badges */}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {product.isFeatured && (
              <span style={{ backgroundColor: "#C9A84C", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Featured</span>
            )}
            {hasDiscount && (
              <span style={{ backgroundColor: "#e05252", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.08em" }}>
                {Math.round((1 - product.discountPrice! / product.salePrice!) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Quick View overlay */}
          <div style={{
            position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
          }}>
            <span style={{
              backgroundColor: "#fff", color: "#0A0A0A", fontSize: "0.72rem", fontWeight: 700,
              padding: "10px 24px", borderRadius: "4px", letterSpacing: "0.1em", textTransform: "uppercase",
              transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "transform 0.3s ease",
            }}>
              Quick View
            </span>
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: wishlisted ? "#C9A84C" : "rgba(255,255,255,0.95)",
              border: "none", borderRadius: "50%", width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "all 0.25s ease",
              transform: wishlisted ? "scale(1.1)" : "scale(1)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wishlisted ? "#fff" : "none"}
              stroke={wishlisted ? "#fff" : "#C9A84C"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: "16px 16px 20px" }}>
          <p style={{ color: "#999", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 500 }}>
            {product.purity} · {product.weight}g
          </p>
          <h3 style={{
            fontFamily: '"Playfair Display", Georgia, serif', fontSize: "0.95rem",
            fontWeight: 600, color: "#0A0A0A", margin: "0 0 12px", lineHeight: 1.4,
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {product.name}
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              {displayPrice != null ? (
                <>
                  <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "1.05rem" }}>₹{displayPrice.toLocaleString("en-IN")}</span>
                  {hasDiscount && <span style={{ color: "#bbb", fontSize: "0.8rem", textDecoration: "line-through" }}>₹{product.salePrice!.toLocaleString("en-IN")}</span>}
                </>
              ) : (
                <span style={{ color: "#B8860B", fontSize: "0.82rem", fontWeight: 600 }}>Price on Request</span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!displayPrice}
            style={{
              width: "100%", padding: "10px",
              backgroundColor: addedToCart ? "#4caf7d" : (hovered ? "#C9A84C" : "transparent"),
              color: addedToCart ? "#fff" : (hovered ? "#fff" : "#C9A84C"),
              border: `1px solid ${addedToCart ? "#4caf7d" : "#C9A84C"}`,
              borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: displayPrice ? "pointer" : "not-allowed",
              transition: "all 0.25s ease",
            }}
          >
            {addedToCart ? "✓ Added!" : (displayPrice ? "Add to Cart" : "Price on Request")}
          </button>
        </div>
      </article>
    </Link>
  );
}
