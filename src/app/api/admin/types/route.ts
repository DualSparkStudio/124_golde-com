import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const types = db.types.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ types });
}

export async function POST(req: NextRequest) {
  const { name, category } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const all = db.types.getAll();
  const type = db.types.create({ name, slug, category: category ?? "both", isActive: true, sortOrder: all.length + 1 });
  return NextResponse.json({ type }, { status: 201 });
}
