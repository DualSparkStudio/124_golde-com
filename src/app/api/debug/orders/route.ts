import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const orders = db.orders.getAll();
  
  return NextResponse.json({
    totalOrders: orders.length,
    orders: orders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
    })),
  });
}
