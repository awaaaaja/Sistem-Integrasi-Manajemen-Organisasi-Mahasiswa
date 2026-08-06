"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { proposals, reviewLogs } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { proposalSchema, proposalFileSchema } from "@/lib/validations/workflow";
import { assertSubmitTransition } from "@/lib/workflow/transitions";
import { uploadFile } from "@/lib/storage";

function fileOrUndefined(value: FormDataEntryValue | null): File | undefined {
  if (value instanceof File && value.size > 0) return value;
  return undefined;
}

/** Submit proposal baru: insert proposals (status diajukan) + review_logs (action diajukan) dalam SATU transaksi (SCHEMA.md §6). */
export async function submitProposal(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "proposal", ormawaId)) return { error: "Forbidden" };

  const parsed = proposalSchema.safeParse({
    ormawaId,
    programKerjaId: formData.get("programKerjaId"),
    judul: formData.get("judul"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const fileProposal = fileOrUndefined(formData.get("fileProposal"));
  const fileRab = fileOrUndefined(formData.get("fileRab"));
  if (!fileProposal) return { error: "File proposal wajib diunggah" };
  if (!proposalFileSchema.safeParse(fileProposal).success) return { error: "Proposal harus pdf/jpg/png & ≤5MB" };
  if (fileRab && !proposalFileSchema.safeParse(fileRab).success) return { error: "RAB harus pdf/jpg/png & ≤5MB" };

  const folder = `proposal/${ormawaId}`;
  const fileProposalPath = await uploadFile(folder, fileProposal);
  const fileRabPath = fileRab ? await uploadFile(folder, fileRab) : null;

  await db.transaction(async (tx) => {
    const [proposal] = await tx
      .insert(proposals)
      .values({
        ormawaId,
        programKerjaId: parsed.data.programKerjaId,
        judul: parsed.data.judul,
        fileProposalPath,
        fileRabPath,
        status: "diajukan",
        submittedBy: session!.user.id,
        submittedAt: new Date(),
      })
      .returning();

    await tx.insert(reviewLogs).values({
      reviewableType: "proposal",
      reviewableId: proposal.id,
      reviewerId: session!.user.id,
      action: "diajukan",
      statusSebelum: "draft",
      statusSesudah: "diajukan",
    });
  });

  revalidatePath("/dashboard/ormawa/proposal");
  return { success: true };
}

/** Submit ulang: hanya transisi draft → diajukan atau revisi → diajukan (state machine, PRD §4.2). */
export async function resubmitProposal(ormawaId: string, proposalId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "proposal", ormawaId)) return { error: "Forbidden" };

  const [proposal] = await db
    .select()
    .from(proposals)
    .where(and(eq(proposals.id, proposalId), eq(proposals.ormawaId, ormawaId)));
  if (!proposal) return { error: "Proposal tidak ditemukan" };

  const current = proposal.status;
  try {
    assertSubmitTransition(current);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fileProposal = fileOrUndefined(formData.get("fileProposal"));
  const fileRab = fileOrUndefined(formData.get("fileRab"));
  if (fileProposal && !proposalFileSchema.safeParse(fileProposal).success)
    return { error: "Proposal harus pdf/jpg/png & ≤5MB" };
  if (fileRab && !proposalFileSchema.safeParse(fileRab).success) return { error: "RAB harus pdf/jpg/png & ≤5MB" };

  const folder = `proposal/${ormawaId}`;
  const fileProposalPath = fileProposal ? await uploadFile(folder, fileProposal) : proposal.fileProposalPath;
  const fileRabPath = fileRab ? await uploadFile(folder, fileRab) : proposal.fileRabPath;

  await db.transaction(async (tx) => {
    await tx
      .update(proposals)
      .set({
        status: "diajukan",
        fileProposalPath,
        fileRabPath,
        updatedAt: new Date(),
        submittedAt: new Date(),
      })
      .where(eq(proposals.id, proposalId));

    await tx.insert(reviewLogs).values({
      reviewableType: "proposal",
      reviewableId: proposalId,
      reviewerId: session!.user.id,
      action: "diajukan",
      catatan: fileProposal || fileRab ? "Submit ulang dengan file baru" : null,
      statusSebelum: current,
      statusSesudah: "diajukan",
    });
  });

  revalidatePath("/dashboard/ormawa/proposal");
  return { success: true };
}