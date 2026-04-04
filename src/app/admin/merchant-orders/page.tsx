"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/mockDb";
import type { MockMerchantOrder } from "@/lib/mockDb";

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  backgroundColor: "#FAFAFA",
  border: "1px solid #E8E8E8",
  borderRadius: "8px",
  color: "#0A0A0A",
  fontSize: "0.875rem",
  outline: "none",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<MockMerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    setLoading(true);
    try {
      let all = db.merchantOrders.getAll();
      if (dateFrom) all = all.filter((o) => o.purchaseDate >= dateFrom);
      if (dateTo) all = all.filter((o) => o.purchaseDate <= dateTo);
      // Sort newest first
      all = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setOrders(all);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  const totalInvestment = orders.reduce((sum, o) => sum + o.totalCost, 0);
  const totalWeight = orders.reduce((sum, o) => sum + o.totalWeight, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>Merchant Orders</h1>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Track gold/silver purchases from suppliers.</p>
        </div>
        <Link href="/admin/merchant-orders/new" style={{ padding: "0.5rem 1.25rem", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
          + New Purchase
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Orders", value: orders.length, icon: "📋" },
          { label: "Total Investment", value: fmt(totalInvestment), icon: "₹" },
          { label: "Total Weight", value: `${totalWeight.toFixed(2)}g`, icon: "⚖️" },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderTop: "3px solid #C9A84C", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ color: "#888", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>
              <span style={{ opacity: 0.5 }}>{icon}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#0A0A0A" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>From Date</label>
          <input style={inputStyle} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>To Date</label>
          <input style={inputStyle} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button onClick={() => { setDateFrom(""); setDateTo(""); }} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#555", border: "1px solid #E8E8E8", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", height: "36px" }}>
          Clear
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Merchant", "Invoice", "Purchase Date", "Purity", "Weight", "Total Cost"].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>No merchant orders yet.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A", fontWeight: 500 }}>{order.merchantName}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#888", fontFamily: "monospace", fontSize: "0.8rem" }}>{order.invoiceNumber ?? "—"}</td>
                <td style={{ padding: "0.875rem 1rem", color: "#555", fontSize: "0.875rem" }}>{new Date(order.purchaseDate).toLocaleDateString("en-IN")}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: "rgba(201,168,76,0.12)", color: "#B8860B", border: "1px solid rgba(201,168,76,0.25)" }}>{order.purity}</span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#555" }}>{order.totalWeight.toFixed(2)}g</td>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A", fontWeight: 600 }}>{fmt(order.totalCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
