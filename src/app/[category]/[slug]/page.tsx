import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/productDetail";
import Navbar from "@/components/Navbar";
import ProductImageGallery from "@/components/ProductImageGallery";
import PriceRequestForm from "@/components/PriceRequestForm";
import AppointmentForm from "@/components/AppointmentForm";
import ProductGrid from "@/components/ProductGrid";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 300;

interface PageProps { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getProductBySlug(slug);
    if (!p) return { title: "Product Not Found | Lumière Jewels" };
    return { title: `${p.name} | Lumière Jewels`, description: p.description ?? `${p.name} — ${p.weight}gm ${p.purity} jewelry.` };
  } catch { return { title: "Lumière Jewels" }; }
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  let product;
  try { product = await getProductBySlug(slug); } catch { notFound(); }
  if (!product) notFound();

  let related: Awaited<ReturnType<typeof getRelatedProducts>> = [];
  try { related = await getRelatedProducts(product.id, 4); } catch {}

  const displayPrice = product.discountPrice ?? product.salePrice;
  const hasDiscount = product.discountPrice != null && product.salePrice != null;
  const isPOR = product.salePrice == null;

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        {/* Spacer for fixed navbar */}
        <div style={{ height: "100px" }} />

        {/* Breadcrumb */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 24px", fontSize: "0.8rem", color: "#999", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#C9A84C", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href={`/${category}`} style={{ color: "#C9A84C", textDecoration: "none" }}>{cap(category)} Jewelry</Link>
          <span>›</span>
          <span style={{ color: "#555" }}>{product.name}</span>
        </div>

        {/* Product layout */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "64px" }}>
          {/* Gallery */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div style={{ paddingTop: "8px" }}>
            {/* Category badge */}
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 14px", backgroundColor: product.category === "gold" ? "rgba(201,168,76,0.12)" : "rgba(160,160,160,0.12)", border: `1px solid ${product.category === "gold" ? "rgba(201,168,76,0.3)" : "rgba(160,160,160,0.3)"}`, borderRadius: "20px", color: product.category === "gold" ? "#B8860B" : "#666", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cap(product.category)}
              </span>
              <span style={{ padding: "4px 14px", backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", color: "#B8860B", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {product.purity}
              </span>
            </div>

            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#0A0A0A", margin: "0 0 24px", lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: "1px solid #f0f0f0" }}>
              {isPOR ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 24px", border: "1px solid #C9A84C", borderRadius: "4px", color: "#B8860B", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                  <span>✦</span> Price on Request
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>₹{displayPrice!.toLocaleString("en-IN")}</span>
                  {hasDiscount && <span style={{ fontSize: "1.1rem", color: "#bbb", textDecoration: "line-through" }}>₹{product.salePrice!.toLocaleString("en-IN")}</span>}
                  {hasDiscount && <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4caf7d", backgroundColor: "rgba(76,175,125,0.1)", padding: "3px 10px", borderRadius: "20px" }}>
                    {Math.round((1 - product.discountPrice! / product.salePrice!) * 100)}% OFF
                  </span>}
                </div>
              )}
            </div>

            {/* Specs grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", backgroundColor: "#f0f0f0", border: "1px solid #f0f0f0", borderRadius: "8px", overflow: "hidden", marginBottom: "28px" }}>
              {[
                { label: "Weight", value: `${product.weight}gm`, icon: "⚖️" },
                { label: "Purity", value: product.purity, icon: "✦" },
                { label: "Category", value: cap(product.category), icon: "💎" },
                { label: "Availability", value: product.quantity > 0 ? "In Stock" : "Made to Order", icon: product.quantity > 0 ? "✅" : "🔔" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ backgroundColor: "#fff", padding: "16px 20px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.7rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>{icon} {label}</p>
                  <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#0A0A0A" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Occasions */}
            {product.occasion.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.75rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>Perfect For</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.occasion.map((occ) => (
                    <span key={occ} style={{ padding: "5px 14px", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", fontSize: "0.78rem", color: "#B8860B", textTransform: "capitalize" }}>
                      {occ.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: "32px", padding: "20px", backgroundColor: "#FAFAFA", borderRadius: "8px", borderLeft: "3px solid #C9A84C" }}>
                <p style={{ margin: "0 0 6px", fontSize: "0.7rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>About this piece</p>
                <p style={{ margin: 0, color: "#444", fontSize: "0.95rem", lineHeight: 1.8 }}>{product.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px", padding: "16px", backgroundColor: "#FFF8F0", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.15)" }}>
              {["🏅 BIS Hallmarked", "🔄 Lifetime Exchange", "🚚 Free Shipping", "↩️ Easy Returns"].map((b) => (
                <span key={b} style={{ fontSize: "0.78rem", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>{b}</span>
              ))}
            </div>

            {/* CTA */}
            {isPOR ? (
              <PriceRequestForm productId={product.id} productName={product.name} />
            ) : (
              <button style={{ width: "100%", padding: "16px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", marginBottom: "12px" }}>
                Add to Cart
              </button>
            )}
            <AppointmentForm />
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ padding: "80px 24px", backgroundColor: "#FFF8F0", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>You May Also Like</p>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>Related Pieces</h2>
              </div>
              <ProductGrid products={related} />
            </div>
          </section>
        )}

        <SiteFooter />
      </main>
    </>
  );
}
