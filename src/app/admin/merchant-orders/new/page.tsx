"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LineItem {
  description: string;
  weight: string;
  ratePerGram: string;
  makingCharges: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  backgroundColor: "#111",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  color: "#E8E8E8",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#A0A0A0",
  fontSize: "0.7rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: "0.25rem",
  fontWeight: 500,
};

function calcAmount(item: LineItem): number {
  const w = parseFloat(item.weight) || 0;
  const r = parseFloat(item.ratePerGram) || 0;
  const m = parseFloat(item.makingCharges) || 0;
  return w * r + m;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function NewMerchantOrderPage() {
  const router = useRouter();
  const [merchantName, setMerchantName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [purity, setPurity] = useState("22K");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", weight: "", ratePerGram: "", makingCharges: "0" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateItem(idx: number, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", weight: "", ratePerGram: "", makingCharges: "0" }]);
  }

  function removeItem(idx: number) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  const totalCost = items.reduce((sum, item) => sum + calcAmount(item), 0);
  const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!merchantName.trim()) { setError("Merchant name is required"); return; }
    if (items.some((item) => !item.description.trim() || !item.weight || !item.ratePerGram)) {
      setError("All line items must have description, weight, and rate per gram"); return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        merchantName: merchantName.trim(),
        invoiceNumber: invoiceNumber.trim() || null,
        purchaseDate,
        purity,
        notes: notes.trim() || null,
        items: items.map((item) => ({
          description: item.description.trim(),
          weight: parseFloat(item.weight),
          ratePerGram: parseFloat(item.ratePerGram),
          makingCharges: parseFloat(item.makingCharges) || 0,
          amount: calcAmount(item),
        })),
        totalWeight,
        totalCost,
      };
      const res = await fetch("/api/admin/merchant-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      router.push("/admin/merchant-orders");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/merchant-orders" style={{ color: "#666", textDecoration: "none", fontSize: "0.875rem" }}>← Merchant Orders</Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Log Purchase</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Record a new gold/silver purchase from a merchant.</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "4px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Merchant Details */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.5rem" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 600 }}>Merchant Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Merchant Name *</label>
              <input style={inputStyle} value={merchantName} onChange={(e) => setMerchantName(e.target.value)} placeholder="e.g. Rajesh Gold Traders" required />
            </div>
            <div>
              <label style={labelStyle}>Invoice Number</label>
              <input style={inputStyle} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g. INV-2024-001" />
            </div>
            <div>
              <label style={labelStyle}>Purchase Date *</label>
              <input style={inputStyle} type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Purity *</label>
              <select style={inputStyle} value={purity} onChange={(e) => setPurity(e.target.value)}>
                {["24K", "22K", "18K", "14K", "925", "999"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Line Items</h2>
            <button type="button" onClick={addItem} style={{ padding: "0.375rem 0.875rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
              + Add Item
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto auto", gap: "0.75rem", alignItems: "end", padding: "1rem", backgroundColor: "#111", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <input style={inputStyle} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="e.g. 22K Gold Bar" required />
                </div>
                <div>
                  <label style={labelStyle}>Weight (g) *</label>
                  <input style={inputStyle} type="number" step="0.01" min="0.01" value={item.weight} onChange={(e) => updateItem(idx, "weight", e.target.value)} placeholder="0.00" required />
                </div>
                <div>
                  <label style={labelStyle}>Rate/gram (₹) *</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" value={item.ratePerGram} onChange={(e) => updateItem(idx, "ratePerGram", e.target.value)} placeholder="0.00" required />
                </div>
                <div>
                  <label style={labelStyle}>Making (₹)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" value={item.makingCharges} onChange={(e) => updateItem(idx, "makingCharges", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Amount</label>
                  <div style={{ padding: "0.5rem 0.75rem", color: "#C9A84C", fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap" }}>{fmt(calcAmount(item))}</div>
                </div>
                <div style={{ paddingBottom: "2px" }}>
                  <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1} style={{ padding: "0.5rem", backgroundColor: "transparent", color: items.length === 1 ? "#333" : "#e05252", border: `1px solid ${items.length === 1 ? "#333" : "rgba(224,82,82,0.3)"}`, borderRadius: "4px", cursor: items.length === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "2rem", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Weight</div>
              <div style={{ color: "#E8E8E8", fontWeight: 600, fontSize: "1rem" }}>{totalWeight.toFixed(2)}g</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Cost</div>
              <div style={{ color: "#C9A84C", fontWeight: 700, fontSize: "1.25rem", fontFamily: "'Playfair Display', Georgia, serif" }}>{fmt(totalCost)}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={saving} style={{ padding: "0.75rem 2rem", backgroundColor: saving ? "#555" : "#C9A84C", color: "#000", border: "none", borderRadius: "4px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontSize: "0.9rem" }}>
            {saving ? "Saving..." : "Log Purchase"}
          </button>
          <Link href="/admin/merchant-orders" style={{ padding: "0.75rem 1.5rem", backgroundColor: "transparent", color: "#A0A0A0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
