"use client";

import { useStore } from "@/context/StoreContext";
import { useState } from "react";

interface ProductActionsProps {
  productId: string;
  name: string;
  price: number | null;
  image: string;
  weight: number;
  purity: string;
  slug: string;
  category: string;
}

export default function ProductActions({ productId, name, price, image, weight, purity, slug, category }: ProductActionsProps) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const [addedToCart, setAddedToCart] = useState(false);
  const wishlisted = isWishlisted(productId);

  function handleAddToCart() {
    if (!price) return;
    addToCart({ productId, name, price, image, weight, purity, quantity: 1, slug, category });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {price && (
        <button
          onClick={handleAddToCart}
          style={{
            width: "100%", padding: "16px",
            background: addedToCart ? "linear-gradient(90deg, #4caf7d, #3d9e6e)" : "linear-gradient(90deg, #C9A84C, #B8860B)",
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
          }}
        >
          {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
        </button>
      )}

      <button
        onClick={() => toggleWishlist(productId)}
        style={{
          width: "100%", padding: "14px",
          backgroundColor: wishlisted ? "rgba(201,168,76,0.08)" : "transparent",
          color: wishlisted ? "#B8860B" : "#555",
          border: `1px solid ${wishlisted ? "#C9A84C" : "#E8E8E8"}`,
          borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "all 0.25s ease",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24"
          fill={wishlisted ? "#C9A84C" : "none"}
          stroke={wishlisted ? "#C9A84C" : "#555"}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
      </button>
    </div>
  );
}
