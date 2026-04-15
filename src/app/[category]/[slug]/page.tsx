import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/productDetail";
import Navbar from "@/components/Navbar";
import ProductImageGallery from "@/components/ProductImageGallery";
import PriceRequestForm from "@/components/PriceRequestForm";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter";
import ProductActions from "@/components/ProductActions";
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_IMAGES, PRODUCT_IMAGE_OVERRIDES, pickFrom } from "@/constants/images";
import { isValidRemoteImageUrl } from "@/utils/images";

export const revalidate = 300;

interface PageProps { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getProductBySlug(slug);
    if (!p) return { title: "Product Not Found | Lumière Jewels" };
    return {
      title: `${p.name} | Lumière Jewels`,
      description: p.description ?? `${p.name} — ${p.weight}gm ${p.purity} jewelry. BIS Hallmark certified.`,
    };
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
  const fallbackDetail = pickFrom(DEFAULT_PRODUCT_IMAGES, product.id || product.name || product.slug);
  const nameKey = (product.name || product.slug || "").toLowerCase();
  const override = PRODUCT_IMAGE_OVERRIDES[nameKey];
  const primaryFromImages = product.images?.find((i: { isPrimary: boolean }) => i.isPrimary)?.url ?? product.images?.[0]?.url;
  const candidatePrimary = override ?? primaryFromImages ?? null;
  const primaryImage = (isValidRemoteImageUrl(candidatePrimary) ? candidatePrimary : fallbackDetail) ?? DEFAULT_PRODUCT_IMAGE;

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", animation: "fadeInUp 300ms ease" }}>
        <div style={{ height: "88px" }} />

        {/* Breadcrumb */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px clamp(16px, 4vw, 32px)", fontSize: "0.8rem", color: "#999", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <Link href="/shop" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>Shop</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <Link href={`/shop?category=${category}`} style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>{cap(category)}</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <span style={{ color: "#555" }}>{product.name}</span>
        </div>

        {/* Product layout */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px) 90px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(32px, 6vw, 64px)" }}>
          {/* Gallery */}
          <ProductImageGallery images={product.images} productName={product.name} />

          {/* Details */}
          <div style={{ paddingTop: "8px" }}>
            {/* Badges */}
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 14px", backgroundColor: product.category === "gold" ? "rgba(201,168,76,0.1)" : "rgba(160,160,160,0.1)", border: `1px solid ${product.category === "gold" ? "rgba(201,168,76,0.3)" : "rgba(160,160,160,0.3)"}`, borderRadius: "20px", color: product.category === "gold" ? "#B8860B" : "#666", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {cap(product.category)}
              </span>
              <span style={{ padding: "4px 14px", backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", color: "#B8860B", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {product.purity}
              </span>
              {product.isFeatured && (
                <span style={{ padding: "4px 14px", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "20px", color: "#B8860B", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ✦ Featured
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: "#0A0A0A", margin: "0 0 24px", lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid #F5F5F5" }}>
              {isPOR ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 24px", border: "1px solid #C9A84C", borderRadius: "8px", color: "#B8860B", fontSize: "0.9rem", fontWeight: 600 }}>
                  <span>✦</span> Price on Request
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "2.4rem", fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>
                    ₹{displayPrice!.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <>
                      <span style={{ fontSize: "1.1rem", color: "#bbb", textDecoration: "line-through" }}>₹{product.salePrice!.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#4caf7d", backgroundColor: "rgba(76,175,125,0.1)", padding: "4px 10px", borderRadius: "20px" }}>
                        {Math.round((1 - product.discountPrice! / product.salePrice!) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", backgroundColor: "#F5F5F5", border: "1px solid #F5F5F5", borderRadius: "12px", overflow: "hidden", marginBottom: "26px" }}>
              {[
                { label: "Weight", value: `${product.weight}gm`, icon: "⚖️" },
                { label: "Purity", value: product.purity, icon: "✦" },
                { label: "Category", value: cap(product.category), icon: "💎" },
                { label: "Availability", value: product.quantity > 0 ? `In Stock (${product.quantity})` : "Made to Order", icon: product.quantity > 0 ? "✅" : "🔔" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ backgroundColor: "#fff", padding: "16px 20px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "0.68rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>{icon} {label}</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#0A0A0A" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Occasions */}
            {product.occasion?.length > 0 && (
              <div style={{ marginBottom: "22px" }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.7rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>Perfect For</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.occasion.map((occ: string) => (
                    <span key={occ} style={{ padding: "5px 14px", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "20px", fontSize: "0.78rem", color: "#B8860B", textTransform: "capitalize" }}>
                      {occ.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: "28px", padding: "22px", backgroundColor: "#FAFAFA", borderRadius: "10px", borderLeft: "3px solid #C9A84C" }}>
                <p style={{ margin: "0 0 6px", fontSize: "0.7rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>About this piece</p>
                <p style={{ margin: 0, color: "#444", fontSize: "0.95rem", lineHeight: 1.8 }}>{product.description}</p>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px", padding: "14px 16px", backgroundColor: "#FFF8F0", borderRadius: "10px", border: "1px solid rgba(201,168,76,0.15)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              {["🏅 BIS Hallmarked", "🔄 Lifetime Exchange", "🚚 Free Shipping", "↩️ Easy Returns"].map((b) => (
                <span key={b} style={{ fontSize: "0.78rem", color: "#666" }}>{b}</span>
              ))}
            </div>

            {/* Actions — client component for cart/wishlist */}
            {isPOR ? (
              <PriceRequestForm productId={product.id} productName={product.name} />
            ) : (
              <ProductActions
                productId={product.id}
                name={product.name}
                price={displayPrice}
                image={primaryImage}
                weight={product.weight}
                purity={product.purity}
                slug={product.slug}
                category={product.category}
              />
            )}

            {/* CTA moved to Contact page; no inline button here */}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(16px, 4vw, 32px)", backgroundColor: "#FFF8F0", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 10px" }}>You May Also Like</p>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>Related Pieces</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
                {related.map((p) => <ProductCard key={p.id} product={p as never} />)}
              </div>
            </div>
          </section>
        )}

        <SiteFooter />
      </main>
    </>
  );
}
