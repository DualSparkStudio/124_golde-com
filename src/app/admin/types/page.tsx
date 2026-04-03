"use client";

import { useState, useEffect, useCallback } from "react";

interface JewelryType {
  id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  backgroundColor: "#111",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "4px",
  color: "#E8E8E8",
  fontSize: "0.875rem",
  outline: "none",
};

export default function TypesPage() {
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("both");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/types");
      const data = await res.json();
      setTypes(data.types ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), category: newCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to add type");
      setNewName("");
      setNewCategory("both");
      fetchTypes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditId(null);
      fetchTypes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete type "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/types/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTypes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const categoryBadge = (cat: string) => {
    const colors: Record<string, string> = { gold: "#C9A84C", silver: "#A0A0A0", both: "#4c9ac9" };
    return (
      <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", backgroundColor: `${colors[cat] ?? "#666"}22`, color: colors[cat] ?? "#666", border: `1px solid ${colors[cat] ?? "#666"}44`, textTransform: "capitalize" }}>
        {cat}
      </span>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>Jewelry Types</h1>
        <p style={{ color: "#666", fontSize: "0.875rem" }}>Manage product types like Pendant, Necklace, Ring, etc.</p>
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "4px", color: "#e05252", fontSize: "0.875rem", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Add new type */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#C9A84C", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>Add New Type</h2>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: "1 1 200px" }}>
            <label style={{ color: "#A0A0A0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Type Name</label>
            <input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Pendant, Ring, Chain..." required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ color: "#A0A0A0", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</label>
            <select style={inputStyle} value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button type="submit" disabled={adding} style={{ padding: "0.5rem 1.25rem", backgroundColor: adding ? "#555" : "#C9A84C", color: "#000", border: "none", borderRadius: "4px", fontWeight: 600, cursor: adding ? "not-allowed" : "pointer", fontSize: "0.875rem", height: "36px" }}>
            {adding ? "Adding..." : "+ Add Type"}
          </button>
        </form>
      </div>

      {/* Types table */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              {["Name", "Slug", "Category", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", color: "#A0A0A0", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Loading...</td></tr>
            ) : types.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>No types yet. Add one above.</td></tr>
            ) : types.map((type) => (
              <tr key={type.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "0.875rem 1rem", color: "#E8E8E8" }}>
                  {editId === type.id ? (
                    <input style={{ ...inputStyle, padding: "0.375rem 0.625rem" }} value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                  ) : (
                    type.name
                  )}
                </td>
                <td style={{ padding: "0.875rem 1rem", color: "#666", fontSize: "0.8rem", fontFamily: "monospace" }}>{type.slug}</td>
                <td style={{ padding: "0.875rem 1rem" }}>{categoryBadge(type.category)}</td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <span style={{ color: type.isActive ? "#4caf7d" : "#e05252", fontSize: "0.8rem" }}>
                    {type.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {editId === type.id ? (
                      <>
                        <button onClick={() => handleEdit(type.id)} style={{ padding: "0.25rem 0.75rem", backgroundColor: "#C9A84C", color: "#000", border: "none", borderRadius: "3px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Save</button>
                        <button onClick={() => setEditId(null)} style={{ padding: "0.25rem 0.75rem", backgroundColor: "transparent", color: "#A0A0A0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", cursor: "pointer", fontSize: "0.75rem" }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(type.id); setEditName(type.name); }} style={{ padding: "0.25rem 0.75rem", backgroundColor: "transparent", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "3px", cursor: "pointer", fontSize: "0.75rem" }}>Edit</button>
                        <button onClick={() => handleDelete(type.id, type.name)} style={{ padding: "0.25rem 0.75rem", backgroundColor: "transparent", color: "#e05252", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "3px", cursor: "pointer", fontSize: "0.75rem" }}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
