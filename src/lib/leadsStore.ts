/**
 * Client-side leads store using localStorage.
 * Used by PriceRequestForm, AppointmentForm, and the admin appointments page.
 */

export interface LeadEntry {
  id: string;
  type: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  productId?: string;
  offerCode?: string;
  createdAt: string;
  status: string;
}

export const leadsStore = {
  get: (): LeadEntry[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("leads_store") || "[]");
    } catch {
      return [];
    }
  },

  add: (lead: Omit<LeadEntry, "id" | "createdAt" | "status">): LeadEntry => {
    const entry: LeadEntry = {
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    const all = leadsStore.get();
    localStorage.setItem("leads_store", JSON.stringify([...all, entry]));
    return entry;
  },

  update: (id: string, data: Partial<LeadEntry>): void => {
    const all = leadsStore.get().map((l) => (l.id === id ? { ...l, ...data } : l));
    localStorage.setItem("leads_store", JSON.stringify(all));
  },
};
