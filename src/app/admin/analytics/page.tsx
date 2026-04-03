"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DashboardCard from "@/components/admin/DashboardCard";

interface RevenueSummary {
  revenue: number;
  purchaseCost: number;
  shippingExpenses: number;
  gstExpenses: number;
  makingChargesExpenses: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  orderCount: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
  profit: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  profit: number;
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const PRESETS = [
  { label: "Today", getDates: () => { const d = new Date().toISOString().slice(0, 10); return [d, d]; } },
  { label: "This Week", getDates: () => { const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1); return [mon.toISOString().slice(0, 10), now.toISOString().slice(0, 10)]; } },
  { label: "This Month", getDates: () => { const now = new Date(); return [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`, now.toISOString().slice(0, 10)]; } },
  { label: "This Year", getDates: () => { const now = new Date(); return [`${now.getFullYear()}-01-01`, now.toISOString().slice(0, 10)]; } },
];

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  backgroundColor: "#111",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  color: "#E8E8E8",
  fontSize: "0.875rem",
  outline: "none",
};

export default function AnalyticsPage() {
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const defaultTo = now.toISOString().slice(0, 10);

  const [dateFrom, setDateFrom] = useState(defaultFrom);
  const [dateTo, setDateTo] = useState(defaultTo);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [daily, setDaily] = useState<DailyRevenue[]>([]);
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState("This Month");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ startDate: dateFrom, endDate: dateTo });
      const [sumRes, dailyRes, monthlyRes] = await Promise.all([
        fetch(`/api/admin/analytics/summary?${params}`),
        fetch(`/api/admin/analytics/daily?${params}`),
        fetch(`/api/admin/analytics/monthly?year=${new Date(dateFrom).getFullYear()}`),
      ]);
      const [sumData, dailyData, monthlyData] = await Promise.all([sumRes.json(), dailyRes.json(), monthlyRes.json()]);
      setSummary(sumData.summary ?? sumData);
      setDaily(dailyData.daily ?? dailyData ?? []);
      setMonthly(monthlyData.monthly ?? monthlyData ?? []);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function applyPreset(preset: typeof PRESETS[0]) {
    const [from, to] = preset.getDates();
    setDateFrom(from);
    setDateTo(to);
    setActivePreset(preset.label);
  }

  async function downloadCSV(type: "orders" | "revenue") {
    const params = new URLSearchParams({ startDate: dateFrom, endDate: dateTo });
    const url = type === "orders"
      ? `/api/admin/analytics/export/orders?${params}`
      : `/api/admin/analytics/export/revenue?${params}`;
    const res = await fetch(url);
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = `${type}-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(objUrl);
  }

  const tooltipStyle = { backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", color: "#E8E8E8", fontSize: "0.8rem" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Revenue Analytics</h1>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>Track revenue, expenses, and profit over time.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={() => downloadCSV("orders")} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
            ↓ Orders CSV
          </button>
          <button onClick={() => downloadCSV("revenue")} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
            ↓ Revenue CSV
          </button>
        </div>
      </div>

      {/* Date Range */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{ padding: "0.375rem 0.875rem", backgroundColor: activePreset === p.label ? "rgba(201,168,76,0.15)" : "transparent", color: activePreset === p.label ? "#C9A84C" : "#A0A0A0", border: `1px solid ${activePreset === p.label ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "auto" }}>
          <input style={inputStyle} type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setActivePreset(""); }} />
          <span style={{ color: "#666" }}>→</span>
          <input style={inputStyle} type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setActivePreset(""); }} />
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div style={{ color: "#666", padding: "2rem", textAlign: "center" }}>Loading analytics...</div>
      ) : summary ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <DashboardCard title="Revenue" value={fmt(summary.revenue)} icon="💰" color="#4caf7d" trend="positive" subtitle={`${summary.orderCount} orders`} />
            <DashboardCard title="Investment" value={fmt(summary.purchaseCost)} icon="📦" color="#C9A84C" />
            <DashboardCard title="Total Expenses" value={fmt(summary.totalExpenses)} icon="📊" color="#e05252" trend="negative" />
            <DashboardCard title="Gross Profit" value={fmt(summary.grossProfit)} icon="📈" color={summary.grossProfit >= 0 ? "#4caf7d" : "#e05252"} trend={summary.grossProfit >= 0 ? "positive" : "negative"} />
            <DashboardCard title="Profit Margin" value={`${summary.profitMargin.toFixed(1)}%`} icon="%" color={summary.profitMargin >= 0 ? "#4caf7d" : "#e05252"} trend={summary.profitMargin >= 0 ? "positive" : "negative"} />
          </div>

          {/* Expense Breakdown */}
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Expense Breakdown</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Purchase Cost", value: summary.purchaseCost },
                { label: "Shipping", value: summary.shippingExpenses },
                { label: "GST", value: summary.gstExpenses },
                { label: "Making Charges", value: summary.makingChargesExpenses },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: "center", padding: "0.75rem", backgroundColor: "#111", borderRadius: "4px" }}>
                  <div style={{ color: "#666", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>{label}</div>
                  <div style={{ color: "#E8E8E8", fontWeight: 600, fontSize: "1rem" }}>{fmt(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Chart */}
          {daily.length > 0 && (
            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 600 }}>Daily Breakdown</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={daily} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: "#666", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="revenue" fill="#C9A84C" name="Revenue" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="profit" fill="#4caf7d" name="Profit" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Chart */}
          {monthly.length > 0 && (
            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem" }}>
              <h2 style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 600 }}>Monthly Breakdown ({new Date(dateFrom).getFullYear()})</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthly} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#666", fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="revenue" fill="#C9A84C" name="Revenue" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="profit" fill="#4caf7d" name="Profit" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: "#666", padding: "2rem", textAlign: "center" }}>No data available for the selected period.</div>
      )}
    </div>
  );
}
