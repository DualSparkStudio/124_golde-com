// Mock lead service — logs to console, no DB needed

export async function submitPriceRequest(data: { productId?: string; name: string; phone: string; message?: string }) {
  if (!data.phone) throw new Error("Phone required");
  console.log("[Lead] Price request:", data);
  return { success: true };
}

export async function submitAppointment(data: { name: string; phone: string; message?: string }) {
  if (!data.phone) throw new Error("Phone required");
  console.log("[Lead] Appointment:", data);
  return { success: true };
}

export async function capturePopupLead(data: { phone: string; email?: string }) {
  if (!data.phone) throw new Error("Phone required");
  console.log("[Lead] Popup:", data);
  return { success: true, offerCode: "FIRST5" };
}
