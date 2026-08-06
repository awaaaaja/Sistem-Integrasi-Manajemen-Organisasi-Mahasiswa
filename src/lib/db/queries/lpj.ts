import { db } from "@/lib/db";
import { lpj, proposals, reviewLogs } from "@/lib/db/schema";
import { and, desc, eq, type SQL } from "drizzle-orm";
import type { Session } from "next-auth";

/** Semua LPJ — admin_ormawa di-scope lewat join proposal (lpj tidak punya ormawaId), reviewer/super_admin tanpa filter. */
export async function getLpjList(session: Session, ormawaId?: string) {
  const where: SQL[] = [];
  if (session.user.role === "admin_ormawa") {
    where.push(eq(proposals.ormawaId, ormawaId ?? session.user.ormawaId ?? ""));
  } else if (ormawaId) {
    where.push(eq(proposals.ormawaId, ormawaId));
  }
  return db
    .select({
      id: lpj.id,
      proposalId: lpj.proposalId,
      judul: lpj.judul,
      status: lpj.status,
      submittedAt: lpj.submittedAt,
      createdAt: lpj.createdAt,
      proposalJudul: proposals.judul,
    })
    .from(lpj)
    .innerJoin(proposals, eq(lpj.proposalId, proposals.id))
    .where(and(...where))
    .orderBy(desc(lpj.createdAt));
}

/** LPJ milik proposal tertentu — dipakai UI detail proposal ("1 proposal → 1 LPJ"). */
export async function getLpjByProposalId(session: Session, proposalId: string) {
  const [row] = await db.select().from(lpj).where(eq(lpj.proposalId, proposalId));
  if (!row) return null;
  const [proposal] = await db.select().from(proposals).where(eq(proposals.id, proposalId));
  if (session.user.role === "admin_ormawa" && proposal?.ormawaId !== session.user.ormawaId) return null;
  return row;
}

/** Antrian reviewer: LPJ berstatus diajukan, TIDAK di-scope by ormawaId. */
export async function getLpjReviewQueue(session: Session) {
  if (session.user.role === "admin_ormawa") return [];
  return db
    .select({
      id: lpj.id,
      judul: lpj.judul,
      status: lpj.status,
      submittedAt: lpj.submittedAt,
      proposalJudul: proposals.judul,
    })
    .from(lpj)
    .innerJoin(proposals, eq(lpj.proposalId, proposals.id))
    .where(eq(lpj.status, "diajukan"))
    .orderBy(desc(lpj.submittedAt));
}

export async function getLpjById(session: Session, id: string) {
  const [row] = await db
    .select({
      id: lpj.id,
      proposalId: lpj.proposalId,
      judul: lpj.judul,
      fileLpjPath: lpj.fileLpjPath,
      fileBuktiPengeluaranPath: lpj.fileBuktiPengeluaranPath,
      status: lpj.status,
      submittedAt: lpj.submittedAt,
      proposalJudul: proposals.judul,
      proposalOrmawaId: proposals.ormawaId,
    })
    .from(lpj)
    .innerJoin(proposals, eq(lpj.proposalId, proposals.id))
    .where(eq(lpj.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.proposalOrmawaId !== session.user.ormawaId) return null;
  return row;
}

/** Riwayat review_logs sebuah LPJ. */
export async function getLpjLogs(session: Session, lpjId: string) {
  const lpjRow = await getLpjById(session, lpjId);
  if (!lpjRow) return null;
  return db
    .select()
    .from(reviewLogs)
    .where(and(eq(reviewLogs.reviewableType, "lpj"), eq(reviewLogs.reviewableId, lpjId)))
    .orderBy(desc(reviewLogs.createdAt));
}