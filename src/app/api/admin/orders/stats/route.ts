import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const orders = db.orders.getAll();
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.totalAmount, 0),
  };
  
  console.log('Stats:', stats);
  
  return NextResponse.json(stats);
}
