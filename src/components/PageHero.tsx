"use client";

import { useEffect, useState } from "react";

interface PageHeroProps {
  tag?: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ tag, title, subtitle, image }: PageHeroProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!image) { setLoaded(true); return; }
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = image;
  }, [image]);

  return (
    <div style={{
      position: "relative",
      paddingTop: "180px",
      paddingBottom: "100px",
      textAlign: "center",
      overflow: "hidden",
      backgroundColor: "#0A0A0A",
    }}>
      {/* Background image via img tag for reliability */}
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: loaded ? 0.45 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none",
      }} />

      {/* Gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.15) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
        {tag && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 }}>{tag}</span>
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
          </div>
        )}
        <h1 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          fontWeight: 700, color: "#FFF8F0",
          margin: subtitle ? "0 0 18px" : "0",
          lineHeight: 1.15,
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
            lineHeight: 1.7, margin: 0, maxWidth: "560px", marginLeft: "auto", marginRight: "auto",
          }}>{subtitle}</p>
        )}
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />
    </div>
  );
}
