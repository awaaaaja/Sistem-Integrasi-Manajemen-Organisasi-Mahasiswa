"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { lpj, proposals, reviewLogs } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { lpjSchema, proposalFileSchema } from "@/lib/validations/workflow";
import { assertCanSubmitLpj, assertSubmitTransition } from "@/lib/workflow/transitions";
import { uploadFile } from "@/lib/storage";

function fileOrUndefined(value: FormDataEntryValue | null): File | undefined {
  if (value instanceof File && value.size > 0) return value;
  return undefined;
}

/**
 * Submit LPJ: HANYA valid jika proposal terkait berstatus "disetujui" (gate di server action).
 * Satu transaksi: insert lpj (status diajukan) + review_logs (reviewableType "lpj", action "diajukan").
 */
export async function submitLpj(formData: FormData) {
  const session = await auth();
  const parsed = lpjSchema.safeParse({
    proposalId: formData.get("proposalId"),
    judul: formData.get("judul"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const [proposal] = await db.select().from(proposals).where(eq(proposals.id, parsed.data.proposalId));
  if (!proposal) return { error: "Proposal tidak ditemukan" };
  if (!can(session, "create", "lpj", proposal.ormawaId)) return { error: "Forbidden" };

  // GATE (PRD §4.2 note): hanya proposal disetujui yang boleh punya LPJ
  try {
    assertCanSubmitLpj(proposal.status);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const existing = await getLpjForProposal(parsed.data.proposalId);
  if (existing) return { error: "Proposal ini sudah punya LPJ" };

  const fileLpj = fileOrUndefined(formData.get("fileLpj"));
  const fileBukti = fileOrUndefined(formData.get("fileBuktiPengeluaran"));
  if (!fileLpj || !fileBukti) return { error: "File LPJ dan bukti pengeluaran wajib diunggah" };
  if (!proposalFileSchema.safeParse(fileLpj).success) return { error: "LPJ harus pdf/jpg/png & ≤5MB" };
  if (!proposalFileSchema.safeParse(fileBukti).success) return { error: "Bukti pengeluaran harus pdf/jpg/png & ≤5MB" };

  const folder = `lpj/${proposal.ormawaId}`;
  const fileLpjPath = await uploadFile(folder, fileLpj);
  const fileBuktiPengeluaranPath = await uploadFile(folder, fileBukti);

  await db.transaction(async (tx) => {
    const [lpjRow] = await tx
      .insert(lpj)
      .values({
        proposalId: parsed.data.proposalId,
        judul: parsed.data.judul,
        fileLpjPath,
        fileBuktiPengeluaranPath,
        status: "diajukan",
        submittedAt: new Date(),
      })
      .returning();

    await tx.insert(reviewLogs).values({
      reviewableType: "lpj",
      reviewableId: lpjRow.id,
      reviewerId: session!.user.id,
      action: "diajukan",
      statusSebelum: "draft",
      statusSesudah: "diajukan",
    });
  });

  revalidatePath("/dashboard/ormawa/lpj");
  revalidatePath(`/dashboard/ormawa/proposal/${parsed.data.proposalId}`);
  return { success: true };
}

/** Submit ulang LPJ: hanya transisi draft → diajukan atau revisi → diajukan. */
export async function resubmitLpj(lpjId: string, formData: FormData) {
  const session = await auth();
  const [lpjRow] = await db.select().from(lpj).where(eq(lpj.id, lpjId));
  if (!lpjRow) return { error: "LPJ tidak ditemukan" };

  const [proposal] = await db.select().from(proposals).where(eq(proposals.id, lpjRow.proposalId));
  if (!can(session, "update", "lpj", proposal?.ormawaId)) return { error: "Forbidden" };

  try {
    assertSubmitTransition(lpjRow.status);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const current = lpjRow.status;

  const fileLpj = fileOrUndefined(formData.get("fileLpj"));
  const fileBukti = fileOrUndefined(formData.get("fileBuktiPengeluaran"));
  if (fileLpj && !proposalFileSchema.safeParse(fileLpj).success) return { error: "LPJ harus pdf/jpg/png & ≤5MB" };
  if (fileBukti && !proposalFileSchema.safeParse(fileBukti).success) return { error: "Bukti pengeluaran harus pdf/jpg/png & ≤5MB" };

  const folder = `lpj/${proposal!.ormawaId}`;
  const fileLpjPath = fileLpj ? await uploadFile(folder, fileLpj) : lpjRow.fileLpjPath;
  const fileBuktiPengeluaranPath = fileBukti ? await uploadFile(folder, fileBukti) : lpjRow.fileBuktiPengeluaranPath;

  await db.transaction(async (tx) => {
    await tx
      .update(lpj)
      .set({ status: "diajukan", fileLpjPath, fileBuktiPengeluaranPath, updatedAt: new Date(), submittedAt: new Date() })
      .where(eq(lpj.id, lpjId));

    await tx.insert(reviewLogs).values({
      reviewableType: "lpj",
      reviewableId: lpjId,
      reviewerId: session!.user.id,
      action: "diajukan",
      catatan: fileLpj || fileBukti ? "Submit ulang dengan file baru" : null,
      statusSebelum: current,
      statusSesudah: "diajukan",
    });
  });

  revalidatePath("/dashboard/ormawa/lpj");
  return { success: true };
}

async function getLpjForProposal(proposalId: string) {
  const [row] = await db.select({ id: lpj.id }).from(lpj).where(and(eq(lpj.proposalId, proposalId)));
  return row;
}