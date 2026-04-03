import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8F9FA", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Global light-theme overrides for all admin inline styles */}
      <style>{`
        /* Cards */
        .admin-card { background-color: #fff !important; border: 1px solid #F0F0F0 !important; border-radius: 12px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important; }
        /* Inputs */
        .admin-input { background-color: #FAFAFA !important; border: 1px solid #E8E8E8 !important; color: #0A0A0A !important; border-radius: 8px !important; }
        .admin-input:focus { border-color: #C9A84C !important; outline: none !important; }
        /* Tables */
        .admin-table thead tr { background-color: #FAFAFA !important; }
        .admin-table thead th { color: #888 !important; font-size: 0.72rem !important; border-bottom: 1px solid #F0F0F0 !important; }
        .admin-table tbody tr { border-bottom: 1px solid #F8F8F8 !important; }
        .admin-table tbody tr:hover { background-color: #FAFAFA !important; }
        .admin-table tbody td { color: #0A0A0A !important; }
        /* Section headings */
        .admin-section-title { color: #C9A84C !important; font-size: 0.72rem !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 1rem !important; }
        /* Labels */
        .admin-label { color: #666 !important; font-size: 0.75rem !important; font-weight: 600 !important; letter-spacing: 0.06em !important; text-transform: uppercase !important; }
        /* Page titles */
        .admin-page-title { color: #0A0A0A !important; font-family: "Playfair Display", Georgia, serif !important; }
        .admin-page-subtitle { color: #888 !important; font-size: 0.875rem !important; }
        /* Buttons */
        .admin-btn-primary { background: linear-gradient(90deg, #C9A84C, #B8860B) !important; color: #fff !important; border: none !important; border-radius: 8px !important; font-weight: 700 !important; cursor: pointer !important; }
        .admin-btn-secondary { background: transparent !important; border: 1px solid #E8E8E8 !important; color: #555 !important; border-radius: 8px !important; cursor: pointer !important; }
        .admin-btn-danger { background: transparent !important; border: 1px solid rgba(224,82,82,0.3) !important; color: #e05252 !important; border-radius: 8px !important; cursor: pointer !important; }
      `}</style>
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0, padding: "2rem 2.5rem", overflowY: "auto", animation: "fadeInUp 250ms ease" }}>
        {children}
      </main>
    </div>
  );
}
