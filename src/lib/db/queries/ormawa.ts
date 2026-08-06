import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { and, desc, eq, type SQL } from "drizzle-orm";
import type { Session } from "next-auth";

export async function getOrmawaList(session: Session, opts?: { includeNonaktif?: boolean }) {
  const where: SQL[] = [];
  if (session.user.role === "admin_ormawa") {
    where.push(eq(ormawa.id, session.user.ormawaId ?? ""));
  }
  if (session.user.role !== "super_admin" && !opts?.includeNonaktif) {
    where.push(eq(ormawa.status, "aktif"));
  }
  return where.length
    ? db.select().from(ormawa).where(and(...where)).orderBy(desc(ormawa.status), ormawa.nama)
    : db.select().from(ormawa).orderBy(desc(ormawa.status), ormawa.nama);
}

export async function getOrmawaById(session: Session, id: string) {
  const [row] = await db.select().from(ormawa).where(eq(ormawa.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.id !== session.user.ormawaId) return null;
  return row;
}