import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";
import { v4 as uuidv4 } from "uuid";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = db.products.findById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = { ...body };
  if (body.imageIds) {
    updates.images = (body.imageIds as string[]).map((url: string, i: number) => ({ id: uuidv4(), productId: id, publicId: url, url, isPrimary: i === 0, sortOrder: i }));
    delete updates.imageIds;
    delete updates.imageUrls;
  }
  const product = db.products.update(id, updates as never);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = db.products.delete(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
