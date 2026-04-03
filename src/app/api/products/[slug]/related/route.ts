import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = db.products.findBySlug(slug);
  if (!product) return NextResponse.json({ products: [] });

  const related = db.products.getAll()
    .filter((p) => p.status === "active" && p.id !== product.id && (p.category === product.category || p.typeId === product.typeId))
    .slice(0, 6)
    .map(({ purchasePrice: _p, ...rest }) => rest);

  return NextResponse.json({ products: related });
}
