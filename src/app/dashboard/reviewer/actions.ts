"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { proposals, reviewLogs } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { reviewProposalSchema } from "@/lib/validations/workflow";
import { assertTransition } from "@/lib/workflow/transitions";

/**
 * Keputusan reviewer: setujui / tolak / revisi.
 * WAJIB satu db.transaction() (SCHEMA.md §6): cek status SAAT ITU JUGA di dalam transaksi
 * (race guard — kalau proposal sudah direview reviewer lain duluan, ditolak, bukan overwrite).
 */
export async function reviewProposal(proposalId: string, action: "disetujui" | "ditolak" | "revisi", catatan: string) {
  const session = await auth();
  if (!can(session, "review", "proposal", undefined)) return { error: "Forbidden" };

  const parsed = reviewProposalSchema.safeParse({ proposalId, action, catatan });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  try {
    await db.transaction(async (tx) => {
      // Race condition guard: baca status di dalam transaksi, bukan hasil fetch client
      const [current] = await tx.select().from(proposals).where(eq(proposals.id, proposalId));
      if (!current) throw new Error("Proposal tidak ditemukan");

      assertTransition(current.status, parsed.data.action);

      await tx
        .update(proposals)
        .set({ status: parsed.data.action, updatedAt: new Date() })
        .where(eq(proposals.id, proposalId));

      await tx.insert(reviewLogs).values({
        reviewableType: "proposal",
        reviewableId: proposalId,
        reviewerId: session!.user.id,
        action: parsed.data.action,
        catatan: parsed.data.catatan,
        statusSebelum: current.status,
        statusSesudah: parsed.data.action,
      });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/dashboard/reviewer");
  revalidatePath(`/dashboard/reviewer/proposal/${proposalId}`);
  return { success: true };
}