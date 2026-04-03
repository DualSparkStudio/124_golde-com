import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = db.products.findBySlug(slug);
  if (!product || product.status !== "active") {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  const { purchasePrice: _p, ...safe } = product;
  return NextResponse.json({ product: safe });
}
