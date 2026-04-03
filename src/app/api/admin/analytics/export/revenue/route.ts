import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  if (startDate) orders = orders.filter((o) => o.createdAt >= startDate);
  if (endDate) orders = orders.filter((o) => o.createdAt <= endDate + "T23:59:59");

  const header = "Date,Order Number,Revenue,Purchase Cost,Shipping,GST,Making Charges,Total Expenses,Profit\n";
  const rows = orders.map((o) => {
    const purchaseCost = o.items.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
    const makingCharges = o.items.reduce((s, i) => s + i.makingCharges * i.quantity, 0);
    const totalExpenses = purchaseCost + o.shippingCost + o.gstAmount + makingCharges;
    const profit = o.totalAmount - totalExpenses;
    return [o.createdAt.slice(0, 10), o.orderNumber, o.totalAmount, purchaseCost, o.shippingCost, o.gstAmount, makingCharges, totalExpenses, profit].join(",");
  }).join("\n");

  return new NextResponse(header + rows, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="revenue.csv"` },
  });
}
