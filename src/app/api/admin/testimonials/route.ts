import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  return NextResponse.json({ testimonials: db.testimonials.getAll() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.customerName || !body.content) return NextResponse.json({ error: "Name and content required" }, { status: 400 });
  const all = db.testimonials.getAll();
  const t = db.testimonials.create({
    customerName: body.customerName,
    location: body.location ?? null,
    rating: body.rating ?? 5,
    content: body.content,
    productId: body.productId ?? null,
    imageUrl: body.imageUrl ?? null,
    isPublished: body.isPublished ?? false,
    sortOrder: all.length + 1,
  });
  return NextResponse.json({ testimonial: t }, { status: 201 });
}
