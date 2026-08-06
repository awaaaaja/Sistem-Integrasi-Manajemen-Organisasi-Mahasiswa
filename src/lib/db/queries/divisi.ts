import { db } from "@/lib/db";
import { divisi } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";

const scopeByOrmawa = (session: Session, ormawaId?: string) =>
  session.user.role === "admin_ormawa" ? (session.user.ormawaId ?? "") : (ormawaId ?? "");

export async function getDivisi(session: Session, ormawaId?: string) {
  return db.select().from(divisi).where(eq(divisi.ormawaId, scopeByOrmawa(session, ormawaId)));
}

export async function getDivisiById(session: Session, id: string) {
  const [row] = await db.select().from(divisi).where(eq(divisi.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) return null;
  return row;
}