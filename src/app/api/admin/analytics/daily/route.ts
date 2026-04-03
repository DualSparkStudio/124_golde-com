import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  if (startDate) orders = orders.filter((o) => o.createdAt >= startDate);
  if (endDate) orders = orders.filter((o) => o.createdAt <= endDate + "T23:59:59");

  const byDay: Record<string, { revenue: number; expenses: number }> = {};
  for (const order of orders) {
    const date = order.createdAt.slice(0, 10);
    if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0 };
    byDay[date].revenue += order.totalAmount;
    const exp = order.shippingCost + order.gstAmount + order.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
    byDay[date].expenses += exp;
  }

  const daily = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { revenue, expenses }]) => ({ date, revenue, profit: revenue - expenses }));

  return NextResponse.json({ daily });
}
