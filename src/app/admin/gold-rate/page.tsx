"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/mockDb";
import type { MockGoldRate } from "@/lib/mockDb";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  backgroundColor: "#FAFAFA",
  border: "1px solid #E8E8E8",
  borderRadius: "8px",
  color: "#0A0A0A",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#C9A84C",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: "0.375rem",
  fontWeight: 700,
};

export default function GoldRatePage() {
  const [current, setCurrent] = useState<MockGoldRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState("");
  const [unit, setUnit] = useState("per_gram_22k");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try { setCurrent(db.goldRate.get()); } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const rateVal = parseFloat(rate);
    if (!rateVal || rateVal <= 0) { setError("Rate must be greater than 0"); return; }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const TOLA = 11.6638;
      let ratePerGram: number;
      let ratePerTola: number;
      if (unit === "per_gram_22k") {
        ratePerGram = rateVal;
        ratePerTola = Math.round(rateVal * TOLA);
      } else if (unit === "per_gram_24k") {
        ratePerGram = Math.round(rateVal * 22 / 24);
        ratePerTola = Math.round(ratePerGram * TOLA);
      } else if (unit === "per_tola_22k") {
        ratePerGram = Math.round(rateVal / TOLA);
        ratePerTola = rateVal;
      } else {
        const g24 = rateVal / TOLA;
        ratePerGram = Math.round(g24 * 22 / 24);
        ratePerTola = Math.round(ratePerGram * TOLA);
      }
      db.goldRate.set({ ratePerGram, ratePerTola, purity: "22K", source: "manual" });
      setCurrent(db.goldRate.get());
      setRate("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set rate");
    } finally {
      setSaving(false);
    }
  }

  const unitLabels: Record<string, string> = {
    per_gram_22k: "Per Gram (22K)",
    per_gram_24k: "Per Gram (24K)",
    per_tola_22k: "Per Tola (22K)",
    per_tola_24k: "Per Tola (24K)",
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>Gold Rate</h1>
        <p style={{ color: "#888", fontSize: "0.875rem" }}>View the current gold rate and set a manual override.</p>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Current Rate</h2>
        {loading ? (
          <p style={{ color: "#888" }}>Loading...</p>
        ) : current ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Rate per Gram</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#C9A84C" }}>₹{current.ratePerGram.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Rate per Tola</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#0A0A0A" }}>₹{current.ratePerTola.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Purity</div>
              <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: "rgba(201,168,76,0.12)", color: "#B8860B", border: "1px solid rgba(201,168,76,0.25)" }}>{current.purity}</span>
            </div>
            <div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Source</div>
              <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: current.source === "manual" ? "rgba(76,175,125,0.1)" : "rgba(76,154,201,0.1)", color: current.source === "manual" ? "#4caf7d" : "#4c9ac9", border: `1px solid ${current.source === "manual" ? "rgba(76,175,125,0.2)" : "rgba(76,154,201,0.2)"}` }}>
                {current.source === "manual" ? "Manual" : "API"}
              </span>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Last Updated</div>
              <div style={{ color: "#555", fontSize: "0.875rem" }}>{new Date(current.updatedAt).toLocaleString("en-IN")}</div>
            </div>
          </div>
        ) : (
          <p style={{ color: "#e05252", fontSize: "0.875rem" }}>Could not load current rate. Set a manual rate below.</p>
        )}
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Set Manual Rate</h2>
        <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "1.25rem" }}>Override the current rate with a manual value.</p>
        {error && <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)", borderRadius: "8px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(76,175,125,0.08)", border: "1px solid rgba(76,175,125,0.2)", borderRadius: "8px", color: "#4caf7d", fontSize: "0.875rem", marginBottom: "1rem" }}>✓ Gold rate updated successfully</div>}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Rate (₹) *</label>
            <input style={inputStyle} type="number" step="0.01" min="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 6500" required />
          </div>
          <div>
            <label style={labelStyle}>Unit *</label>
            <select style={inputStyle} value={unit} onChange={(e) => setUnit(e.target.value)}>
              {Object.entries(unitLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 2rem", background: saving ? "#ccc" : "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontSize: "0.9rem", alignSelf: "flex-start" }}>
            {saving ? "Setting..." : "Set Rate"}
          </button>
        </form>
      </div>
    </div>
  );
}
