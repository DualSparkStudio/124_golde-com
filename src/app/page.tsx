import Link from "next/link";
import { getFilteredProducts } from "@/services/productCatalog";
import Navbar from "@/components/Navbar";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import LuxuryHero from "@/components/LuxuryHero";
import CategoryTiles from "@/components/CategoryTiles";
import ProductGrid from "@/components/ProductGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 300;

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof getFilteredProducts>>["items"] = [];
  let goldProducts: Awaited<ReturnType<typeof getFilteredProducts>>["items"] = [];
  let silverProducts: Awaited<ReturnType<typeof getFilteredProducts>>["items"] = [];

  try {
    const [all, gold, silver] = await Promise.all([
      getFilteredProducts({ isFeatured: true } as never, { page: 1, pageSize: 8 }),
      getFilteredProducts({ category: "gold" } as never, { page: 1, pageSize: 4 }),
      getFilteredProducts({ category: "silver" } as never, { page: 1, pageSize: 4 }),
    ]);
    featured = all.items.length ? all.items : (await getFilteredProducts({}, { page: 1, pageSize: 8 })).items;
    goldProducts = gold.items;
    silverProducts = silver.items;
  } catch { /* DB not available */ }

  return (
    <>
      <Navbar />
      <ExitIntentPopup />

      <main>
        {/* ── Luxury Hero Section ── */}
        <LuxuryHero />

        {/* ── Category Tiles ── */}
        <CategoryTiles />

        {/* ── Featured Products ── */}
        {featured.length > 0 && (
          <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Handpicked for You</p>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "#0A0A0A", margin: "0 0 12px" }}>
                  Featured Products
                </h2>
                <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>Handpicked selections from our collection</p>
              </div>
              <ProductGrid products={featured} />
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Link href="/shop" style={{ display: "inline-block", padding: "14px 40px", border: "1px solid #C9A84C", color: "#C9A84C", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "2px" }}>
                  View All
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Gold Collection ── */}
        {goldProducts.length > 0 && (
          <section style={{ padding: "80px 24px", backgroundColor: "#FFF8F0" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>22K & 24K</p>
                  <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>Gold Collection</h2>
                </div>
                <Link href="/shop?category=gold" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>
                  View All →
                </Link>
              </div>
              <ProductGrid products={goldProducts} />
            </div>
          </section>
        )}

        {/* ── Silver Collection ── */}
        {silverProducts.length > 0 && (
          <section style={{ padding: "80px 24px", backgroundColor: "#fff" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <p style={{ color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>925 Sterling</p>
                  <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#0A0A0A", margin: 0 }}>Silver Collection</h2>
                </div>
                <Link href="/shop?category=silver" style={{ color: "#C9A84C", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px" }}>
                  View All →
                </Link>
              </div>
              <ProductGrid products={silverProducts} />
            </div>
          </section>
        )}

        {/* ── Why Choose Us ── */}
        <WhyChooseUs />

        {/* ── Testimonials ── */}
        <TestimonialsCarousel />

        {/* ── Footer ── */}
        <SiteFooter />
      </main>
    </>
  );
}
