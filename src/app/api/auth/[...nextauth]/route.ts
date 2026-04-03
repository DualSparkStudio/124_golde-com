import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// Mock admin credentials — no DB needed
const ADMIN_EMAIL = "admin@jewelry.com";
const ADMIN_PASSWORD = "admin123";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return { id: "admin-1", email: ADMIN_EMAIL, name: "Admin", role: "admin" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error role added by authorize
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error extending session
        session.user.id = token.id as string;
        // @ts-expect-error extending session
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-jewelry-shop-2024",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
