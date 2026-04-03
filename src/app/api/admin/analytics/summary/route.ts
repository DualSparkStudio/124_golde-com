import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  // Revenue from delivered customer orders
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

  // Merchant order costs (admin's procurement expenses) — included in total expenses
  let merchantOrders = db.merchantOrders.getAll();
  if (startDate) merchantOrders = merchantOrders.filter((o) => o.purchaseDate >= startDate.slice(0, 10));
  if (endDate) merchantOrders = merchantOrders.filter((o) => o.purchaseDate <= endDate.slice(0, 10));
  const merchantExpenses = merchantOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const merchantWeight = merchantOrders.reduce((sum, o) => sum + o.totalWeight, 0);

  const totalExpenses = purchaseCost + shippingExpenses + gstExpenses + makingChargesExpenses + merchantExpenses;
  const grossProfit = revenue - totalExpenses;
  const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return NextResponse.json({
    summary: {
      revenue,
      purchaseCost,
      shippingExpenses,
      gstExpenses,
      makingChargesExpenses,
      merchantExpenses,
      merchantWeight,
      totalExpenses,
      grossProfit,
      profitMargin,
      orderCount: orders.length,
      merchantOrderCount: merchantOrders.length,
    },
  });
}
