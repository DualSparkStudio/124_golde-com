interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: "positive" | "negative" | "neutral";
  color?: string;
}

export default function DashboardCard({ title, value, subtitle, icon, trend, color = "#C9A84C" }: DashboardCardProps) {
  const trendColor = trend === "positive" ? "#4caf7d" : trend === "negative" ? "#e05252" : "#999";

  return (
    <div style={{
      backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px",
      padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s",
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#888", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{title}</span>
        {icon && <span style={{ fontSize: "1.25rem" }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.75rem", fontWeight: 700, color: "#0A0A0A", lineHeight: 1.1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: "0.8rem", color: trend ? trendColor : "#999" }}>{subtitle}</div>}
    </div>
  );
}
