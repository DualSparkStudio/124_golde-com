"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";

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

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders/stats");
      const data = await res.json();
      setStats(data);
    } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (status) params.set("status", status);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (priceMin) params.set("priceMin", priceMin);
      if (priceMax) params.set("priceMax", priceMax);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [status, dateFrom, dateTo, priceMin, priceMax, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  }

  async function downloadCSV() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    const res = await fetch(`/api/admin/analytics/export/orders?${params}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Orders</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Manage and track customer orders.</p>
        </div>
        <button onClick={downloadCSV} style={{ padding: "0.5rem 1.25rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem" }}>
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
      <form onSubmit={handleFilter} style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</label>
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {["pending","confirmed","processing","shipped","delivered","cancelled"].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>From Date</label>
          <input style={inputStyle} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>To Date</label>
          <input style={inputStyle} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Min Price (₹)</label>
          <input style={{ ...inputStyle, width: "100px" }} type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ color: "#A0A0A0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Max Price (₹)</label>
          <input style={{ ...inputStyle, width: "100px" }} type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="∞" />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1.25rem", backgroundColor: "#C9A84C", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, height: "36px" }}>
          Filter
        </button>
        <button type="button" onClick={() => { setStatus(""); setDateFrom(""); setDateTo(""); setPriceMin(""); setPriceMax(""); setPage(1); }} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#A0A0A0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem", height: "36px" }}>
          Clear
        </button>
      </form>

      {/* Table */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Order #", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#A0A0A0", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>No orders found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#C9A84C", fontFamily: "monospace", fontSize: "0.85rem" }}>{order.orderNumber}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ color: "#E8E8E8", fontSize: "0.875rem" }}>{order.customerName}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>{order.customerPhone}</div>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#A0A0A0", fontSize: "0.875rem" }}>{order.items?.length ?? 0} item(s)</td>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8", fontWeight: 600 }}>{fmt(order.totalAmount)}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: `${STATUS_COLORS[order.status] ?? "#666"}22`, color: STATUS_COLORS[order.status] ?? "#666", border: `1px solid ${STATUS_COLORS[order.status] ?? "#666"}44`, textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#666", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <Link href={`/admin/orders/${order.id}`} style={{ padding: "0.25rem 0.75rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "3px", fontSize: "0.75rem", textDecoration: "none" }}>
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
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "0.375rem 0.875rem", backgroundColor: "transparent", color: page === 1 ? "#444" : "#C9A84C", border: `1px solid ${page === 1 ? "#333" : "rgba(201,168,76,0.3)"}`, borderRadius: "4px", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>← Prev</button>
          <span style={{ padding: "0.375rem 0.875rem", color: "#A0A0A0", fontSize: "0.875rem" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "0.375rem 0.875rem", backgroundColor: "transparent", color: page === totalPages ? "#444" : "#C9A84C", border: `1px solid ${page === totalPages ? "#333" : "rgba(201,168,76,0.3)"}`, borderRadius: "4px", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>Next →</button>
        </div>
      )}
    </div>
  );
}
