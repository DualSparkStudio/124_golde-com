"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80",
    tag: "New Collection",
    title: "Exquisite Gold &\nSilver Jewelry",
    subtitle: "Discover our exclusive collection of handcrafted jewelry. Premium quality, timeless designs.",
    cta: { label: "Shop Now", href: "/shop" },
  },
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&q=80",
    tag: "Bridal 2024",
    title: "Bridal Collection\n2024",
    subtitle: "Make your special day unforgettable with our stunning bridal jewelry collection.",
    cta: { label: "Explore Collection", href: "/shop?occasion=wedding" },
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&q=80",
    tag: "Premium Gold",
    title: "Premium Gold\nJewelry",
    subtitle: "Crafted with 22K gold. BIS hallmarked for guaranteed purity and quality.",
    cta: { label: "View Gold Collection", href: "/shop?category=gold" },
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&q=80",
    tag: "Sterling Silver",
    title: "Sterling Silver\nElegance",
    subtitle: "Beautiful 925 sterling silver jewelry for every occasion. Timeless and affordable.",
    cta: { label: "View Silver Collection", href: "/shop?category=silver" },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", backgroundColor: "#0A0A0A", marginTop: "-36px" }}>
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          opacity: animating ? 0 : 0.55,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)" }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2, height: "100%", display: "flex", alignItems: "center",
        padding: "0 clamp(24px, 8vw, 120px)",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(20px)" : "translateY(0)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={{ maxWidth: "640px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "40px", height: "1px", backgroundColor: "#C9A84C" }} />
            <span style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500 }}>
              {slide.tag}
            </span>
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 700, color: "#fff", lineHeight: 1.1,
            margin: "0 0 24px", whiteSpace: "pre-line",
          }}>
            {slide.title}
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
            lineHeight: 1.7, margin: "0 0 40px", maxWidth: "480px",
          }}>
            {slide.subtitle}
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href={slide.cta.href} style={{
              display: "inline-block", padding: "16px 40px",
              background: "linear-gradient(90deg, #C9A84C, #B8860B)",
              color: "#fff", textDecoration: "none", fontSize: "0.85rem",
              fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "2px",
            }}>
              {slide.cta.label}
            </Link>
            <Link href="/about" style={{
              display: "inline-block", padding: "16px 40px",
              background: "transparent", color: "#fff", textDecoration: "none",
              fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", borderRadius: "2px",
              border: "1px solid rgba(255,255,255,0.4)",
            }}>
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {["prev", "next"].map((dir) => (
        <button key={dir} onClick={dir === "prev" ? prev : next} style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          [dir === "prev" ? "left" : "right"]: "24px",
          zIndex: 3, width: "48px", height: "48px", borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", fontSize: "1.2rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
          transition: "background-color 0.2s",
        }}>
          {dir === "prev" ? "‹" : "›"}
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", gap: "8px" }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? "28px" : "8px", height: "8px",
            borderRadius: "4px", border: "none", cursor: "pointer",
            backgroundColor: i === current ? "#C9A84C" : "rgba(255,255,255,0.4)",
            transition: "all 0.3s ease", padding: 0,
          }} />
        ))}
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "linear-gradient(to bottom, transparent, #FFF8F0)", zIndex: 1 }} />
    </section>
  );
}
