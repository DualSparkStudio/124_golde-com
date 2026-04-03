import { db } from "@/lib/mockDb";
import type { ProductFilters, Pagination, ProductListResult, JewelryType } from "@/types";

export async function invalidateProductCache(): Promise<void> {
  // No-op in mock mode
}

export async function getFilteredProducts(
  filters: ProductFilters,
  pagination: Pagination,
): Promise<ProductListResult> {
  let products = db.products.getAll().filter((p) => p.status === "active");

  if (filters.category) products = products.filter((p) => p.category === filters.category);
  if (filters.typeId) products = products.filter((p) => p.typeId === filters.typeId);
  if (filters.priceMin !== undefined) products = products.filter((p) => p.salePrice !== null && p.salePrice >= filters.priceMin!);
  if (filters.priceMax !== undefined) products = products.filter((p) => p.salePrice !== null && p.salePrice <= filters.priceMax!);
  if (filters.weightMin !== undefined) products = products.filter((p) => p.weight >= filters.weightMin!);
  if (filters.weightMax !== undefined) products = products.filter((p) => p.weight <= filters.weightMax!);
  if (filters.occasion) products = products.filter((p) => p.occasion.includes(filters.occasion!));
  if (filters.query?.trim()) {
    const q = filters.query.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
  }

  switch (filters.sortBy) {
    case "price-asc": products.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0)); break;
    case "price-desc": products.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0)); break;
    case "weight-asc": products.sort((a, b) => a.weight - b.weight); break;
    default: products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = products.length;
  const items = products
    .slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
    .map(({ purchasePrice: _p, ...rest }) => ({
      ...rest,
      primaryImage: rest.images.find((i) => i.isPrimary) ?? rest.images[0] ?? null,
    }));

  return { items: items as never, total, page: pagination.page, pageSize: pagination.pageSize, totalPages: Math.ceil(total / pagination.pageSize) };
}

export async function getActiveTypes(): Promise<JewelryType[]> {
  return db.types.getAll().filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder) as JewelryType[];
}
