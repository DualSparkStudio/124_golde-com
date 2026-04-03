interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: "positive" | "negative" | "neutral";
  color?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "#C9A84C",
}: DashboardCardProps) {
  const trendColor =
    trend === "positive" ? "#4caf7d" : trend === "negative" ? "#e05252" : "#A0A0A0";

  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(201,168,76,0.15)",
        borderLeft: `3px solid ${color}`,
        borderRadius: "4px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#A0A0A0",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {title}
        </span>
        {icon && (
          <span style={{ fontSize: "1.25rem", opacity: 0.6 }}>{icon}</span>
        )}
      </div>

      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#E8E8E8",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: "0.8125rem",
            color: trend ? trendColor : "#A0A0A0",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
