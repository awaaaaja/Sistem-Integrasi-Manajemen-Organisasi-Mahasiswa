export type ProposalStatus = "draft" | "diajukan" | "revisi" | "disetujui" | "ditolak";

/** State machine proposal/LPJ (PRD §4.2). Satu-satunya sumber kebenaran transisi. */
export const PROPOSAL_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  draft: ["diajukan"],
  diajukan: ["revisi", "disetujui", "ditolak"],
  revisi: ["diajukan"],
  disetujui: [],
  ditolak: [],
};

/** Tolak transisi yang tidak terdefinisi — wajib dipakai di server action. */
export function assertTransition(from: ProposalStatus, to: ProposalStatus) {
  if (from === to) {
    throw new Error(`Status sudah "${from}", tidak ada perubahan`);
  }
  if (!PROPOSAL_TRANSITIONS[from].includes(to)) {
    throw new Error(`Transisi status tidak valid: "${from}" → "${to}"`);
  }
}

/** Subset transisi yang boleh dilakukan admin_ormawa (submit / submit ulang). */
export function assertSubmitTransition(from: ProposalStatus) {
  if (from !== "draft" && from !== "revisi") {
    throw new Error(`Proposal berstatus "${from}" tidak bisa disubmit ulang`);
  }
}