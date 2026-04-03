import { db } from "@/lib/mockDb";

export async function logMerchantOrder(data: {
  merchantName: string;
  invoiceNumber?: string | null;
  items: { description: string; weight: number; ratePerGram: number; makingCharges: number; amount: number }[];
  totalWeight: number;
  totalCost: number;
  purity: string;
  purchaseDate: string;
  notes?: string | null;
}) {
  return db.merchantOrders.create({
    merchantName: data.merchantName,
    invoiceNumber: data.invoiceNumber ?? null,
    items: data.items.map((item) => ({ ...item, id: crypto.randomUUID(), merchantOrderId: "" })),
    totalWeight: data.totalWeight,
    totalCost: data.totalCost,
    purity: data.purity,
    purchaseDate: data.purchaseDate,
    notes: data.notes ?? null,
  });
}

export async function getMerchantOrders(filters?: { dateFrom?: string; dateTo?: string }) {
  let orders = db.merchantOrders.getAll();
  if (filters?.dateFrom) orders = orders.filter((o) => o.purchaseDate >= filters.dateFrom!);
  if (filters?.dateTo) orders = orders.filter((o) => o.purchaseDate <= filters.dateTo!);
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateMerchantOrder(id: string, data: Record<string, unknown>) {
  return db.merchantOrders.update(id, data as never);
}
