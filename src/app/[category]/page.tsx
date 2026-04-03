import type { Metadata } from "next";
import Link from "next/link";
import { getFilteredProducts } from "@/services/productCatalog";
import Navbar from "@/components/Navbar";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import PageHero from "@/components/PageHero";
import SiteFooter from "@/components/SiteFooter";
import type { JewelryCategory, SortBy } from "@/types";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const CATEGORY_META: Record<string, { tag: string; subtitle: string; image: string }> = {
  gold: {
    tag: "22K & 24K Gold",
    subtitle: "Discover our exquisite gold jewelry collection — BIS Hallmark certified, crafted for every occasion.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1600&q=80",
  },
  silver: {
    tag: "925 Sterling Silver",
    subtitle: "Elegant 925 sterling silver pieces — timeless designs for the modern woman.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80",
  },
  bridal: {
    tag: "Bridal Collection",
    subtitle: "Make your special day unforgettable with our curated bridal jewelry sets.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80",
  },
};

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${cap(category)} Jewelry | Lumière Jewels`,
    description: CATEGORY_META[category]?.subtitle ?? `Browse our ${category} jewelry collection.`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const sp = await searchParams;
  const sp1 = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : v; };

  const filters = {
    category: ["gold", "silver", "bridal"].includes(category) ? (category as JewelryCategory) : undefined,
    typeId: sp1("typeId"),
    priceMin: sp1("priceMin") ? Number(sp1("priceMin")) : undefined,
    priceMax: sp1("priceMax") ? Number(sp1("priceMax")) : undefined,
    weightMin: sp1("weightMin") ? Number(sp1("weightMin")) : undefined,
    weightMax: sp1("weightMax") ? Number(sp1("weightMax")) : undefined,
    occasion: sp1("occasion"),
    sortBy: (sp1("sortBy") as SortBy) ?? "newest",
  };

  const page = Number(sp1("page") ?? "1");
  let result = { items: [] as Awaited<ReturnType<typeof getFilteredProducts>>["items"], total: 0, totalPages: 0, page: 1, pageSize: 12 };
  try { result = await getFilteredProducts(filters, { page, pageSize: 12 }); } catch {}

  const meta = CATEGORY_META[category] ?? { tag: "Collection", subtitle: "", image: "" };

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <PageHero tag={meta.tag} title={`${cap(category)} Jewelry`} subtitle={meta.subtitle} image={meta.image} />

        {/* Breadcrumb */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 32px 0", fontSize: "0.82rem", color: "#999", display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <span style={{ color: "#ddd" }}>›</span>
          <span style={{ color: "#555" }}>{cap(category)} Jewelry</span>
        </div>

        {/* Main layout */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 32px 100px", display: "flex", gap: "40px", alignItems: "flex-start" }}>
          <FilterSidebar category={category} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Results bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "20px", borderBottom: "2px solid #f5f5f5" }}>
              <div>
                <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.3rem", color: "#0A0A0A", fontWeight: 600 }}>{cap(category)} Jewelry</span>
                <span style={{ color: "#999", fontSize: "0.875rem", marginLeft: "12px" }}>({result.total} {result.total === 1 ? "piece" : "pieces"})</span>
              </div>
            </div>

            {result.items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.3 }}>✦</div>
                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.4rem", color: "#0A0A0A", margin: "0 0 12px" }}>No pieces found</h3>
                <p style={{ color: "#888", fontSize: "0.95rem", margin: "0 0 24px" }}>Try adjusting your filters to discover more jewelry.</p>
                <Link href={`/${category}`} style={{ display: "inline-block", padding: "12px 32px", border: "1px solid #C9A84C", color: "#C9A84C", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "4px" }}>
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "28px" }}>
                {result.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "60px", flexWrap: "wrap" }}>
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
                  const ps = new URLSearchParams();
                  Object.entries(sp).forEach(([k, v]) => { if (v && k !== "page") ps.set(k, Array.isArray(v) ? v[0] : v); });
                  ps.set("page", String(p));
                  return (
                    <Link key={p} href={`/${category}?${ps}`} style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "42px", height: "42px", borderRadius: "6px",
                      border: p === page ? "none" : "1px solid #e8e8e8",
                      color: p === page ? "#fff" : "#555",
                      backgroundColor: p === page ? "#C9A84C" : "#fff",
                      textDecoration: "none", fontSize: "0.875rem", fontWeight: p === page ? 700 : 400,
                      boxShadow: p === page ? "0 4px 12px rgba(201,168,76,0.3)" : "none",
                    }}>{p}</Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
