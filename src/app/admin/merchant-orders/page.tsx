"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface MerchantOrder {
  id: string;
  merchantName: string;
  invoiceNumber: string | null;
  purity: string;
  totalWeight: number;
  totalCost: number;
  purchaseDate: string;
  createdAt: string;
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  backgroundColor: "#111",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  color: "#E8E8E8",
  fontSize: "0.875rem",
  outline: "none",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const res = await fetch(`/api/admin/merchant-orders?${params}`);
      const data = await res.json();
      setOrders(data.orders ?? data ?? []);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const totalInvestment = orders.reduce((sum, o) => sum + o.totalCost, 0);
  const totalWeight = orders.reduce((sum, o) => sum + o.totalWeight, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Merchant Orders</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Track gold/silver purchases from suppliers.</p>
        </div>
        <Link href="/admin/merchant-orders/new" style={{ padding: "0.5rem 1.25rem", backgroundColor: "#C9A84C", color: "#000", borderRadius: "4px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
          + New Purchase
        </Link>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Orders", value: orders.length, icon: "📋" },
          { label: "Total Investment", value: fmt(totalInvestment), icon: "₹" },
          { label: "Total Weight", value: `${totalWeight.toFixed(2)}g`, icon: "⚖️" },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderLeft: "3px solid #C9A84C", borderRadius: "4px", padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
              <span style={{ opacity: 0.5 }}>{icon}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#E8E8E8" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>From Date</label>
          <input style={inputStyle} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>To Date</label>
          <input style={inputStyle} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button onClick={() => { setDateFrom(""); setDateTo(""); }} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#A0A0A0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem", height: "36px" }}>
          Clear
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Merchant", "Invoice", "Purchase Date", "Purity", "Weight", "Total Cost"].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#A0A0A0", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>No merchant orders yet.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8", fontWeight: 500 }}>{order.merchantName}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#666", fontFamily: "monospace", fontSize: "0.8rem" }}>{order.invoiceNumber ?? "—"}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0", fontSize: "0.875rem" }}>{new Date(order.purchaseDate).toLocaleDateString("en-IN")}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>{order.purity}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0" }}>{order.totalWeight.toFixed(2)}g</td>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8", fontWeight: 600 }}>{fmt(order.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
