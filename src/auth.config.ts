import type { NextAuthConfig } from "next-auth";

/**
 * Config edge-safe (tanpa import DB/provider) — dipakai middleware.ts.
 * Provider Credentials & authorize() ada di src/auth.ts (node runtime).
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [], // provider Credentials diisi di src/auth.ts (butuh DB, tidak edge-safe)
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.ormawaId = user.ormawaId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string | null | undefined;
        session.user.ormawaId = token.ormawaId as string | null | undefined;
      }
      return session;
    },
  },
};