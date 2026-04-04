"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";

interface OrderStats { total: number; pending: number; confirmed: number; processing: number; shipped: number; delivered: number; cancelled: number; revenue: number; }
interface Order { id: string; orderNumber: string; customerName: string; customerPhone: string; totalAmount: number; status: string; createdAt: string; }

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", confirmed: "#3b82f6", processing: "#8b5cf6",
  shipped: "#06b6d4", delivered: "#4caf7d", cancelled: "#e05252",
};

const QUICK = [
  { href: "/admin/products/new", label: "Add Product", icon: "➕", desc: "Add new jewelry" },
  { href: "/admin/orders", label: "View Orders", icon: "📦", desc: "Manage orders" },
  { href: "/admin/merchant-orders/new", label: "Log Purchase", icon: "🏪", desc: "Record gold purchase" },
  { href: "/admin/gold-rate", label: "Gold Rate", icon: "✦", desc: "Update today's rate" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊", desc: "Revenue & profit" },
  { href: "/admin/other-charges", label: "Charges", icon: "⚙️", desc: "Shipping & GST" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/admin/orders/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent orders
        const ordersRes = await fetch('/api/admin/orders?pageSize=8');
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.75rem", fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ color: "#888", fontSize: "0.875rem", margin: 0 }}>Welcome back — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: "110px", backgroundColor: "#F8F9FA", borderRadius: "12px", border: "1px solid #F0F0F0" }} />)}
        </div>
      ) : stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <DashboardCard title="Total Orders" value={stats.total} icon="📦" color="#C9A84C" />
          <DashboardCard title="Pending" value={stats.pending} icon="⏳" color="#f59e0b" />
          <DashboardCard title="Delivered" value={stats.delivered} icon="✅" color="#4caf7d" trend="positive" />
          <DashboardCard title="Revenue" value={fmt(stats.revenue)} icon="₹" color="#4caf7d" trend="positive" />
          <DashboardCard title="Cancelled" value={stats.cancelled} icon="❌" color="#e05252" trend="negative" />
        </div>
      )}

      {/* Quick Actions */}
      <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#0A0A0A", margin: "0 0 1rem" }}>Quick Actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {QUICK.map(({ href, label, icon, desc }) => (
          <Link key={href} href={href} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "1.25rem", backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,0.15)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#F0F0F0"; }}>
            <span style={{ fontSize: "1.5rem" }}>{icon}</span>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0A0A0A" }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "2px" }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#0A0A0A", margin: 0 }}>Recent Orders</h2>
        <Link href="/admin/orders" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>View All →</Link>
      </div>
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Order #", "Customer", "Total", "Status", "Date"].map(h => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "2.5rem", textAlign: "center", color: "#bbb", fontSize: "0.875rem" }}>No orders yet</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} style={{ borderBottom: "1px solid #F8F8F8" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#FAFAFA"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent"; }}>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <Link href={`/admin/orders/${order.id}`} style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>{order.orderNumber}</Link>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ fontSize: "0.875rem", color: "#0A0A0A", fontWeight: 500 }}>{order.customerName}</div>
                  <div style={{ fontSize: "0.75rem", color: "#999" }}>{order.customerPhone}</div>
                </td>
                <td style={{ padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#0A0A0A", fontWeight: 600 }}>{fmt(order.totalAmount)}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 600, backgroundColor: `${STATUS_COLORS[order.status] ?? "#999"}18`, color: STATUS_COLORS[order.status] ?? "#999", textTransform: "capitalize" }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#999", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
