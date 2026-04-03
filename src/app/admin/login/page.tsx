"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #C9A84C, #B8860B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 16px" }}>✦</div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.75rem", fontWeight: 700, color: "#0A0A0A", margin: "0 0 6px" }}>Admin Portal</h1>
          <p style={{ color: "#888", fontSize: "0.875rem", margin: 0 }}>Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #F0F0F0" }}>
          {error && (
            <div style={{ padding: "12px 16px", backgroundColor: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)", borderRadius: "8px", color: "#e05252", fontSize: "0.875rem", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.04em" }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@jewelry.com"
                style={{ width: "100%", padding: "11px 14px", border: "1px solid #E8E8E8", borderRadius: "8px", fontSize: "0.9rem", color: "#0A0A0A", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", backgroundColor: "#FAFAFA" }}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E8E8E8"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.04em" }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ width: "100%", padding: "11px 14px", border: "1px solid #E8E8E8", borderRadius: "8px", fontSize: "0.9rem", color: "#0A0A0A", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", backgroundColor: "#FAFAFA" }}
                onFocus={e => e.target.style.borderColor = "#C9A84C"}
                onBlur={e => e.target.style.borderColor = "#E8E8E8"}
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#ccc" : "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", marginTop: "4px", transition: "opacity 0.2s" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "20px", padding: "14px", backgroundColor: "#F8F9FA", borderRadius: "8px", border: "1px solid #F0F0F0" }}>
            <p style={{ fontSize: "0.75rem", color: "#888", margin: "0 0 6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Demo Credentials</p>
            <p style={{ fontSize: "0.8rem", color: "#555", margin: "0 0 2px" }}>Email: <span style={{ color: "#C9A84C", fontWeight: 600 }}>admin@jewelry.com</span></p>
            <p style={{ fontSize: "0.8rem", color: "#555", margin: 0 }}>Password: <span style={{ color: "#C9A84C", fontWeight: 600 }}>admin123</span></p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{ color: "#888", textDecoration: "none", fontSize: "0.8rem" }}>← Back to Store</Link>
        </div>
      </div>
    </div>
  );
}
