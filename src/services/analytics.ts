import { db } from "@/lib/mockDb";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function getRevenueSummary(period: { startDate: string; endDate: string }) {
  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  orders = orders.filter((o) => o.createdAt >= period.startDate && o.createdAt <= period.endDate + "T23:59:59");

  let revenue = 0, purchaseCost = 0, shippingExpenses = 0, gstExpenses = 0, makingChargesExpenses = 0;
  for (const o of orders) {
    revenue += o.totalAmount;
    shippingExpenses += o.shippingCost;
    gstExpenses += o.gstAmount;
    for (const item of o.items) {
      purchaseCost += item.purchasePrice * item.quantity;
      makingChargesExpenses += item.makingCharges * item.quantity;
    }
  }
  const totalExpenses = purchaseCost + shippingExpenses + gstExpenses + makingChargesExpenses;
  const grossProfit = revenue - totalExpenses;
  return { revenue, purchaseCost, shippingExpenses, gstExpenses, makingChargesExpenses, totalExpenses, grossProfit, profitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0, orderCount: orders.length };
}

export async function getDailyBreakdown(period: { startDate: string; endDate: string }) {
  let orders = db.orders.getAll().filter((o) => o.status === "delivered");
  orders = orders.filter((o) => o.createdAt >= period.startDate && o.createdAt <= period.endDate + "T23:59:59");
  const byDay: Record<string, { revenue: number; expenses: number }> = {};
  for (const o of orders) {
    const date = o.createdAt.slice(0, 10);
    if (!byDay[date]) byDay[date] = { revenue: 0, expenses: 0 };
    byDay[date].revenue += o.totalAmount;
    byDay[date].expenses += o.shippingCost + o.gstAmount + o.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
  }
  return Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, { revenue, expenses }]) => ({ date, revenue, profit: revenue - expenses }));
}

export async function getMonthlyBreakdown(year: number) {
  const orders = db.orders.getAll().filter((o) => o.status === "delivered" && new Date(o.createdAt).getFullYear() === year);
  const byMonth: Record<number, { revenue: number; expenses: number }> = {};
  for (let m = 0; m < 12; m++) byMonth[m] = { revenue: 0, expenses: 0 };
  for (const o of orders) {
    const m = new Date(o.createdAt).getMonth();
    byMonth[m].revenue += o.totalAmount;
    byMonth[m].expenses += o.shippingCost + o.gstAmount + o.items.reduce((s, i) => s + i.purchasePrice * i.quantity + i.makingCharges * i.quantity, 0);
  }
  return Object.entries(byMonth).map(([m, { revenue, expenses }]) => ({ month: MONTHS[parseInt(m)], revenue, profit: revenue - expenses }));
}
