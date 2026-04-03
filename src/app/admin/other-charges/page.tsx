"use client";

import { useState, useEffect } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  backgroundColor: "#111",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  color: "#E8E8E8",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#A0A0A0",
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "0.375rem",
  fontWeight: 500,
};

export default function OtherChargesPage() {
  const [shippingCost, setShippingCost] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [otherLabel, setOtherLabel] = useState("");
  const [otherAmount, setOtherAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/other-charges")
      .then((r) => r.json())
      .then((data) => {
        const c = data.charges ?? data;
        setShippingCost(c.shippingCost?.toString() ?? "0");
        setGstRate(((c.gstRate ?? 0) * 100).toString());
        setOtherLabel(c.otherChargesLabel ?? "");
        setOtherAmount(c.otherChargesAmount?.toString() ?? "0");
      })
      .catch(() => setError("Failed to load charges"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/other-charges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingCost: parseFloat(shippingCost) || 0,
          gstRate: (parseFloat(gstRate) || 0) / 100,
          otherChargesLabel: otherLabel || null,
          otherChargesAmount: parseFloat(otherAmount) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#666", padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Other Charges</h1>
        <p style={{ color: "#666", fontSize: "0.875rem" }}>Configure shipping, GST, and additional charges applied to all orders.</p>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "4px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)", borderRadius: "4px", color: "#4caf7d", fontSize: "0.875rem", marginBottom: "1rem" }}>
          ✓ Charges updated successfully
        </div>
      )}

      <form onSubmit={handleSave} style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={labelStyle}>Shipping Cost (₹) — flat rate per order</label>
          <input style={inputStyle} type="number" step="0.01" min="0" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} placeholder="e.g. 99" />
          <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "0.25rem" }}>Applied as a flat shipping fee to every order.</p>
        </div>

        <div>
          <label style={labelStyle}>GST Rate (%)</label>
          <input style={inputStyle} type="number" step="0.01" min="0" max="100" value={gstRate} onChange={(e) => setGstRate(e.target.value)} placeholder="e.g. 3" />
          <p style={{ color: "#555", fontSize: "0.75rem", marginTop: "0.25rem" }}>Enter as percentage (e.g. 3 for 3%). Applied on order subtotal.</p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
          <h3 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Additional Charges (Optional)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Label</label>
              <input style={inputStyle} value={otherLabel} onChange={(e) => setOtherLabel(e.target.value)} placeholder="e.g. Packaging" />
            </div>
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input style={inputStyle} type="number" step="0.01" min="0" value={otherAmount} onChange={(e) => setOtherAmount(e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ backgroundColor: "#111", borderRadius: "4px", padding: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Preview (on ₹10,000 order)</p>
          {[
            { label: "Subtotal", value: "₹10,000" },
            { label: `Shipping`, value: `₹${parseFloat(shippingCost) || 0}` },
            { label: `GST (${gstRate || 0}%)`, value: `₹${((parseFloat(gstRate) || 0) / 100 * 10000).toFixed(0)}` },
            ...(otherLabel && parseFloat(otherAmount) > 0 ? [{ label: otherLabel, value: `₹${otherAmount}` }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "#A0A0A0", fontSize: "0.8rem", padding: "0.25rem 0" }}>
              <span>{label}</span><span>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", color: "#E8E8E8", fontWeight: 700, fontSize: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
            <span>Total</span>
            <span style={{ color: "#C9A84C" }}>
              ₹{(10000 + (parseFloat(shippingCost) || 0) + ((parseFloat(gstRate) || 0) / 100 * 10000) + (parseFloat(otherAmount) || 0)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ padding: "0.75rem 2rem", backgroundColor: saving ? "#555" : "#C9A84C", color: "#000", border: "none", borderRadius: "4px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontSize: "0.9rem", alignSelf: "flex-start" }}>
          {saving ? "Saving..." : "Save Charges"}
        </button>
      </form>
    </div>
  );
}
