"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#4caf7d",
  cancelled: "#e05252",
};

const QUICK_LINKS = [
  { href: "/admin/products/new", label: "Add Product", icon: "+" },
  { href: "/admin/orders", label: "View Orders", icon: "◎" },
  { href: "/admin/merchant-orders/new", label: "Log Purchase", icon: "◇" },
  { href: "/admin/gold-rate", label: "Update Gold Rate", icon: "◈" },
  { href: "/admin/analytics", label: "Analytics", icon: "◉" },
  { href: "/admin/other-charges", label: "Other Charges", icon: "◆" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/orders/stats"),
          fetch("/api/admin/orders?pageSize=8"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setRecentOrders(data.orders ?? data.items ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: "1200px" }}>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "#E8E8E8",
          marginBottom: "0.25rem",
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "#A0A0A0", fontSize: "0.875rem", marginBottom: "2rem" }}>
        Welcome back to Lumière Admin
      </p>

      {/* Stats */}
      {loading ? (
        <div style={{ color: "#A0A0A0", marginBottom: "2rem" }}>Loading stats…</div>
      ) : stats ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <DashboardCard title="Total Orders" value={stats.total} icon="◎" />
          <DashboardCard title="Pending" value={stats.pending} color="#f59e0b" />
          <DashboardCard title="Confirmed" value={stats.confirmed} color="#3b82f6" />
          <DashboardCard title="Processing" value={stats.processing} color="#8b5cf6" />
          <DashboardCard title="Shipped" value={stats.shipped} color="#06b6d4" />
          <DashboardCard title="Delivered" value={stats.delivered} color="#4caf7d" trend="positive" />
          <DashboardCard title="Cancelled" value={stats.cancelled} color="#e05252" trend="negative" />
        </div>
      ) : null}

      {/* Quick links */}
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.125rem",
          color: "#E8E8E8",
          marginBottom: "1rem",
        }}
      >
        Quick Actions
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.75rem",
          marginBottom: "2.5rem",
        }}
      >
        {QUICK_LINKS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.875rem 1rem",
              backgroundColor: "#1A1A1A",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "4px",
              color: "#E8E8E8",
              textDecoration: "none",
              fontSize: "0.875rem",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
            }}
          >
            <span style={{ color: "#C9A84C", fontSize: "1rem" }}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.125rem",
          color: "#E8E8E8",
          marginBottom: "1rem",
        }}
      >
        Recent Orders
      </h2>
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Order #", "Customer", "Phone", "Total", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    color: "#A0A0A0",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: "2rem", textAlign: "center", color: "#A0A0A0" }}
                >
                  No orders yet
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.875rem" }}
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#E8E8E8", fontSize: "0.875rem" }}>
                    {order.customerName}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#A0A0A0", fontSize: "0.875rem" }}>
                    {order.customerPhone}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#E8E8E8", fontSize: "0.875rem" }}>
                    ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.625rem",
                        borderRadius: "2px",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        backgroundColor: `${STATUS_COLORS[order.status] ?? "#A0A0A0"}22`,
                        color: STATUS_COLORS[order.status] ?? "#A0A0A0",
                        textTransform: "capitalize",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#A0A0A0", fontSize: "0.8125rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
