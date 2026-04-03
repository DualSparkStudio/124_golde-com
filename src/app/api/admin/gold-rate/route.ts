import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

const TOLA = 11.6638; // grams per tola

export async function POST(req: NextRequest) {
  const { rate, unit } = await req.json();
  if (!rate || rate <= 0) return NextResponse.json({ error: "Rate must be > 0" }, { status: 400 });
  const validUnits = ["per_gram_22k", "per_gram_24k", "per_tola_22k", "per_tola_24k"];
  if (!validUnits.includes(unit)) return NextResponse.json({ error: "Invalid unit" }, { status: 400 });

  const isPerTola = unit.includes("tola");
  const ratePerGram = isPerTola ? rate / TOLA : rate;
  const ratePerTola = isPerTola ? rate : rate * TOLA;
  const purity = unit.includes("24k") ? "24K" : "22K";

  db.goldRate.set({ ratePerGram: Math.round(ratePerGram), ratePerTola: Math.round(ratePerTola), purity, source: "manual" });
  return NextResponse.json({ rate: db.goldRate.get() });
}
