"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/mockDb";
import type { MockOrder } from "@/lib/mockDb";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#C9A84C", confirmed: "#4c9ac9", processing: "#9a4cc9",
  shipped: "#4c7ac9", delivered: "#4caf7d", cancelled: "#e05252",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const found = db.orders.findById(id);
      setOrder(found);
    } finally {
      setLoading(false);
    }
  }, [id]);

  function handleStatusUpdate() {
    if (!newStatus || !order) return;
    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(newStatus)) {
      setError(`Cannot transition from ${order.status} to ${newStatus}`);
      return;
    }
    setUpdating(true);
    setError("");
    try {
      const updated = db.orders.update(id, { status: newStatus as MockOrder["status"] });
      if (!updated) throw new Error("Order not found");
      setOrder(updated);
      setNewStatus("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div style={{ color: "#888", padding: "2rem" }}>Loading order...</div>;
  if (!order) return <div style={{ color: "#e05252", padding: "2rem" }}>Order not found.</div>;

  const nextStatuses = VALID_TRANSITIONS[order.status] ?? [];

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/orders" style={{ color: "#888", textDecoration: "none", fontSize: "0.875rem" }}>← Orders</Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>
            Order {order.orderNumber}
          </h1>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <span style={{ padding: "4px 14px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: `${STATUS_COLORS[order.status] ?? "#888"}22`, color: STATUS_COLORS[order.status] ?? "#888", border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}44`, textTransform: "capitalize" }}>
          {order.status}
        </span>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)", borderRadius: "8px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Customer</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div><span style={{ color: "#888", fontSize: "0.75rem" }}>Name: </span><span style={{ color: "#0A0A0A" }}>{order.customerName}</span></div>
            <div><span style={{ color: "#888", fontSize: "0.75rem" }}>Phone: </span><span style={{ color: "#0A0A0A" }}>{order.customerPhone}</span></div>
            {order.customerEmail && <div><span style={{ color: "#888", fontSize: "0.75rem" }}>Email: </span><span style={{ color: "#0A0A0A" }}>{order.customerEmail}</span></div>}
          </div>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Update Status</h2>
          {nextStatuses.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.875rem" }}>No further status transitions available.</p>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ padding: "0.5rem 0.75rem", backgroundColor: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: "8px", color: "#0A0A0A", fontSize: "0.875rem", flex: 1, outline: "none" }}>
                <option value="">Select next status...</option>
                {nextStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <button onClick={handleStatusUpdate} disabled={!newStatus || updating} style={{ padding: "0.5rem 1.25rem", background: newStatus && !updating ? "linear-gradient(90deg, #C9A84C, #B8860B)" : "#ccc", color: "#fff", border: "none", borderRadius: "8px", cursor: newStatus && !updating ? "pointer" : "not-allowed", fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          )}
          {order.notes && <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "0.75rem" }}>Note: {order.notes}</p>}
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #F0F0F0", backgroundColor: "#FAFAFA" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Order Items</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Product", "Weight", "Qty", "Unit Price", "Making Charges", "Subtotal"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A" }}>{item.productName}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{item.weight}g</td>
                <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{item.quantity}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A" }}>{fmt(item.unitPrice)}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{fmt(item.makingCharges)}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A", fontWeight: 600 }}>{fmt((item.unitPrice + item.makingCharges) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", maxWidth: "360px", marginLeft: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Pricing Breakdown</h2>
        {[
          { label: "Subtotal", value: fmt(order.subtotal) },
          { label: "Shipping", value: fmt(order.shippingCost) },
          { label: `GST (${(order.gstRate * 100).toFixed(0)}%)`, value: fmt(order.gstAmount) },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.375rem 0", borderBottom: "1px solid #F8F8F8", color: "#555", fontSize: "0.875rem" }}>
            <span>{label}</span><span>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0", color: "#0A0A0A", fontWeight: 700, fontSize: "1rem" }}>
          <span>Total</span><span style={{ color: "#C9A84C" }}>{fmt(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
