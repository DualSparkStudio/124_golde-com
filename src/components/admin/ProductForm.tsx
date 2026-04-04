"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface JewelryType {
  id: string;
  name: string;
  category: string;
}

interface ProductFormData {
  name: string;
  category: string;
  typeId: string;
  weight: string;
  purity: string;
  quantity: string;
  purchasePrice: string;
  salePrice: string;
  discountPrice: string;
  makingCharges: string;
  occasion: string[];
  description: string;
  videoUrl: string;
  isFeatured: boolean;
  imageIds: string[];
  imageUrls: string[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { id?: string };
  mode: "new" | "edit";
}

const OCCASIONS = ["wedding", "daily-wear", "party", "festival"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "#FAFAFA",
  border: "1px solid #E8E8E8",
  borderRadius: "8px",
  color: "#0A0A0A",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#666",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
  letterSpacing: "0.02em",
};

const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.25rem" };

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [types, setTypes] = useState<JewelryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name ?? "",
    category: initialData?.category ?? "gold",
    typeId: initialData?.typeId ?? "",
    weight: initialData?.weight ?? "",
    purity: initialData?.purity ?? "",
    quantity: initialData?.quantity ?? "0",
    purchasePrice: initialData?.purchasePrice ?? "",
    salePrice: initialData?.salePrice ?? "",
    discountPrice: initialData?.discountPrice ?? "",
    makingCharges: initialData?.makingCharges ?? "",
    occasion: initialData?.occasion ?? [],
    description: initialData?.description ?? "",
    videoUrl: initialData?.videoUrl ?? "",
    isFeatured: initialData?.isFeatured ?? false,
    imageIds: initialData?.imageIds ?? [],
    imageUrls: initialData?.imageUrls ?? [],
  });

  useEffect(() => {
    fetch("/api/admin/types")
      .then((r) => r.json())
      .then((d) => setTypes(d.types ?? []))
      .catch(() => {});
  }, []);

  function set(field: keyof ProductFormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleOccasion(occ: string) {
    set(
      "occasion",
      form.occasion.includes(occ)
        ? form.occasion.filter((o) => o !== occ)
        : [...form.occasion, occ]
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Only image files allowed"); return; }
    setUploadingImage(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      set("imageIds", [...form.imageIds, data.publicId]);
      set("imageUrls", [...form.imageUrls, data.url]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage(idx: number) {
    set("imageIds", form.imageIds.filter((_, i) => i !== idx));
    set("imageUrls", form.imageUrls.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.typeId) { setError("Type is required"); return; }
    if (!form.weight || parseFloat(form.weight) <= 0) { setError("Weight must be > 0"); return; }
    if (form.imageIds.length === 0) { setError("At least one image is required"); return; }
    if (form.discountPrice && form.salePrice && parseFloat(form.discountPrice) >= parseFloat(form.salePrice)) {
      setError("Discount price must be less than sale price"); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        weight: parseFloat(form.weight),
        quantity: parseInt(form.quantity),
        purchasePrice: parseFloat(form.purchasePrice),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        makingCharges: parseFloat(form.makingCharges),
      };
      const url = mode === "new" ? "/api/admin/products" : `/api/admin/products/${initialData?.id}`;
      const method = mode === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save product");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "900px" }}>
      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", borderRadius: "8px", color: "#721c24", fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section>
        <h3 style={{ color: "#C9A84C", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>Basic Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Product Name *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. 22K Gold Pendant" required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Category *</label>
            <select style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Type *</label>
            <select style={inputStyle} value={form.typeId} onChange={(e) => set("typeId", e.target.value)} required>
              <option value="">Select type...</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Weight (grams) *</label>
            <input style={inputStyle} type="number" step="0.01" min="0.01" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 2.5" required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Purity *</label>
            <input style={inputStyle} value={form.purity} onChange={(e) => set("purity", e.target.value)} placeholder="e.g. 22K, 925" required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Quantity *</label>
            <input style={inputStyle} type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} required />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 style={{ color: "#C9A84C", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>Pricing</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Purchase Price (₹) *</label>
            <input style={inputStyle} type="number" step="0.01" min="0" value={form.purchasePrice} onChange={(e) => set("purchasePrice", e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Making Charges (₹) *</label>
            <input style={inputStyle} type="number" step="0.01" min="0" value={form.makingCharges} onChange={(e) => set("makingCharges", e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Sale Price (₹)</label>
            <input style={inputStyle} type="number" step="0.01" min="0" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="Leave blank for 'Price on Request'" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Discount Price (₹)</label>
            <input style={inputStyle} type="number" step="0.01" min="0" value={form.discountPrice} onChange={(e) => set("discountPrice", e.target.value)} placeholder="Optional discount price" />
          </div>
        </div>
      </section>

      {/* Details */}
      <section>
        <h3 style={{ color: "#C9A84C", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>Details</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical", fontFamily: "inherit" }} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the product..." />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Video URL</label>
            <input style={inputStyle} value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://..." />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Occasions</label>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {OCCASIONS.map((occ) => (
                <label key={occ} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: form.occasion.includes(occ) ? "#C9A84C" : "#666", fontSize: "0.9rem", fontWeight: form.occasion.includes(occ) ? 600 : 400 }}>
                  <input type="checkbox" checked={form.occasion.includes(occ)} onChange={() => toggleOccasion(occ)} style={{ accentColor: "#C9A84C", width: "18px", height: "18px", cursor: "pointer" }} />
                  {occ.charAt(0).toUpperCase() + occ.slice(1).replace("-", " ")}
                </label>
              ))}
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#666", fontSize: "0.9rem" }}>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} style={{ accentColor: "#C9A84C", width: "18px", height: "18px", cursor: "pointer" }} />
            Featured product (shown on homepage)
          </label>
        </div>
      </section>

      {/* Images */}
      <section>
        <h3 style={{ color: "#C9A84C", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", fontWeight: 600 }}>Images *</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          {form.imageUrls.map((url, idx) => (
            <div key={idx} style={{ position: "relative", width: "120px", height: "120px" }}>
              <Image src={url} alt={`Product image ${idx + 1}`} fill style={{ objectFit: "cover", borderRadius: "8px", border: idx === 0 ? "2px solid #C9A84C" : "1px solid #E8E8E8" }} />
              <button type="button" onClick={() => removeImage(idx)} style={{ position: "absolute", top: "-8px", right: "-8px", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#e05252", border: "none", color: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>×</button>
              {idx === 0 && <span style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "10px", backgroundColor: "#C9A84C", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>Primary</span>}
            </div>
          ))}
          <label style={{ width: "120px", height: "120px", border: "2px dashed #E8E8E8", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: uploadingImage ? "wait" : "pointer", color: "#999", fontSize: "0.85rem", gap: "0.5rem", backgroundColor: "#FAFAFA", transition: "all 0.2s" }}
            onMouseEnter={(e) => { if (!uploadingImage) e.currentTarget.style.borderColor = "#C9A84C"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E8E8"; }}>
            <span style={{ fontSize: "2rem" }}>{uploadingImage ? "⏳" : "+"}</span>
            <span>{uploadingImage ? "Uploading..." : "Add Image"}</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploadingImage} />
          </label>
        </div>
        <p style={{ color: "#999", fontSize: "0.8rem" }}>First image is the primary image. Max 10MB per image.</p>
      </section>

      {/* Submit */}
      <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #F0F0F0" }}>
        <button type="submit" disabled={loading} style={{ padding: "0.875rem 2.5rem", backgroundColor: loading ? "#ccc" : "#C9A84C", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontSize: "0.95rem", letterSpacing: "0.02em", transition: "all 0.2s" }}>
          {loading ? "Saving..." : mode === "new" ? "Create Product" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} style={{ padding: "0.875rem 2rem", backgroundColor: "#fff", color: "#666", border: "1px solid #E8E8E8", borderRadius: "8px", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600, transition: "all 0.2s" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
