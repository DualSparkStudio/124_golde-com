"use client";

import { useState, useEffect } from "react";
import { leadsStore } from "@/lib/leadsStore";
import type { LeadEntry } from "@/lib/leadsStore";

const TYPE_LABELS: Record<string, string> = {
  appointment: "Appointment",
  price_request: "Price Request",
  popup_offer: "Popup Offer",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#C9A84C",
  contacted: "#4c9ac9",
  converted: "#4caf7d",
  closed: "#888",
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

const STATUS_TRANSITIONS: Record<string, string[]> = {
  new: ["contacted", "closed"],
  contacted: ["converted", "closed"],
  converted: ["closed"],
  closed: [],
};

export default function AppointmentsPage() {
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function loadLeads() {
    const all = leadsStore.get();
    setLeads([...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  useEffect(() => { loadLeads(); }, []);

  const filtered = leads.filter((l) => {
    if (filterType && l.type !== filterType) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    return true;
  });

  function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      leadsStore.update(id, { status: newStatus });
      loadLeads();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#0A0A0A", marginBottom: "0.25rem" }}>Appointments & Leads</h1>
        <p style={{ color: "#888", fontSize: "0.875rem" }}>Manage appointment requests, price enquiries, and popup leads.</p>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Leads", value: leads.length, color: "#C9A84C" },
          { label: "New", value: leads.filter((l) => l.status === "new").length, color: "#C9A84C" },
          { label: "Contacted", value: leads.filter((l) => l.status === "contacted").length, color: "#4c9ac9" },
          { label: "Converted", value: leads.filter((l) => l.status === "converted").length, color: "#4caf7d" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderTop: `3px solid ${color}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ color: "#888", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "0.5rem" }}>{label}</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#0A0A0A" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={inputStyle}>
          <option value="">All Types</option>
          <option value="appointment">Appointment</option>
          <option value="price_request">Price Request</option>
          <option value="popup_offer">Popup Offer</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle}>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={() => { setFilterType(""); setFilterStatus(""); }} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: "#555", border: "1px solid #E8E8E8", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem" }}>
          Clear
        </button>
        <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "auto" }}>{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["Customer", "Phone / Email", "Type", "Message", "Status", "Date", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "#bbb", fontSize: "0.875rem" }}>No leads yet. They will appear here when customers submit appointment or price request forms.</td></tr>
            ) : filtered.map((lead) => {
              const nextStatuses = STATUS_TRANSITIONS[lead.status] ?? [];
              return (
                <tr key={lead.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                  <td style={{ padding: "0.875rem 1rem", color: "#0A0A0A", fontWeight: 500, fontSize: "0.875rem" }}>{lead.name}</td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <div style={{ color: "#0A0A0A", fontSize: "0.875rem" }}>{lead.phone}</div>
                    {lead.email && <div style={{ color: "#888", fontSize: "0.75rem" }}>{lead.email}</div>}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: "rgba(201,168,76,0.12)", color: "#B8860B", border: "1px solid rgba(201,168,76,0.25)", whiteSpace: "nowrap" }}>
                      {TYPE_LABELS[lead.type] ?? lead.type}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#555", fontSize: "0.8rem", maxWidth: "200px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.message ?? lead.offerCode ?? <span style={{ color: "#bbb" }}>—</span>}
                    </div>
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 600, backgroundColor: `${STATUS_COLORS[lead.status] ?? "#888"}22`, color: STATUS_COLORS[lead.status] ?? "#888", border: `1px solid ${STATUS_COLORS[lead.status] ?? "#888"}44`, textTransform: "capitalize" }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.875rem 1rem", color: "#888", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                    {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td style={{ padding: "0.875rem 1rem" }}>
                    {nextStatuses.length > 0 ? (
                      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                        {nextStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(lead.id, s)}
                            disabled={updatingId === lead.id}
                            style={{
                              padding: "0.25rem 0.625rem",
                              backgroundColor: "transparent",
                              color: STATUS_COLORS[s] ?? "#555",
                              border: `1px solid ${STATUS_COLORS[s] ?? "#E8E8E8"}44`,
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              whiteSpace: "nowrap",
                            }}
                          >
                            → {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#bbb", fontSize: "0.75rem" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
