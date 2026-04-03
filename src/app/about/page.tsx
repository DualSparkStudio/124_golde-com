import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | Lumière Jewels",
  description: "Lumière Jewels — Crafting Timeless Elegance Since 2010.",
};

const STORY = [
  {
    tag: "Our Story",
    title: "Born from a Passion for Perfection",
    body: "In 2010, Lumière Jewels was founded with a singular vision: to bring the artistry of fine jewelry to every celebration of life. What began as a small atelier has grown into a trusted name for discerning customers who seek jewelry that transcends trends and endures through generations.\n\nEvery piece in our collection is a testament to the skill of our master craftsmen, who blend traditional techniques with contemporary sensibilities to create jewelry that is both timeless and relevant.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    reverse: false,
  },
  {
    tag: "Our Craft",
    title: "Where Tradition Meets Artistry",
    body: "We work exclusively with BIS Hallmark certified gold and 925 sterling silver, ensuring that every piece meets the highest standards of purity. Our craftsmen, many of whom have honed their skills over decades, bring an unparalleled level of detail to each creation.\n\nFrom the initial sketch to the final polish, every step of our process is guided by an unwavering commitment to quality.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
    reverse: true,
  },
  {
    tag: "Our Promise",
    title: "A Commitment You Can Trust",
    body: "When you choose Lumière Jewels, you choose more than jewelry — you choose a promise. A promise of authenticity, backed by BIS Hallmark certification. A promise of quality, guaranteed by our rigorous standards. And a promise of service, reflected in our dedicated team.\n\nWe offer free shipping on orders above ₹5,000 and a 7-day hassle-free return policy, because your experience should be as beautiful as the jewelry itself.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    reverse: false,
  },
];

const STATS = [
  { value: "14+", label: "Years of Excellence" },
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Unique Designs" },
  { value: "100%", label: "BIS Certified" },
];

const CONTACT = [
  { icon: "📍", label: "Visit Us", value: "123 Jewelers Lane, Mumbai, Maharashtra 400001" },
  { icon: "📞", label: "Call Us", value: "+91 98765 43210" },
  { icon: "✉️", label: "Email Us", value: "hello@lumierejewels.com" },
  { icon: "🕐", label: "Hours", value: "Mon–Sat: 10am – 7pm" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{
          position: "relative", paddingTop: "180px", paddingBottom: "100px", textAlign: "center",
          backgroundColor: "#0A0A0A", overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80" alt="" aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4))", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Est. 2010</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#FFF8F0", margin: "0 0 16px", lineHeight: 1.15 }}>
              Lumière Jewels
            </h1>
            <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "#C9A84C", margin: 0, fontStyle: "italic" }}>
              Crafting Timeless Elegance Since 2010
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: "#0A0A0A", padding: "48px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "32px", textAlign: "center" }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "2.5rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{value}</div>
                <div style={{ color: "rgba(255,248,240,0.55)", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "8px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Story sections */}
        {STORY.map(({ tag, title, body, image, reverse }) => (
          <section key={tag} style={{ padding: "80px 24px", backgroundColor: reverse ? "#FFF8F0" : "#fff" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "64px", alignItems: "center" }}>
              {/* Text — swap order on reverse */}
              {reverse ? (
                <>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
                  </div>
                  <div>
                    <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>{tag}</p>
                    <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: "0 0 24px", lineHeight: 1.3 }}>{title}</h2>
                    {body.split("\n\n").map((p, i) => (
                      <p key={i} style={{ color: "#555", fontSize: "1rem", lineHeight: 1.85, margin: i < body.split("\n\n").length - 1 ? "0 0 18px" : 0 }}>{p}</p>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 14px" }}>{tag}</p>
                    <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: "0 0 24px", lineHeight: 1.3 }}>{title}</h2>
                    {body.split("\n\n").map((p, i) => (
                      <p key={i} style={{ color: "#555", fontSize: "1rem", lineHeight: 1.85, margin: i < body.split("\n\n").length - 1 ? "0 0 18px" : 0 }}>{p}</p>
                    ))}
                  </div>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
                  </div>
                </>
              )}
            </div>
          </section>
        ))}

        {/* Trust features */}
        <section style={{ padding: "80px 24px", backgroundColor: "#0A0A0A" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Why Choose Us</p>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#FFF8F0", margin: 0 }}>Your Trusted Jewelry Partner</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px" }}>
              {[
                { icon: "🏅", title: "BIS Hallmarked", desc: "Every piece certified for purity and quality by the Bureau of Indian Standards." },
                { icon: "🔄", title: "Lifetime Exchange", desc: "Exchange your jewelry anytime, anywhere — no questions asked." },
                { icon: "🚚", title: "Free Shipping", desc: "Complimentary shipping on all orders above ₹5,000 across India." },
                { icon: "↩️", title: "Easy Returns", desc: "Not satisfied? Return within 7 days for a full refund or exchange." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ padding: "32px 24px", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", backgroundColor: "rgba(201,168,76,0.03)", textAlign: "center" }}>
                  <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>{icon}</div>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#FFF8F0", margin: "0 0 10px" }}>{title}</h3>
                  <p style={{ color: "rgba(255,248,240,0.5)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section style={{ padding: "80px 24px", backgroundColor: "#FFF8F0" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Get in Touch</p>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", margin: "0 0 48px" }}>
              We&apos;d Love to Hear from You
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "48px" }}>
              {CONTACT.map(({ icon, label, value }) => (
                <div key={label} style={{ padding: "28px 20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(201,168,76,0.1)" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "12px" }}>{icon}</div>
                  <p style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
                  <p style={{ color: "#444", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>{value}</p>
                </div>
              ))}
            </div>
            <Link href="/gold" style={{ display: "inline-block", padding: "16px 48px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px" }}>
              Shop Our Collection
            </Link>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
