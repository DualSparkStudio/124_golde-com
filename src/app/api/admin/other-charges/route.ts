import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const charges = db.otherCharges.get();
  return NextResponse.json({ charges });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  db.otherCharges.set({
    shippingCost: body.shippingCost ?? 0,
    gstRate: body.gstRate ?? 0,
    otherChargesLabel: body.otherChargesLabel ?? null,
    otherChargesAmount: body.otherChargesAmount ?? 0,
  });
  return NextResponse.json({ charges: db.otherCharges.get() });
}
