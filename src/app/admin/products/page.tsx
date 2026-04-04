"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { db } from "@/lib/mockDb";
import type { MockProduct } from "@/lib/mockDb";

const STATUS_OPTIONS = ["", "active", "inactive", "draft"];
const CATEGORY_OPTIONS = ["", "gold", "silver"];
const STATUS_COLORS: Record<string, string> = {
  active: "#4caf7d",
  inactive: "#888",
  draft: "#f59e0b",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "#FAFAFA",
  border: "1px solid #E8E8E8",
  borderRadius: "8px",
  color: "#0A0A0A",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
};

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<MockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("active");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    try {
      setAllProducts(db.products.getAll());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Client-side filter + paginate
  const filtered = allProducts.filter((p) => {
    if (status && p.status !== status) return false;
    if (category && p.category !== category) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === pageItems.length && pageItems.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageItems.map((p) => p.id)));
    }
  }

  function applyBulkStatus() {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      for (const id of selected) {
        db.products.update(id, { status: bulkStatus as MockProduct["status"] });
      }
      setSelected(new Set());
      loadProducts();
    } finally {
      setBulkLoading(false);
    }
  }

  function deleteProduct(id: string) {
    db.products.delete(id);
    setDeleteId(null);
    loadProducts();
  }

  const primaryImage = (p: MockProduct) =>
    p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? null;

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#0A0A0A" }}>
          Products
        </h1>
        <Link href="/admin/products/new" style={{ padding: "0.625rem 1.25rem", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em" }}>
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <input
          placeholder="Search products…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          style={{ ...inputStyle, minWidth: "200px" }}
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={inputStyle}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || "All Statuses"}</option>)}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={inputStyle}>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
        <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "auto" }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", padding: "0.75rem 1rem", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px" }}>
          <span style={{ color: "#B8860B", fontSize: "0.875rem" }}>{selected.size} selected</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} style={inputStyle}>
            {["active", "inactive", "draft"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={applyBulkStatus} disabled={bulkLoading} style={{ padding: "0.5rem 1rem", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}>
            {bulkLoading ? "Applying…" : "Apply"}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", overflow: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              <th style={{ padding: "0.75rem 1rem", width: "40px" }}>
                <input type="checkbox" checked={pageItems.length > 0 && selected.size === pageItems.length} onChange={toggleAll} style={{ accentColor: "#C9A84C" }} />
              </th>
              {["Image", "Name", "Category", "Weight", "Price", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#888", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>Loading…</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#888" }}>No products found</td></tr>
            ) : pageItems.map((product) => {
              const imgUrl = primaryImage(product);
              return (
                <tr key={product.id} style={{ borderBottom: "1px solid #F8F8F8" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleSelect(product.id)} style={{ accentColor: "#C9A84C" }} />
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {imgUrl ? (
                      /* Use regular img to handle both data: and https: URLs */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imgUrl} alt={product.name} width={48} height={48} style={{ objectFit: "cover", borderRadius: "6px", border: "1px solid #F0F0F0" }} />
                    ) : (
                      <div style={{ width: 48, height: 48, backgroundColor: "#FAFAFA", borderRadius: "6px", border: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "0.75rem" }}>—</div>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#0A0A0A", fontSize: "0.875rem", maxWidth: "200px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#555", fontSize: "0.875rem", textTransform: "capitalize" }}>{product.category}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#555", fontSize: "0.875rem" }}>{product.weight}g</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#0A0A0A", fontSize: "0.875rem" }}>
                    {product.salePrice ? `₹${Number(product.salePrice).toLocaleString("en-IN")}` : <span style={{ color: "#888" }}>On Request</span>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ display: "inline-block", padding: "0.2rem 0.625rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 500, backgroundColor: `${STATUS_COLORS[product.status] ?? "#888"}22`, color: STATUS_COLORS[product.status] ?? "#888", textTransform: "capitalize" }}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link href={`/admin/products/${product.id}/edit`} style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "6px", color: "#C9A84C", textDecoration: "none", fontSize: "0.8125rem" }}>
                        Edit
                      </Link>
                      <button onClick={() => setDeleteId(product.id)} style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "6px", color: "#e05252", fontSize: "0.8125rem", cursor: "pointer" }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "0.4rem 0.875rem", backgroundColor: "transparent", border: "1px solid #E8E8E8", borderRadius: "8px", color: page === 1 ? "#ccc" : "#0A0A0A", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
            ‹ Prev
          </button>
          <span style={{ color: "#888", fontSize: "0.875rem" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "0.4rem 0.875rem", backgroundColor: "transparent", border: "1px solid #E8E8E8", borderRadius: "8px", color: page === totalPages ? "#ccc" : "#0A0A0A", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
            Next ›
          </button>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "2rem", maxWidth: "400px", width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#0A0A0A", marginBottom: "0.75rem" }}>Delete Product?</h3>
            <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid #E8E8E8", borderRadius: "8px", color: "#555", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => deleteProduct(deleteId)} style={{ padding: "0.5rem 1rem", backgroundColor: "#e05252", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
