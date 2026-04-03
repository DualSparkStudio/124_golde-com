import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const typeId = searchParams.get("typeId") ?? undefined;
  const priceMin = searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : undefined;
  const priceMax = searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : undefined;
  const weightMin = searchParams.get("weightMin") ? parseFloat(searchParams.get("weightMin")!) : undefined;
  const weightMax = searchParams.get("weightMax") ? parseFloat(searchParams.get("weightMax")!) : undefined;
  const occasion = searchParams.get("occasion") ?? undefined;
  const query = searchParams.get("query") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = Math.min(parseInt(searchParams.get("pageSize") ?? "20"), 100);

  let products = db.products.getAll().filter((p) => p.status === "active");

  if (category) products = products.filter((p) => p.category === category);
  if (typeId) products = products.filter((p) => p.typeId === typeId);
  if (priceMin !== undefined) products = products.filter((p) => p.salePrice !== null && p.salePrice >= priceMin);
  if (priceMax !== undefined) products = products.filter((p) => p.salePrice !== null && p.salePrice <= priceMax);
  if (weightMin !== undefined) products = products.filter((p) => p.weight >= weightMin);
  if (weightMax !== undefined) products = products.filter((p) => p.weight <= weightMax);
  if (occasion) products = products.filter((p) => p.occasion.includes(occasion));
  if (query) {
    const q = query.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
  }

  switch (sortBy) {
    case "price-asc": products.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0)); break;
    case "price-desc": products.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0)); break;
    case "weight-asc": products.sort((a, b) => a.weight - b.weight); break;
    default: products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = products.length;
  const items = products.slice((page - 1) * pageSize, page * pageSize).map(({ purchasePrice: _p, ...rest }) => ({
    ...rest,
    primaryImage: rest.images.find((i) => i.isPrimary) ?? rest.images[0] ?? null,
  }));

  return NextResponse.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
