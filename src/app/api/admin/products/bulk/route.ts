import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function PATCH(req: NextRequest) {
  const { ids, status } = await req.json();
  if (!ids?.length || !status) return NextResponse.json({ error: "ids and status required" }, { status: 400 });
  let count = 0;
  for (const id of ids) {
    const updated = db.products.update(id, { status });
    if (updated) count++;
  }
  return NextResponse.json({ count });
}
