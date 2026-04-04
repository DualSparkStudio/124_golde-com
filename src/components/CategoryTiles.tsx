"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const TILES = [
  { label: "Gold Necklaces", href: "/shop?category=gold&typeId=type-2", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
  { label: "Gold Rings", href: "/shop?category=gold&typeId=type-3", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80" },
  { label: "Gold Earrings", href: "/shop?category=gold&typeId=type-4", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { label: "Gold Bangles", href: "/shop?category=gold&typeId=type-7", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
  { label: "Silver Jewelry", href: "/shop?category=silver", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { label: "Bridal Collection", href: "/shop?occasion=wedding", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
];

function Tile({ label, href, image }: { label: string; href: string; image: string }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", borderRadius: "4px", cursor: "pointer", backgroundColor: "#f5f5f5" }}>
        {!imgError ? (
          <Image 
            src={image} 
            alt={label}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{
              objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{
            width: "100%", 
            height: "100%", 
            background: "linear-gradient(135deg, #C9A84C 0%, #8B7355 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "3rem", opacity: 0.3 }}>💎</span>
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.3)",
          transition: "background 0.3s ease",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
          padding: "20px",
        }}>
          <span style={{
            color: "#fff", fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1rem", fontWeight: 600, textAlign: "center",
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            transition: "transform 0.3s ease",
          }}>{label}</span>
          <span style={{
            color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.12em",
            textTransform: "uppercase", marginTop: "6px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>Shop Now →</span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryTiles() {
  return (
    <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Collections</p>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", margin: "0 0 12px" }}>
            Shop by Category
          </h2>
          <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>Explore our exclusive jewelry collections</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {TILES.map((t) => <Tile key={t.href} {...t} />)}
        </div>
      </div>
    </section>
  );
}
