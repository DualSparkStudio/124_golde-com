import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  let orders = db.merchantOrders.getAll();
  if (dateFrom) orders = orders.filter((o) => o.purchaseDate >= dateFrom);
  if (dateTo) orders = orders.filter((o) => o.purchaseDate <= dateTo);
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.merchantName) return NextResponse.json({ error: "Merchant name required" }, { status: 400 });

  const order = db.merchantOrders.create({
    merchantName: body.merchantName,
    invoiceNumber: body.invoiceNumber ?? null,
    items: body.items ?? [],
    totalWeight: body.totalWeight ?? 0,
    totalCost: body.totalCost ?? 0,
    purity: body.purity ?? "22K",
    purchaseDate: body.purchaseDate ?? new Date().toISOString().slice(0, 10),
    notes: body.notes ?? null,
  });
  return NextResponse.json({ order }, { status: 201 });
}
