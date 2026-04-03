import { db } from "@/lib/mockDb";

export async function exportOrdersCSV(filters?: { status?: string; startDate?: string; endDate?: string }) {
  let orders = db.orders.getAll();
  if (filters?.status) orders = orders.filter((o) => o.status === filters.status);
  if (filters?.startDate) orders = orders.filter((o) => o.createdAt >= filters.startDate!);
  if (filters?.endDate) orders = orders.filter((o) => o.createdAt <= filters.endDate! + "T23:59:59");

  const header = "Order Number,Customer,Phone,Items,Subtotal,Shipping,GST,Total,Status,Date";
  const rows = orders.map((o) =>
    [o.orderNumber, o.customerName, o.customerPhone, o.items.length, o.subtotal, o.shippingCost, o.gstAmount, o.totalAmount, o.status, o.createdAt.slice(0, 10)].join(",")
  );
  return [header, ...rows].join("\n");
}

export async function exportRevenueCSV(period?: { startDate?: string; endDate?: string }) {
  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  if (period?.startDate) orders = orders.filter((o) => o.createdAt >= period.startDate!);
  if (period?.endDate) orders = orders.filter((o) => o.createdAt <= period.endDate! + "T23:59:59");

  const header = "Date,Order Number,Revenue,Purchase Cost,Shipping,GST,Making Charges,Total Expenses,Profit";
  const rows = orders.map((o) => {
    const purchaseCost = o.items.reduce((s, i) => s + i.purchasePrice * i.quantity, 0);
    const makingCharges = o.items.reduce((s, i) => s + i.makingCharges * i.quantity, 0);
    const totalExpenses = purchaseCost + o.shippingCost + o.gstAmount + makingCharges;
    return [o.createdAt.slice(0, 10), o.orderNumber, o.totalAmount, purchaseCost, o.shippingCost, o.gstAmount, makingCharges, totalExpenses, o.totalAmount - totalExpenses].join(",");
  });
  return [header, ...rows].join("\n");
}
