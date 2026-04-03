import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const order = db.merchantOrders.update(id, body);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
