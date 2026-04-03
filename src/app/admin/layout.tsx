import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
