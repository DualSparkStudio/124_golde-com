import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const types = db.types.getAll().filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({ types });
}
