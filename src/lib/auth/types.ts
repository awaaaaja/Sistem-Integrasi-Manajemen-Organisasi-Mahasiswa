import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      ormawaId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    ormawaId?: string | null;
  }
}