import { db } from "@/lib/mockDb";

export async function getProductBySlug(slug: string) {
  const product = db.products.findBySlug(slug);
  if (!product || product.status !== "active") return null;
  const { purchasePrice: _p, ...safe } = product;
  return safe;
}

export async function getProductById(id: string) {
  const product = db.products.findById(id);
  if (!product) return null;
  const { purchasePrice: _p, ...safe } = product;
  return safe;
}

export async function getRelatedProducts(productId: string, limit = 6) {
  const product = db.products.findById(productId);
  if (!product) return [];
  return db.products.getAll()
    .filter((p) => p.status === "active" && p.id !== productId && (p.category === product.category || p.typeId === product.typeId))
    .slice(0, limit)
    .map(({ purchasePrice: _p, ...rest }) => rest);
}
