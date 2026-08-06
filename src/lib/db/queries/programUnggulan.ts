import { db } from "@/lib/db";
import { programUnggulan } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";

const scopeByOrmawa = (session: Session, ormawaId?: string) =>
  session.user.role === "admin_ormawa" ? (session.user.ormawaId ?? "") : (ormawaId ?? "");

export async function getProgramUnggulan(session: Session, ormawaId?: string) {
  const where = [eq(programUnggulan.ormawaId, scopeByOrmawa(session, ormawaId))];
  return db.select().from(programUnggulan).where(and(...where)).orderBy(programUnggulan.tahun);
}

export async function getProgramUnggulanById(session: Session, id: string) {
  const [row] = await db.select().from(programUnggulan).where(eq(programUnggulan.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) return null;
  return row;
}