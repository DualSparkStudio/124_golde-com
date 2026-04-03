"use client";

import Link from "next/link";
import { useState } from "react";

interface CategoryCardProps {
  href: string;
  emoji: string;
  label: string;
  description: string;
}

export default function CategoryCard({ href, emoji, label, description }: CategoryCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${hovered ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
          borderRadius: "4px",
          padding: "40px 24px",
          textAlign: "center",
          backgroundColor: hovered ? "rgba(201,168,76,0.1)" : "rgba(201,168,76,0.04)",
          transition: "border-color 0.3s, background-color 0.3s",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: "1.8rem", color: "#C9A84C", marginBottom: "16px" }}>{emoji}</div>
        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#1A1A1A", marginBottom: "8px", fontWeight: 600 }}>
          {label}
        </h3>
        <p style={{ color: "#666", fontSize: "0.875rem", margin: 0 }}>{description}</p>
      </div>
    </Link>
  );
}
