"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface JewelryType { id: string; name: string; slug: string; }
interface FilterSidebarProps { category: string; }

const OCCASIONS = [
  { value: "wedding", label: "Wedding" },
  { value: "daily-wear", label: "Daily Wear" },
  { value: "festival", label: "Festive" },
  { value: "party", label: "Party" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "weight-asc", label: "Weight: Light to Heavy" },
];

export default function FilterSidebar({ category }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [typeId, setTypeId] = useState(searchParams.get("typeId") ?? "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");
  const [weightMin, setWeightMin] = useState(searchParams.get("weightMin") ?? "");
  const [weightMax, setWeightMax] = useState(searchParams.get("weightMax") ?? "");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") ?? "newest");

  useEffect(() => {
    fetch("/api/types").then((r) => r.json()).then((d) => setTypes(d.types ?? d.items ?? [])).catch(() => {});
  }, []);

  function push(overrides: Record<string, string> = {}) {
    const vals = { typeId, priceMin, priceMax, weightMin, weightMax, occasion, sortBy, ...overrides };
    const params = new URLSearchParams();
    Object.entries(vals).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/${category}?${params}`);
  }

  function reset() {
    setTypeId(""); setPriceMin(""); setPriceMax(""); setWeightMin(""); setWeightMax(""); setOccasion(""); setSortBy("newest");
    router.push(`/${category}`);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: "1px solid #e8e8e8", borderRadius: "6px",
    backgroundColor: "#fff", fontSize: "0.875rem", color: "#0A0A0A", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

  const sec: React.CSSProperties = { marginBottom: "24px" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: "10px" };

  return (
    <aside style={{ width: "260px", flexShrink: 0, alignSelf: "flex-start", position: "sticky", top: "100px" }}>
      <div style={{ backgroundColor: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #f5f5f5" }}>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", margin: 0, color: "#0A0A0A" }}>Filters</h3>
          <button onClick={reset} style={{ background: "none", border: "none", color: "#C9A84C", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Reset All
          </button>
        </div>

        {/* Sort */}
        <div style={sec}>
          <label style={lbl}>Sort By</label>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); push({ sortBy: e.target.value }); }} style={{ ...inp, cursor: "pointer" }}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Type */}
        {types.length > 0 && (
          <div style={sec}>
            <label style={lbl}>Jewelry Type</label>
            <select value={typeId} onChange={(e) => { setTypeId(e.target.value); push({ typeId: e.target.value }); }} style={{ ...inp, cursor: "pointer" }}>
              <option value="">All Types</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {/* Price */}
        <div style={sec}>
          <label style={lbl}>Price Range (₹)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={() => push()} style={{ ...inp, width: "50%" }} min={0} />
            <span style={{ color: "#ccc", fontSize: "0.9rem", flexShrink: 0 }}>—</span>
            <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={() => push()} style={{ ...inp, width: "50%" }} min={0} />
          </div>
        </div>

        {/* Weight */}
        <div style={sec}>
          <label style={lbl}>Weight (grams)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input type="number" placeholder="Min" value={weightMin} onChange={(e) => setWeightMin(e.target.value)} onBlur={() => push()} style={{ ...inp, width: "50%" }} min={0} step={0.1} />
            <span style={{ color: "#ccc", fontSize: "0.9rem", flexShrink: 0 }}>—</span>
            <input type="number" placeholder="Max" value={weightMax} onChange={(e) => setWeightMax(e.target.value)} onBlur={() => push()} style={{ ...inp, width: "50%" }} min={0} step={0.1} />
          </div>
        </div>

        {/* Occasion */}
        <div style={{ marginBottom: "24px" }}>
          <label style={lbl}>Occasion</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[{ value: "", label: "All Occasions" }, ...OCCASIONS].map((o) => (
              <label key={o.value} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 10px", borderRadius: "6px", backgroundColor: occasion === o.value ? "rgba(201,168,76,0.08)" : "transparent", border: `1px solid ${occasion === o.value ? "rgba(201,168,76,0.3)" : "transparent"}`, transition: "all 0.15s" }}>
                <input type="radio" name="occasion" value={o.value} checked={occasion === o.value} onChange={() => { setOccasion(o.value); push({ occasion: o.value }); }} style={{ accentColor: "#C9A84C" }} />
                <span style={{ fontSize: "0.875rem", color: occasion === o.value ? "#B8860B" : "#555", fontWeight: occasion === o.value ? 600 : 400 }}>{o.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={() => push()} style={{ width: "100%", padding: "13px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
