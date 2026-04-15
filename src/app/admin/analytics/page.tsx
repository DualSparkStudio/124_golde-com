"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardCard from "@/components/admin/DashboardCard";
import { db } from "@/lib/mockDb";
import type { MockOrder, MockMerchantOrder } from "@/lib/mockDb";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function computeSummary(orders: MockOrder[], merchantOrders: MockMerchantOrder[]) {
  let revenue = 0, purchaseCost = 0, shippingExpenses = 0, gstExpenses = 0, makingChargesExpenses = 0;
  for (const o of orders) {
    revenue += o.totalAmount;
    shippingExpenses += o.shippingCost;
    gstExpenses += o.gstAmount;
    for (const item of o.items) {
      purchaseCost += item.purchasePrice * item.quantity;
      makingChargesExpenses += item.makingCharges * item.quantity;
    }
  }
  const merchantExpenses = merchantOrders.reduce((s, o) => s + o.totalCost, 0);
  const totalExpenses = purchaseCost + shippingExpenses + gstExpenses + makingChargesExpenses + merchantExpenses;
  const grossProfit = revenue - totalExpenses;
  return { revenue, purchaseCost, shippingExpenses, gstExpenses, makingChargesExpenses, merchantExpenses, totalExpenses, grossProfit, profitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0, orderCount: orders.length };
}

function computeDaily(orders: MockOrder[]) {
  const byDay: Record<string, { revenue: number; expenses: number }> = {};
  for (const o of orders) {
    const date = o.createdAt.slice(0, 10);
    if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0 };
    byDay[date].revenue += o.totalAmount;
    byDay[date].expenses += o.shippingCost + o.gstAmount + o.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
  }
  return Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, { revenue, expenses }]) => ({ date, revenue, profit: revenue - expenses }));
}

function computeMonthly(orders: MockOrder[], year: number) {
  const byMonth: Record<number, { revenue: number; expenses: number }> = {};
  for (let m = 0; m < 12; m++) byMonth[m] = { revenue: 0, expenses: 0 };
  for (const o of orders.filter(o => new Date(o.createdAt).getFullYear() === year)) {
    const m = new Date(o.createdAt).getMonth();
    byMonth[m].revenue += o.totalAmount;
    byMonth[m].expenses += o.shippingCost + o.gstAmount + o.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
  }
  return Object.entries(byMonth).map(([m, { revenue, expenses }]) => ({ month: MONTHS[parseInt(m)], revenue, profit: revenue - expenses }));
}

