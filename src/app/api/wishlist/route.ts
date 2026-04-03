import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

const GUEST_USER = "guest";

export async function GET() {
  const items = db.wishlist.getForUser(GUEST_USER);
  const products = items.map((w) => {
    const p = db.products.findById(w.productId);
    if (!p) return null;
    const { purchasePrice: _pp, ...safe } = p;
    return { ...w, product: safe };
  }).filter(Boolean);
  return NextResponse.json({ items: products, count: products.length });
}

export async function POST(req: NextRequest) {
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const item = db.wishlist.add(GUEST_USER, productId);
  return NextResponse.json({ item, count: db.wishlist.getForUser(GUEST_USER).length });
}

export async function DELETE(req: NextRequest) {
  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  db.wishlist.remove(GUEST_USER, productId);
  return NextResponse.json({ count: db.wishlist.getForUser(GUEST_USER).length });
}
