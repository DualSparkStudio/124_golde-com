import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  if (startDate) orders = orders.filter((o) => o.createdAt >= startDate);
  if (endDate) orders = orders.filter((o) => o.createdAt <= endDate + "T23:59:59");

  let revenue = 0, purchaseCost = 0, shippingExpenses = 0, gstExpenses = 0, makingChargesExpenses = 0;

  for (const order of orders) {
    revenue += order.totalAmount;
    shippingExpenses += order.shippingCost;
    gstExpenses += order.gstAmount;
    for (const item of order.items) {
      purchaseCost += item.purchasePrice * item.quantity;
      makingChargesExpenses += item.makingCharges * item.quantity;
    }
  }

  const totalExpenses = purchaseCost + shippingExpenses + gstExpenses + makingChargesExpenses;
  const grossProfit = revenue - totalExpenses;
  const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return NextResponse.json({
    summary: { revenue, purchaseCost, shippingExpenses, gstExpenses, makingChargesExpenses, totalExpenses, grossProfit, profitMargin, orderCount: orders.length },
  });
}
