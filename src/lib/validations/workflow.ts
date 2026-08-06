import { z } from "zod";

export const programKerjaSchema = z.object({
  ormawaId: z.string().uuid(),
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
  deskripsi: z.string().max(2000).optional().nullable(),
  targetWaktu: z.coerce.date().optional().nullable(),
});

export const proposalSchema = z.object({
  ormawaId: z.string().uuid(),
  programKerjaId: z.string().uuid(),
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
});

export const lpjSchema = z.object({
  proposalId: z.string().uuid(),
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
});

/** File proposal/RAB: pdf/jpg/png, maks 5MB (PRD §7 poin 5). */
export const PROPOSAL_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export const PROPOSAL_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const proposalFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= PROPOSAL_MAX_FILE_SIZE, { message: "File maksimal 5MB" })
  .refine((f) => PROPOSAL_MIME_TYPES.includes(f.type as ProposalMime), {
    message: "Format harus pdf/jpg/png",
  });

type ProposalMime = (typeof PROPOSAL_MIME_TYPES)[number];

/** Keputusan reviewer (PRD §6.3). Catatan WAJIB untuk revisi/tolak — validasi Zod, bukan cuma required HTML. */
export const reviewProposalSchema = z
  .object({
    proposalId: z.string().uuid(),
    action: z.enum(["disetujui", "ditolak", "revisi"]),
    catatan: z.string().max(2000),
  })
  .refine((d) => d.action === "disetujui" || d.catatan.trim().length > 0, {
    message: "Catatan wajib diisi untuk keputusan revisi/tolak",
    path: ["catatan"],
  });