const PRESETS = [
  { label: "Today", getDates: () => { const d = new Date().toISOString().slice(0, 10); return [d, d]; } },
  { label: "This Week", getDates: () => { const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1); return [mon.toISOString().slice(0, 10), now.toISOString().slice(0, 10)]; } },
  { label: "This Month", getDates: () => { const now = new Date(); return [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`, now.toISOString().slice(0, 10)]; } },
  { label: "This Year", getDates: () => { const now = new Date(); return [`${now.getFullYear()}-01-01`, now.toISOString().slice(0, 10)]; } },
  { label: "All Time", getDates: () => ["2020-01-01", new Date().toISOString().slice(0, 10)] },
];

const inp: React.CSSProperties = { padding: "0.5rem 0.75rem", backgroundColor: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: "8px", color: "#0A0A0A", fontSize: "0.875rem", outline: "none" };

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 }); }

export default function AnalyticsPage() {
  const now = new Date();
  const [dateFrom, setDateFrom] = useState(`${now.getFullYear()}-01-01`);
  const [dateTo, setDateTo] = useState(now.toISOString().slice(0, 10));
  const [activePreset, setActivePreset] = useState("This Year");
  const [summary, setSummary] = useState<ReturnType<typeof computeSummary> | null>(null);
  const [daily, setDaily] = useState<ReturnType<typeof computeDaily>>([]);
  const [monthly, setMonthly] = useState<ReturnType<typeof computeMonthly>>([]);

  const compute = useCallback(() => {
    // Read directly from localStorage via db
    const allOrders = db.orders.getAll();
    const allMerchant = db.merchantOrders.getAll();

    const delivered = allOrders.filter((o) => {
      if (o.status !== "delivered") return false;
      if (o.createdAt < dateFrom) return false;
      if (o.createdAt > dateTo + "T23:59:59") return false;
      return true;
    });

    const filteredMerchant = allMerchant.filter((o) => {
      if (o.purchaseDate < dateFrom.slice(0, 10)) return false;
      if (o.purchaseDate > dateTo.slice(0, 10)) return false;
      return true;
    });

    setSummary(computeSummary(delivered, filteredMerchant));
    setDaily(computeDaily(delivered));
    setMonthly(computeMonthly(allOrders.filter(o => o.status === "delivered"), new Date(dateFrom).getFullYear()));
  }, [dateFrom, dateTo]);

  useEffect(() => { compute(); }, [compute]);

  function applyPreset(preset: typeof PRESETS[0]) {
    const [from, to] = preset.getDates();
    setDateFrom(from);
    setDateTo(to);
    setActivePreset(preset.label);
  }

  function downloadCSV(type: "orders" | "revenue") {
    const allOrders = db.orders.getAll();
    let rows: string;
    if (type === "orders") {
      const header = "Order Number,Customer,Phone,Items,Subtotal,Shipping,GST,Total,Status,Date";
      rows = [header, ...allOrders.map(o => [o.orderNumber, o.customerName, o.customerPhone, o.items.length, o.subtotal, o.shippingCost, o.gstAmount, o.totalAmount, o.status, o.createdAt.slice(0, 10)].join(","))].join("\n");
    } else {
      const delivered = allOrders.filter(o => o.status === "delivered");
      const header = "Date,Order Number,Revenue,Purchase Cost,Shipping,GST,Making Charges,Total Expenses,Profit";
      rows = [header, ...delivered.map(o => {
        const pc = o.items.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
        const mc = o.items.reduce((s, i) => s + i.makingCharges * i.quantity, 0);
        const te = pc + o.shippingCost + o.gstAmount + mc;
        return [o.createdAt.slice(0, 10), o.orderNumber, o.totalAmount, pc, o.shippingCost, o.gstAmount, mc, te, o.totalAmount - te].join(",");
      })].join("\n");
    }
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${type}-export.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const tooltipStyle = { backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "8px", color: "#0A0A0A", fontSize: "0.8rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>Revenue Analytics</h1>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>Track revenue, expenses, and profit over time.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => downloadCSV("orders")} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>↓ Orders CSV</button>
          <button onClick={() => downloadCSV("revenue")} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>↓ Revenue CSV</button>
        </div>
      </div>

      {/* Date Range */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{ padding: "0.375rem 0.875rem", backgroundColor: activePreset === p.label ? "rgba(201,168,76,0.12)" : "transparent", color: activePreset === p.label ? "#B8860B" : "#555", border: `1px solid ${activePreset === p.label ? "rgba(201,168,76,0.4)" : "#E8E8E8"}`, borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "auto" }}>
          <input style={inp} type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setActivePreset(""); }} />
          <span style={{ color: "#888" }}>→</span>
          <input style={inp} type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setActivePreset(""); }} />
        </div>
      </div>

      {summary ? (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <DashboardCard title="Revenue" value={fmt(summary.revenue)} icon="💰" color="#4caf7d" trend="positive" subtitle={`${summary.orderCount} delivered orders`} />
            <DashboardCard title="Investment" value={fmt(summary.purchaseCost)} icon="📦" color="#C9A84C" />
            <DashboardCard title="Total Expenses" value={fmt(summary.totalExpenses)} icon="📊" color="#e05252" trend="negative" />
            <DashboardCard title="Gross Profit" value={fmt(summary.grossProfit)} icon="📈" color={summary.grossProfit >= 0 ? "#4caf7d" : "#e05252"} trend={summary.grossProfit >= 0 ? "positive" : "negative"} />
            <DashboardCard title="Profit Margin" value={`${summary.profitMargin.toFixed(1)}%`} icon="%" color={summary.profitMargin >= 0 ? "#4caf7d" : "#e05252"} trend={summary.profitMargin >= 0 ? "positive" : "negative"} />
          </div>

          {/* Expense Breakdown */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 700 }}>Expense Breakdown</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Purchase Cost", value: summary.purchaseCost },
                { label: "Shipping", value: summary.shippingExpenses },
                { label: "GST", value: summary.gstExpenses },
                { label: "Making Charges", value: summary.makingChargesExpenses },
                { label: "Merchant Procurement", value: summary.merchantExpenses },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: "center", padding: "0.75rem", backgroundColor: "#FAFAFA", borderRadius: "8px", border: "1px solid #F0F0F0" }}>
                  <div style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ color: "#0A0A0A", fontWeight: 600, fontSize: "1rem" }}>{fmt(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Chart */}
          {daily.length > 0 && (
            <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 700 }}>Daily Breakdown</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={daily} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(Number(v))} />
                  <Bar dataKey="revenue" fill="#C9A84C" name="Revenue" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="profit" fill="#4caf7d" name="Profit" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Chart */}
          {monthly.some(m => m.revenue > 0) && (
            <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h2 style={{ color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 700 }}>Monthly Breakdown ({new Date(dateFrom).getFullYear()})</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthly} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmt(Number(v))} />
                  <Bar dataKey="revenue" fill="#C9A84C" name="Revenue" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="profit" fill="#4caf7d" name="Profit" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: "#888", padding: "2rem", textAlign: "center" }}>Loading analytics...</div>
      )}
    </div>
  );
}
