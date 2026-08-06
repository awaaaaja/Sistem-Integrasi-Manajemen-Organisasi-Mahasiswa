import { db } from "@/lib/db";
import { proposals, lpj, ormawa } from "@/lib/db/schema";
import { and, desc, eq, gte, lte, type SQL } from "drizzle-orm";

/** Rekap proposal untuk export (metadata-level): join nama ORMAWA, filter ormawaId/status/periode. */
export async function getProposalExport(
  opts?: { ormawaId?: string; status?: string; from?: Date; to?: Date },
) {
  const where: SQL[] = [];
  if (opts?.ormawaId) where.push(eq(proposals.ormawaId, opts.ormawaId));
  if (opts?.status) where.push(eq(proposals.status, opts.status as never));
  if (opts?.from) where.push(gte(proposals.createdAt, opts.from));
  if (opts?.to) where.push(lte(proposals.createdAt, opts.to));

  return db
    .select({
      id: proposals.id,
      judul: proposals.judul,
      status: proposals.status,
      ormawaNama: ormawa.nama,
      submittedAt: proposals.submittedAt,
      createdAt: proposals.createdAt,
    })
    .from(proposals)
    .innerJoin(ormawa, eq(proposals.ormawaId, ormawa.id))
    .where(and(...where))
    .orderBy(desc(proposals.createdAt));
}

/** Rekap LPJ per ORMAWA untuk export PDF (metadata-level). */
export async function getLpjExportByOrmawa(ormawaId: string) {
  const [org] = await db.select({ nama: ormawa.nama }).from(ormawa).where(eq(ormawa.id, ormawaId));
  if (!org) return null;

  const rows = await db
    .select({
      judul: lpj.judul,
      status: lpj.status,
      proposalJudul: proposals.judul,
      submittedAt: lpj.submittedAt,
      createdAt: lpj.createdAt,
    })
    .from(lpj)
    .innerJoin(proposals, eq(lpj.proposalId, proposals.id))
    .where(eq(proposals.ormawaId, ormawaId))
    .orderBy(desc(lpj.createdAt));

  return { ormawaNama: org.nama, rows };
}