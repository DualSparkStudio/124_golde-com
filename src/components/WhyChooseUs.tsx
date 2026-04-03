const FEATURES = [
  { icon: "🏅", title: "BIS Hallmarked", desc: "Certified quality gold & silver" },
  { icon: "🔄", title: "Lifetime Exchange", desc: "Exchange anytime, anywhere" },
  { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹5,000" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
];

export default function WhyChooseUs() {
  return (
    <section style={{ padding: "64px 24px", backgroundColor: "#FFF8F0", borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Why Us</p>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>
            Your Trusted Jewelry Partner
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{icon}</div>
              <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#0A0A0A", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ color: "#666", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
