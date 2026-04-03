// Audit log stub — logs to console in mock mode.
export async function createAuditLog(
  action: string,
  entityId: string,
  entityType: string,
  adminId: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  console.log("[AuditLog]", { action, entityId, entityType, adminId, meta, timestamp: new Date().toISOString() });
}
