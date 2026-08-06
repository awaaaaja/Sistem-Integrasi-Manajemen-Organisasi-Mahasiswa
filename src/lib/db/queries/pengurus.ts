import { db } from "@/lib/db";
import { pengurus } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import type { Session } from "next-auth";

const scopeByOrmawa = (session: Session, ormawaId?: string) =>
  session.user.role === "admin_ormawa" ? (session.user.ormawaId ?? "") : (ormawaId ?? "");

export async function getPengurus(session: Session, ormawaId?: string, opts?: { aktifOnly?: boolean }) {
  const where = [eq(pengurus.ormawaId, scopeByOrmawa(session, ormawaId))];
  if (opts?.aktifOnly) {
    where.push(isNull(pengurus.periodeSelesai));
  }
  return db.select().from(pengurus).where(and(...where)).orderBy(pengurus.createdAt);
}

export async function getPengurusById(session: Session, id: string) {
  const [row] = await db.select().from(pengurus).where(eq(pengurus.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) return null;
  return row;
}