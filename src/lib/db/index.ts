import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum di-set di .env.local");
}

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });