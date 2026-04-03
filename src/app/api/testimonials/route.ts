import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const testimonials = db.testimonials.getAll().filter((t) => t.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ testimonials });
}
