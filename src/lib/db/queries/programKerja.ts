import { db } from "@/lib/db";
import { programKerja } from "@/lib/db/schema";
import { and, desc, eq, type SQL } from "drizzle-orm";
import type { Session } from "next-auth";

export async function getProgramKerja(session: Session, ormawaId?: string) {
  const where: SQL[] = [eq(programKerja.ormawaId, scopeByOrmawa(session, ormawaId))];
  return db.select().from(programKerja).where(and(...where)).orderBy(desc(programKerja.createdAt));
}

export async function getProgramKerjaById(session: Session, id: string) {
  const [row] = await db.select().from(programKerja).where(eq(programKerja.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) return null;
  return row;
}

const scopeByOrmawa = (session: Session, ormawaId?: string) =>
  session.user.role === "admin_ormawa" ? (session.user.ormawaId ?? "") : (ormawaId ?? "");