"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter";

interface Product {
  id: string; name: string; slug: string; category: string; typeId: string;
  weight: number; purity: string; quantity: number;
  images: { url: string; isPrimary: boolean }[];
  salePrice: number | null; discountPrice: number | null; makingCharges: number;
  occasion: string[]; isFeatured: boolean; status: string;
  description: string | null; videoUrl: string | null;
  primaryImage: { url: string } | null; createdAt: string; updatedAt: string;
}

interface JewelryType { id: string; name: string; category: string; }
interface GoldRate { ratePerGram: number; purity: string; updatedAt: string; }

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "weight-asc", label: "Weight: Light → Heavy" },
];

const OCCASIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "daily-wear", label: "Daily Wear" },
  { value: "festival", label: "Festive" },
  { value: "party", label: "Party" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [goldRate, setGoldRate] = useState<GoldRate | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [typeId, setTypeId] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [weightMin, setWeightMin] = useState("");
  const [weightMax, setWeightMax] = useState("");
  const [occasion, setOccasion] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), pageSize: "12", sortBy });
      if (category) params.set("category", category);
      if (typeId) params.set("typeId", typeId);
      if (priceMin) params.set("priceMin", priceMin);
      if (priceMax) params.set("priceMax", priceMax);
      if (weightMin) params.set("weightMin", weightMin);
      if (weightMax) params.set("weightMax", weightMax);
      if (occasion) params.set("occasion", occasion);
      if (search) params.set("query", search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
      setPage(pg);
    } finally {
      setLoading(false);
    }
  }, [category, typeId, priceMin, priceMax, weightMin, weightMax, occasion, sortBy, search]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/types").then(r => r.json()).then(d => setTypes(d.types ?? [])).catch(() => {});
    fetch("/api/gold-rate").then(r => r.json()).then(d => setGoldRate(d.rate ?? null)).catch(() => {});
  }, []);

  function handleSearch(val: string) {
    setSearch(val);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => fetchProducts(1), 400);
  }

  function reset() {
    setCategory(""); setTypeId(""); setPriceMin(""); setPriceMax("");
    setWeightMin(""); setWeightMax(""); setOccasion(""); setSortBy("newest"); setSearch("");
  }

  const filteredTypes = types.filter(t => !category || t.category === category || t.category === "both");
  const activeFilters = [category, typeId, priceMin, priceMax, weightMin, weightMax, occasion].filter(Boolean).length;

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e8e8e8",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#0A0A0A",
    fontSize: "0.9rem"
  };

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", animation: "fadeInUp 300ms ease" }}>
        {/* Hero */}
        <div style={{ position: "relative", paddingTop: "clamp(120px, 20vw, 160px)", paddingBottom: "clamp(48px, 10vw, 80px)", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80" alt="" aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4))", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Lumière Jewels</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#FFF8F0", margin: "0 0 16px", lineHeight: 1.15 }}>
              Our Collection
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", margin: 0 }}>
              Handcrafted gold & silver jewelry — BIS Hallmark certified
            </p>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, transparent, #fff)", pointerEvents: "none" }} />
        </div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px 100px" }}>
          {/* Gold Rate Banner — inline above products */}
          {goldRate && (
            <div style={{ margin: "28px 0 0", padding: "14px 24px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                ✦ Today&apos;s Gold Rate:
              </span>
              <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 700 }}>
                ₹{goldRate.ratePerGram.toLocaleString("en-IN")}/gram
              </span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem" }}>
                ({goldRate.purity}) · Updated: {new Date(goldRate.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}

          {/* Breadcrumb */}
          <div style={{ padding: "20px 0 0", fontSize: "0.82rem", color: "#999", display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>Home</Link>
            <span style={{ color: "#ddd" }}>›</span>
            <span style={{ color: "#555" }}>Shop</span>
            {category && <><span style={{ color: "#ddd" }}>›</span><span style={{ color: "#555", textTransform: "capitalize" }}>{category}</span></>}
          </div>

          {/* Layout */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "flex-start", marginTop: "28px" }} className="shop-layout">
            {/* Sidebar */}
            <aside style={{ width: "100%", flexShrink: 0 }} className="shop-sidebar">
              <div style={{ backgroundColor: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "clamp(16px, 4vw, 24px)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #f5f5f5" }}>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", margin: 0, color: "#0A0A0A" }}>Filters</h3>
                  <button onClick={reset} style={{ background: "none", border: "none", color: "#C9A84C", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Reset</button>
                </div>

                {/* Search */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Search</label>
                  <input type="text" placeholder="Search jewelry..." value={search} onChange={e => setSearch(e.target.value)} style={inp} />
                </div>

                {/* Category */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Category</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[{ value: "", label: "All" }, { value: "gold", label: "Gold" }, { value: "silver", label: "Silver" }].map(opt => (
                      <button key={opt.value} onClick={() => { setCategory(opt.value); setTypeId(""); }}
                        style={{ flex: 1, padding: "8px 4px", borderRadius: "6px", border: `1px solid ${category === opt.value ? "#C9A84C" : "#e8e8e8"}`, backgroundColor: category === opt.value ? "rgba(201,168,76,0.1)" : "#fff", color: category === opt.value ? "#B8860B" : "#555", fontSize: "0.8rem", fontWeight: category === opt.value ? 700 : 400, cursor: "pointer", transition: "all 0.15s" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Sort By</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Type */}
                {filteredTypes.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Type</label>
                    <select value={typeId} onChange={e => setTypeId(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                      <option value="">All Types</option>
                      {filteredTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}

                {/* Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Price Range (₹)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ ...inp, width: "50%" }} min={0} />
                    <span style={{ color: "#ccc" }}>—</span>
                    <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ ...inp, width: "50%" }} min={0} />
                  </div>
                </div>

                {/* Weight */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Weight (grams)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input type="number" placeholder="Min" value={weightMin} onChange={e => setWeightMin(e.target.value)} style={{ ...inp, width: "50%" }} min={0} step={0.1} />
                    <span style={{ color: "#ccc" }}>—</span>
                    <input type="number" placeholder="Max" value={weightMax} onChange={e => setWeightMax(e.target.value)} style={{ ...inp, width: "50%" }} min={0} step={0.1} />
                  </div>
                </div>

                {/* Occasion */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "8px" }}>Occasion</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {[{ value: "", label: "All Occasions" }, ...OCCASIONS].map(o => (
                      <label key={o.value} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "7px 10px", borderRadius: "6px", backgroundColor: occasion === o.value ? "rgba(201,168,76,0.08)" : "transparent", border: `1px solid ${occasion === o.value ? "rgba(201,168,76,0.3)" : "transparent"}`, transition: "all 0.15s" }}>
                        <input type="radio" name="occasion" value={o.value} checked={occasion === o.value} onChange={() => setOccasion(o.value)} style={{ accentColor: "#C9A84C" }} />
                        <span style={{ fontSize: "0.875rem", color: occasion === o.value ? "#B8860B" : "#555", fontWeight: occasion === o.value ? 600 : 400 }}>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => fetchProducts(1)} style={{ width: "100%", padding: "13px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 18px rgba(201,168,76,0.25)", transition: "transform 0.15s ease" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Products */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Results bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", paddingBottom: "16px", borderBottom: "2px solid #f5f5f5" }}>
                <div>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.2rem", color: "#0A0A0A", fontWeight: 600 }}>
                    {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Jewelry` : "All Jewelry"}
                  </span>
                  <span style={{ color: "#999", fontSize: "0.875rem", marginLeft: "10px" }}>({total} {total === 1 ? "piece" : "pieces"})</span>
                </div>
              </div>

              {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{ borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ aspectRatio: "1/1", backgroundColor: "#f5f5f5" }} />
                      <div style={{ padding: "16px", backgroundColor: "#fff" }}>
                        <div style={{ height: "16px", backgroundColor: "#f5f5f5", borderRadius: "4px", marginBottom: "8px" }} />
                        <div style={{ height: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px", width: "60%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 24px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.2 }}>✦</div>
                  <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.4rem", color: "#0A0A0A", margin: "0 0 12px" }}>No pieces found</h3>
                  <p style={{ color: "#888", fontSize: "0.95rem", margin: "0 0 24px" }}>Try adjusting your filters.</p>
                  <button onClick={reset} style={{ padding: "12px 32px", border: "1px solid #C9A84C", color: "#C9A84C", background: "transparent", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer" }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
                  {products.map(product => <ProductCard key={product.id} product={product as never} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "56px", flexWrap: "wrap" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => fetchProducts(p)} style={{ width: "42px", height: "42px", borderRadius: "6px", border: p === page ? "none" : "1px solid #e8e8e8", color: p === page ? "#fff" : "#555", backgroundColor: p === page ? "#C9A84C" : "#fff", fontSize: "0.875rem", fontWeight: p === page ? 700 : 400, cursor: "pointer", boxShadow: p === page ? "0 4px 12px rgba(201,168,76,0.3)" : "none" }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
