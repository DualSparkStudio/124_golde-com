import { db } from "@/lib/mockDb";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function getOrders(filters: { status?: string; dateFrom?: string; dateTo?: string }, pagination: { page: number; pageSize: number }) {
  let orders = db.orders.getAll();
  if (filters.status) orders = orders.filter((o) => o.status === filters.status);
  if (filters.dateFrom) orders = orders.filter((o) => o.createdAt >= filters.dateFrom!);
  if (filters.dateTo) orders = orders.filter((o) => o.createdAt <= filters.dateTo! + "T23:59:59");
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const total = orders.length;
  const items = orders.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize);
  return { orders: items, total, page: pagination.page, pageSize: pagination.pageSize, totalPages: Math.ceil(total / pagination.pageSize) };
}

export async function getOrderById(id: string) {
  return db.orders.findById(id);
}

export async function updateOrderStatus(id: string, newStatus: string) {
  const order = db.orders.findById(id);
  if (!order) throw new Error("Order not found");
  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) throw new Error(`Invalid transition: ${order.status} → ${newStatus}`);
  return db.orders.update(id, { status: newStatus as never });
}

export async function getOrderStats() {
  const orders = db.orders.getAll();
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.totalAmount, 0),
  };
}
