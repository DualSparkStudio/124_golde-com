import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export interface AdminSession {
  id: string;
  email: string;
  role: string;
}

/**
 * Validates the JWT token on an incoming request and asserts the caller is an admin.
 * Throws a Response with the appropriate status code if validation fails.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminSession> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if ((token as { role?: string }).role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }

  return {
    id: token.id as string,
    email: token.email as string,
    role: (token as { role?: string }).role as string,
  };
}
