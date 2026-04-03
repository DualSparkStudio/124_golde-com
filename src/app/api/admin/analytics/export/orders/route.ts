import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  let orders = db.orders.getAll();
  if (status) orders = orders.filter((o) => o.status === status);
  if (startDate) orders = orders.filter((o) => o.createdAt >= startDate);
  if (endDate) orders = orders.filter((o) => o.createdAt <= endDate + "T23:59:59");

  const header = "Order Number,Customer,Phone,Items,Subtotal,Shipping,GST,Total,Status,Date\n";
  const rows = orders.map((o) =>
    [o.orderNumber, o.customerName, o.customerPhone, o.items.length, o.subtotal, o.shippingCost, o.gstAmount, o.totalAmount, o.status, o.createdAt.slice(0, 10)].join(",")
  ).join("\n");

  return new NextResponse(header + rows, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="orders.csv"` },
  });
}
