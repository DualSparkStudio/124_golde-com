"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  productName: string;
  weight: number;
  quantity: number;
  unitPrice: number;
  makingCharges: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  gstAmount: number;
  gstRate: number;
  totalAmount: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      setOrder(data.order ?? data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  async function handleStatusUpdate() {
    if (!newStatus || !order) return;
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update status");
      setOrder(data.order ?? data);
      setNewStatus("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div style={{ color: "#666", padding: "2rem" }}>Loading order...</div>;
  if (!order) return <div style={{ color: "#e05252", padding: "2rem" }}>Order not found.</div>;

  const nextStatuses = VALID_TRANSITIONS[order.status] ?? [];

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/orders" style={{ color: "#666", textDecoration: "none", fontSize: "0.875rem" }}>← Orders</Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>
            Order {order.orderNumber}
          </h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <span style={{ padding: "4px 14px", borderRadius: "12px", fontSize: "0.8rem", backgroundColor: `${STATUS_COLORS[order.status] ?? "#666"}22`, color: STATUS_COLORS[order.status] ?? "#666", border: `1px solid ${STATUS_COLORS[order.status] ?? "#666"}44`, textTransform: "capitalize" }}>
          {order.status}
        </span>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "4px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Customer Info */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Customer</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div><span style={{ color: "#666", fontSize: "0.75rem" }}>Name: </span><span style={{ color: "#E8E8E8" }}>{order.customerName}</span></div>
            <div><span style={{ color: "#666", fontSize: "0.75rem" }}>Phone: </span><span style={{ color: "#E8E8E8" }}>{order.customerPhone}</span></div>
            {order.customerEmail && <div><span style={{ color: "#666", fontSize: "0.75rem" }}>Email: </span><span style={{ color: "#E8E8E8" }}>{order.customerEmail}</span></div>}
          </div>
        </div>

        {/* Status Update */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Update Status</h2>
          {nextStatuses.length === 0 ? (
            <p style={{ color: "#666", fontSize: "0.875rem" }}>No further status transitions available.</p>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ padding: "0.5rem 0.75rem", backgroundColor: "#111", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", color: "#E8E8E8", fontSize: "0.875rem", flex: 1 }}>
                <option value="">Select next status...</option>
                {nextStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <button onClick={handleStatusUpdate} disabled={!newStatus || updating} style={{ padding: "0.5rem 1.25rem", backgroundColor: newStatus && !updating ? "#C9A84C" : "#555", color: "#000", border: "none", borderRadius: "4px", cursor: newStatus && !updating ? "pointer" : "not-allowed", fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          )}
          {order.notes && <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.75rem" }}>Note: {order.notes}</p>}
        </div>
      </div>

      {/* Order Items */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
          <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Order Items</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Product", "Weight", "Qty", "Unit Price", "Making Charges", "Subtotal"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#A0A0A0", fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8" }}>{item.productName}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0" }}>{item.weight}g</td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0" }}>{item.quantity}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8" }}>{fmt(item.unitPrice)}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0" }}>{fmt(item.makingCharges)}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8", fontWeight: 600 }}>{fmt((item.unitPrice + item.makingCharges) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing Breakdown */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem", maxWidth: "360px", marginLeft: "auto" }}>
        <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Pricing Breakdown</h2>
        {[
          { label: "Subtotal", value: fmt(order.subtotal) },
          { label: "Shipping", value: fmt(order.shippingCost) },
          { label: `GST (${(order.gstRate * 100).toFixed(0)}%)`, value: fmt(order.gstAmount) },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.375rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#A0A0A0", fontSize: "0.875rem" }}>
            <span>{label}</span><span>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0", color: "#E8E8E8", fontWeight: 700, fontSize: "1rem" }}>
          <span>Total</span><span style={{ color: "#C9A84C" }}>{fmt(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
