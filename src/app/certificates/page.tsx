import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";
import { CERT_IMAGE_OVERRIDES, DEFAULT_CERT_IMAGE, DEFAULT_CERT_IMAGES, DEFAULT_HERO_IMAGE } from "@/constants/images";

export const metadata = {
  title: "Certificates | Lumière Jewels",
  description: "View authenticity and quality certificates for Lumière Jewels.",
};

const CERTS: { title: string; image: string; fileUrl: string }[] = [
  { title: "BIS Hallmark Certification", image: DEFAULT_CERT_IMAGE, fileUrl: DEFAULT_CERT_IMAGE },
  { title: "Quality Assurance Report", image: DEFAULT_CERT_IMAGE, fileUrl: DEFAULT_CERT_IMAGE },
  { title: "Purity Verification", image: DEFAULT_CERT_IMAGE, fileUrl: DEFAULT_CERT_IMAGE },
  { title: "Craftsmanship Excellence", image: DEFAULT_CERT_IMAGE, fileUrl: DEFAULT_CERT_IMAGE },
];

export default function CertificatesPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", animation: "fadeInUp 300ms ease" }}>
        {/* Hero */}
        <div style={{ position: "relative", paddingTop: "150px", paddingBottom: "70px", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DEFAULT_HERO_IMAGE} alt="" aria-hidden="true"
               style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4))" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Authenticity</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "#FFF8F0", margin: "0 0 10px" }}>
              Certificates
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>Our commitment to purity and quality</p>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, transparent, #fff)" }} />
        </div>

        {/* Grid */}
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
              {CERTS.map((c, i) => (
                <article key={c.title} style={{ backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid #F0F0F0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", backgroundColor: "#FAF8F5", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={CERT_IMAGE_OVERRIDES[c.title.toLowerCase()] || DEFAULT_CERT_IMAGES[i % DEFAULT_CERT_IMAGES.length] || DEFAULT_CERT_IMAGE} alt={c.title} referrerPolicy="no-referrer"
                         style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.05rem", margin: "0 0 10px", color: "#0A0A0A" }}>{c.title}</h3>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a href={CERT_IMAGE_OVERRIDES[c.title.toLowerCase()] || DEFAULT_CERT_IMAGES[i % DEFAULT_CERT_IMAGES.length] || DEFAULT_CERT_IMAGE} target="_blank" rel="noreferrer" style={{ padding: "10px 14px", border: "1px solid #C9A84C", color: "#C9A84C", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "6px" }}>
                        View
                      </a>
                      <a href={CERT_IMAGE_OVERRIDES[c.title.toLowerCase()] || DEFAULT_CERT_IMAGES[i % DEFAULT_CERT_IMAGES.length] || DEFAULT_CERT_IMAGE} download style={{ padding: "10px 14px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", border: "none", color: "#fff", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "6px" }}>
                        Download
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}

