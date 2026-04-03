"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  category: string;
  typeId: string;
  weight: number;
  salePrice: number | null;
  status: string;
  images: { url: string; isPrimary: boolean }[];
}

interface ProductsResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const STATUS_OPTIONS = ["", "active", "inactive", "draft"];
const CATEGORY_OPTIONS = ["", "gold", "silver", "both"];
const STATUS_COLORS: Record<string, string> = {
  active: "#4caf7d",
  inactive: "#A0A0A0",
  draft: "#f59e0b",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "#1A1A1A",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "2px",
  color: "#E8E8E8",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
};

export default function AdminProductsPage() {
  const [result, setResult] = useState<ProductsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("active");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (query) sp.set("query", query);
      if (status) sp.set("status", status);
      if (category) sp.set("category", category);
      const res = await fetch(`/api/admin/products?${sp}`);
      if (res.ok) {
        const data = await res.json();
        setResult({ ...data, items: data.products ?? data.items ?? [] });
      }
    } finally {
      setLoading(false);
    }
  }, [page, query, status, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (!result) return;
    if (selected.size === result.items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(result.items.map((p) => p.id)));
    }
  }

  async function applyBulkStatus() {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await fetch("/api/admin/products/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), status: bulkStatus }),
      });
      setSelected(new Set());
      fetchProducts();
    } finally {
      setBulkLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  }

  const primaryImage = (p: Product) =>
    p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? null;

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8E8E8" }}>
          Products
        </h1>
        <Link
          href="/admin/products/new"
          style={{
            padding: "0.625rem 1.25rem",
            backgroundColor: "#C9A84C",
            color: "#0A0A0A",
            borderRadius: "2px",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <input
          placeholder="Search products…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          style={{ ...inputStyle, minWidth: "200px" }}
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={inputStyle}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || "All Statuses"}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={inputStyle}>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c || "All Categories"}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", padding: "0.75rem 1rem", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "2px" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.875rem" }}>{selected.size} selected</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} style={inputStyle}>
            {["active", "inactive", "draft"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={applyBulkStatus}
            disabled={bulkLoading}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#C9A84C", color: "#0A0A0A", border: "none", borderRadius: "2px", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}
          >
            {bulkLoading ? "Applying…" : "Apply"}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              <th style={{ padding: "0.75rem 1rem", width: "40px" }}>
                <input
                  type="checkbox"
                  checked={result ? selected.size === result.items.length && result.items.length > 0 : false}
                  onChange={toggleAll}
                  style={{ accentColor: "#C9A84C" }}
                />
              </th>
              {["Image", "Name", "Category", "Weight", "Price", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#A0A0A0", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#A0A0A0" }}>Loading…</td></tr>
            ) : !result?.items.length ? (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#A0A0A0" }}>No products found</td></tr>
            ) : (
              result.items.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      style={{ accentColor: "#C9A84C" }}
                    />
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {primaryImage(product) ? (
                      <Image
                        src={primaryImage(product)!}
                        alt={product.name}
                        width={48}
                        height={48}
                        style={{ objectFit: "cover", borderRadius: "2px", border: "1px solid rgba(201,168,76,0.2)" }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 48, backgroundColor: "#111", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A0A0A0", fontSize: "0.75rem" }}>—</div>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#E8E8E8", fontSize: "0.875rem", maxWidth: "200px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#A0A0A0", fontSize: "0.875rem", textTransform: "capitalize" }}>{product.category}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#A0A0A0", fontSize: "0.875rem" }}>{product.weight}g</td>
                  <td style={{ padding: "0.75rem 1rem", color: "#E8E8E8", fontSize: "0.875rem" }}>
                    {product.salePrice ? `₹${Number(product.salePrice).toLocaleString("en-IN")}` : <span style={{ color: "#A0A0A0" }}>On Request</span>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ display: "inline-block", padding: "0.2rem 0.625rem", borderRadius: "2px", fontSize: "0.75rem", fontWeight: 500, backgroundColor: `${STATUS_COLORS[product.status] ?? "#A0A0A0"}22`, color: STATUS_COLORS[product.status] ?? "#A0A0A0", textTransform: "capitalize" }}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "2px", color: "#C9A84C", textDecoration: "none", fontSize: "0.8125rem" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        style={{ padding: "0.3rem 0.75rem", backgroundColor: "transparent", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "2px", color: "#e05252", fontSize: "0.8125rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "0.4rem 0.875rem", backgroundColor: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "2px", color: page === 1 ? "#A0A0A0" : "#E8E8E8", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
            ‹ Prev
          </button>
          <span style={{ color: "#A0A0A0", fontSize: "0.875rem" }}>Page {page} of {result.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))} disabled={page === result.totalPages} style={{ padding: "0.4rem 0.875rem", backgroundColor: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "2px", color: page === result.totalPages ? "#A0A0A0" : "#E8E8E8", cursor: page === result.totalPages ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
            Next ›
          </button>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", padding: "2rem", maxWidth: "400px", width: "90%" }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#E8E8E8", marginBottom: "0.75rem" }}>Delete Product?</h3>
            <p style={{ color: "#A0A0A0", fontSize: "0.875rem", marginBottom: "1.5rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "2px", color: "#A0A0A0", cursor: "pointer", fontSize: "0.875rem" }}>Cancel</button>
              <button onClick={() => deleteProduct(deleteId)} style={{ padding: "0.5rem 1rem", backgroundColor: "#e05252", border: "none", borderRadius: "2px", color: "#fff", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
