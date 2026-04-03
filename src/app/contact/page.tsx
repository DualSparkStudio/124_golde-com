import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import AppointmentForm from "@/components/AppointmentForm";
import MessageForm from "@/components/MessageForm";
import { DEFAULT_HERO_IMAGE } from "@/constants/images";

export const metadata = {
  title: "Contact Us | Lumière Jewels",
  description: "Get in touch with Lumière Jewels — Book an appointment or send us a message.",
};

export default function ContactPage() {
  const infoItem = (icon: string, label: string, value: string) => (
    <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid rgba(201,168,76,0.15)" }}>
      <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{icon}</div>
      <p style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "#444", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>{value}</p>
    </div>
  );

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", animation: "fadeInUp 300ms ease" }}>
        {/* Hero */}
        <div style={{ position: "relative", paddingTop: "160px", paddingBottom: "90px", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEFAULT_HERO_IMAGE}
            alt=""
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, pointerEvents: "none" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4))", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>We’re here to help</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.4rem, 5vw, 3.4rem)", color: "#FFF8F0", margin: "0 0 12px", lineHeight: 1.15 }}>
              Contact Us
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", margin: 0 }}>
              Book an appointment or send us a message — we’ll respond promptly.
            </p>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />
        </div>

        {/* Content */}
        <section style={{ padding: "70px 24px", backgroundColor: "#fff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "start" }}>
            {/* Contact Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>Reach Us</p>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>Let’s Talk</h2>
              </div>
              {infoItem("📍", "Address", "123 Jewelry Street, Gold District, Mumbai")}
              {infoItem("📞", "Phone", "+91 98765 43210")}
              {infoItem("✉️", "Email", "hello@lumierejewels.com")}
              {infoItem("🕐", "Hours", "Mon–Sat: 10AM – 7PM")}
              <div style={{ marginTop: "8px" }}>
                <Link href="/shop" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>
                  Browse Collection →
                </Link>
              </div>
            </div>

            {/* Appointment / Message */}
            <div>
              <div style={{ marginBottom: "20px" }}>
                <AppointmentForm />
              </div>
              {/* Simple message form posting to leads/popup */}
              <MessageForm />
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}



