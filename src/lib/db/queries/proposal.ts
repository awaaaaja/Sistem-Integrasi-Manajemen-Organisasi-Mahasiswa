import { db } from "@/lib/db";
import { proposals, reviewLogs } from "@/lib/db/schema";
import { and, desc, eq, type SQL } from "drizzle-orm";
import type { Session } from "next-auth";

/** Semua proposal — admin_ormawa di-scope ke ormawaId sendiri, reviewer/super_admin tanpa filter (SCHEMA.md §5). */
export async function getProposals(session: Session, opts?: { ormawaId?: string; status?: string }) {
  const where: SQL[] = [];
  if (session.user.role === "admin_ormawa") {
    where.push(eq(proposals.ormawaId, opts?.ormawaId ?? session.user.ormawaId ?? ""));
  } else if (opts?.ormawaId) {
    where.push(eq(proposals.ormawaId, opts.ormawaId));
  }
  if (opts?.status) where.push(eq(proposals.status, opts.status as never));
  return db.select().from(proposals).where(and(...where)).orderBy(desc(proposals.createdAt));
}

export async function getProposalById(session: Session, id: string) {
  const [row] = await db.select().from(proposals).where(eq(proposals.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) return null;
  return row;
}

/** Antrian reviewer: proposal berstatus diajukan, TIDAK di-scope by ormawaId (SCHEMA.md §5 — reviewer lihat semua). */
export async function getReviewQueue(session: Session) {
  if (session.user.role === "admin_ormawa") return [];
  return db.select().from(proposals).where(eq(proposals.status, "diajukan")).orderBy(desc(proposals.submittedAt));
}

/** Riwayat review yang pernah dilakukan reviewer ini. */
export async function getReviewerLogs(session: Session) {
  return db
    .select()
    .from(reviewLogs)
    .where(eq(reviewLogs.reviewerId, session.user.id))
    .orderBy(desc(reviewLogs.createdAt));
}

/** Riwayat review_logs sebuah proposal, urut terbaru dulu. */
export async function getProposalLogs(session: Session, proposalId: string) {
  const proposal = await getProposalById(session, proposalId);
  if (!proposal) return null;
  return db
    .select()
    .from(reviewLogs)
    .where(and(eq(reviewLogs.reviewableType, "proposal"), eq(reviewLogs.reviewableId, proposalId)))
    .orderBy(desc(reviewLogs.createdAt));
}