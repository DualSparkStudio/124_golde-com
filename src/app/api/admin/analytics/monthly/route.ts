import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

  const orders = db.orders.getAll().filter((o) => {
    return o.status === "delivered" && new Date(o.createdAt).getFullYear() === year;
  });

  const byMonth: Record<number, { revenue: number; expenses: number }> = {};
  for (let m = 0; m < 12; m++) byMonth[m] = { revenue: 0, expenses: 0 };

  for (const order of orders) {
    const m = new Date(order.createdAt).getMonth();
    byMonth[m].revenue += order.totalAmount;
    const exp = order.shippingCost + order.gstAmount + order.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
    byMonth[m].expenses += exp;
  }

  const monthly = Object.entries(byMonth).map(([m, { revenue, expenses }]) => ({
    month: MONTH_NAMES[parseInt(m)],
    revenue,
    profit: revenue - expenses,
  }));

  return NextResponse.json({ monthly });
}
