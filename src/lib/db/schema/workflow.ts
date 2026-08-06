import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { proposalStatusEnum, reviewableTypeEnum } from "./enums";
import { ormawa, users } from "./identitas";

export const programKerja = pgTable(
  "program_kerja",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi"),
    targetWaktu: timestamp("target_waktu"),
    status: text("status").default("berjalan").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("program_kerja_ormawa_id_idx").on(table.ormawaId)],
);

export const proposals = pgTable(
  "proposals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programKerjaId: uuid("program_kerja_id").references(() => programKerja.id).notNull(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
    judul: text("judul").notNull(),
    fileProposalPath: text("file_proposal_path").notNull(),
    fileRabPath: text("file_rab_path"),
    status: proposalStatusEnum("status").default("draft").notNull(),
    submittedBy: uuid("submitted_by").references(() => users.id).notNull(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("proposals_ormawa_id_idx").on(table.ormawaId),
    index("proposals_program_kerja_id_idx").on(table.programKerjaId),
    index("proposals_status_idx").on(table.status),
  ],
);

export const lpj = pgTable(
  "lpj",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
    judul: text("judul").notNull(),
    fileLpjPath: text("file_lpj_path").notNull(),
    fileBuktiPengeluaranPath: text("file_bukti_pengeluaran_path").notNull(),
    status: proposalStatusEnum("status").default("draft").notNull(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("lpj_proposal_id_idx").on(table.proposalId), index("lpj_status_idx").on(table.status)],
);

export const reviewLogs = pgTable(
  "review_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewableType: reviewableTypeEnum("reviewable_type").notNull(),
    reviewableId: uuid("reviewable_id").notNull(),
    reviewerId: uuid("reviewer_id").references(() => users.id).notNull(),
    action: text("action").notNull(),
    catatan: text("catatan"),
    statusSebelum: proposalStatusEnum("status_sebelum"),
    statusSesudah: proposalStatusEnum("status_sesudah").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("review_logs_reviewer_id_idx").on(table.reviewerId),
    index("review_logs_reviewable_idx").on(table.reviewableType, table.reviewableId),
  ],
);