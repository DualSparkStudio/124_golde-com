import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const priceMin = searchParams.get("priceMin") ? parseFloat(searchParams.get("priceMin")!) : undefined;
  const priceMax = searchParams.get("priceMax") ? parseFloat(searchParams.get("priceMax")!) : undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let orders = db.orders.getAll();
  if (status) orders = orders.filter((o) => o.status === status);
  if (dateFrom) orders = orders.filter((o) => o.createdAt >= dateFrom);
  if (dateTo) orders = orders.filter((o) => o.createdAt <= dateTo + "T23:59:59");
  if (priceMin !== undefined) orders = orders.filter((o) => o.totalAmount >= priceMin);
  if (priceMax !== undefined) orders = orders.filter((o) => o.totalAmount <= priceMax);

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = orders.length;
  const items = orders.slice((page - 1) * pageSize, page * pageSize);
  return NextResponse.json({ orders: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
