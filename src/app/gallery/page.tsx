import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import { getFilteredProducts } from "@/services/productCatalog";

export const metadata = {
  title: "Gallery | Lumière Jewels",
  description: "Browse a visual gallery of our handcrafted gold and silver jewelry.",
};

export default async function GalleryPage() {
  // Reuse catalog service to get a larger set of images
  let items: Awaited<ReturnType<typeof getFilteredProducts>>["items"] = [];
  try {
    const res = await getFilteredProducts({}, { page: 1, pageSize: 24 });
    items = res.items;
  } catch { /* ignore if DB not ready */ }

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#fff", minHeight: "100vh", animation: "fadeInUp 300ms ease" }}>
        {/* Hero */}
        <div style={{ position: "relative", paddingTop: "150px", paddingBottom: "70px", textAlign: "center", backgroundColor: "#0A0A0A", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1600&q=80" alt="" aria-hidden="true"
               style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.4))" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "18px" }}>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
              <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Visual Showcase</span>
              <div style={{ width: "48px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2.2rem, 5vw, 3.2rem)", color: "#FFF8F0", margin: "0 0 10px" }}>
              Gallery
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>A curated look at our latest designs</p>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to bottom, transparent, #fff)" }} />
        </div>

        {/* Grid */}
        <section style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            {items.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>No items to display yet.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
                {items.map((p) => (
                  <ProductCard key={p.id} product={p as never} />
                ))}
              </div>
            )}
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}

