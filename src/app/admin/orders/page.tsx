"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";
import { db } from "@/lib/mockDb";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { id: string }[];
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#C9A84C",
  confirmed: "#4c9ac9",
  processing: "#9a4cc9",
  shipped: "#4c7ac9",
  delivered: "#4caf7d",
  cancelled: "#e05252",
};

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  const fetchStats = useCallback(() => {
    const all = db.orders.getAll();
    setStats({
      total: all.length,
      pending: all.filter(o => o.status === "pending").length,
      confirmed: all.filter(o => o.status === "confirmed").length,
      processing: all.filter(o => o.status === "processing").length,
      shipped: all.filter(o => o.status === "shipped").length,
      delivered: all.filter(o => o.status === "delivered").length,
      cancelled: all.filter(o => o.status === "cancelled").length,
      revenue: all.filter(o => o.status === "delivered").reduce((s, o) => s + o.totalAmount, 0),
    });
  }, []);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    let all = db.orders.getAll();
    if (status) all = all.filter(o => o.status === status);
    if (dateFrom) all = all.filter(o => o.createdAt >= dateFrom);
    if (dateTo) all = all.filter(o => o.createdAt <= dateTo + "T23:59:59");
    if (priceMin) all = all.filter(o => o.totalAmount >= parseFloat(priceMin));
    if (priceMax) all = all.filter(o => o.totalAmount <= parseFloat(priceMax));
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setTotal(all.length);
    setOrders(all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    setLoading(false);
  }, [status, dateFrom, dateTo, priceMin, priceMax, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  }

  async function downloadCSV() {
    const all = db.orders.getAll();
    let filtered = all;
    if (status) filtered = filtered.filter(o => o.status === status);
    if (dateFrom) filtered = filtered.filter(o => o.createdAt >= dateFrom);
    if (dateTo) filtered = filtered.filter(o => o.createdAt <= dateTo + "T23:59:59");
    const header = "Order Number,Customer,Phone,Items,Subtotal,Shipping,GST,Total,Status,Date";
    const rows = filtered.map(o => [o.orderNumber, o.customerName, o.customerPhone, o.items.length, o.subtotal, o.shippingCost, o.gstAmount, o.totalAmount, o.status, o.createdAt.slice(0, 10)].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>Orders</h1>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Manage and track customer orders.</p>
        </div>
        <button onClick={downloadCSV} style={{ padding: "0.5rem 1.25rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <DashboardCard title="Total Orders" value={stats.total} icon="📦" />
          <DashboardCard title="Pending" value={stats.pending} icon="⏳" color="#C9A84C" />
          <DashboardCard title="Delivered" value={stats.delivered} icon="✅" color="#4caf7d" trend="positive" />
          <DashboardCard title="Revenue" value={fmt(stats.revenue)} icon="₹" color="#4caf7d" trend="positive" />
          <DashboardCard title="Cancelled" value={stats.cancelled} icon="❌" color="#e05252" trend="negative" />
        </div>
      )}

      {/* Filters */}
      <form onSubmit={handleFilter} style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Status</label>
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {["pending","confirmed","processing","shipped","delivered","cancelled"].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>From Date</label>
          <input style={inputStyle} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>To Date</label>
          <input style={inputStyle} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Min Price (₹)</label>
          <input style={{ ...inputStyle, width: "100px" }} type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#C9A84C", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Max Price (₹)</label>
          <input style={{ ...inputStyle, width: "100px" }} type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="∞" />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1.25rem", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, height: "36px" }}>
          Filter
        </button>
        <button type="button" onClick={() => { setStatus(""); setDateFrom(""); setDateTo(""); setPriceMin(""); setPriceMax(""); setPage(1); }} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#555", border: "1px solid #E8E8E8", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", height: "36px" }}>
          Clear
        </button>
      </form>

      {/* Table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#C9A84C", fontFamily: "monospace", fontSize: "0.85rem" }}>{order.orderNumber}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ color: "#0A0A0A", fontSize: "0.875rem" }}>{order.customerName}</div>
                  <div style={{ color: "#888", fontSize: "0.75rem" }}>{order.customerPhone}</div>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#555", fontSize: "0.875rem" }}>{order.items?.length ?? 0} item(s)</td>
                <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A", fontWeight: 600 }}>{fmt(order.totalAmount)}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: `${STATUS_COLORS[order.status] ?? "#888"}22`, color: STATUS_COLORS[order.status] ?? "#888", border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}44`, textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <Link href={`/admin/orders/${order.id}`} style={{ padding: "0.25rem 0.75rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "6px", fontSize: "0.75rem", textDecoration: "none" }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "0.375rem 0.875rem", backgroundColor: "transparent", color: page === 1 ? "#ccc" : "#C9A84C", border: `1px solid ${page === 1 ? "#E8E8E8" : "rgba(201,168,76,0.3)"}`, borderRadius: "8px", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>← Prev</button>
          <span style={{ padding: "0.375rem 0.875rem", color: "#888", fontSize: "0.875rem" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "0.375rem 0.875rem", backgroundColor: "transparent", color: page === totalPages ? "#ccc" : "#C9A84C", border: `1px solid ${page === totalPages ? "#E8E8E8" : "rgba(201,168,76,0.3)"}`, borderRadius: "8px", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>Next →</button>
        </div>
      )}
    </div>
  );
}
