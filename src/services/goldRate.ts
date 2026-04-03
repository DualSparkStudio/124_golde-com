import { db } from "@/lib/mockDb";

export async function getCurrentRate() {
  return db.goldRate.get();
}

export async function setManualRate(rate: number, unit: string) {
  const TOLA = 11.6638;
  const isPerTola = unit.includes("tola");
  const ratePerGram = isPerTola ? rate / TOLA : rate;
  const ratePerTola = isPerTola ? rate : rate * TOLA;
  const purity = unit.includes("24k") ? "24K" : "22K";
  db.goldRate.set({ ratePerGram: Math.round(ratePerGram), ratePerTola: Math.round(ratePerTola), purity, source: "manual" });
  return db.goldRate.get();
}
