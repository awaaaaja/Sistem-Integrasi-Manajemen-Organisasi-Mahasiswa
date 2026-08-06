export * from "./enums";
export * from "./identitas";
export * from "./workflow";
export * from "./konten";

import { relations } from "drizzle-orm";
import { ormawa, users, divisi, pengurus, programUnggulan } from "./identitas";
import { programKerja, proposals, lpj, reviewLogs } from "./workflow";
import { berita, galeri } from "./konten";

export {
  ormawa,
  users,
  divisi,
  pengurus,
  programUnggulan,
  programKerja,
  proposals,
  lpj,
  reviewLogs,
  berita,
  galeri,
};

export const ormawaRelations = relations(ormawa, ({ many }) => ({
  users: many(users),
  divisi: many(divisi),
  pengurus: many(pengurus),
  programUnggulan: many(programUnggulan),
  programKerja: many(programKerja),
  proposals: many(proposals),
  galeri: many(galeri),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  ormawa: one(ormawa, { fields: [users.ormawaId], references: [ormawa.id] }),
  proposals: many(proposals),
  reviewLogs: many(reviewLogs),
  berita: many(berita),
}));

export const divisiRelations = relations(divisi, ({ one, many }) => ({
  ormawa: one(ormawa, { fields: [divisi.ormawaId], references: [ormawa.id] }),
  pengurus: many(pengurus),
}));

export const pengurusRelations = relations(pengurus, ({ one }) => ({
  ormawa: one(ormawa, { fields: [pengurus.ormawaId], references: [ormawa.id] }),
  divisi: one(divisi, { fields: [pengurus.divisiId], references: [divisi.id] }),
}));

export const programUnggulanRelations = relations(programUnggulan, ({ one }) => ({
  ormawa: one(ormawa, { fields: [programUnggulan.ormawaId], references: [ormawa.id] }),
}));

export const programKerjaRelations = relations(programKerja, ({ one, many }) => ({
  ormawa: one(ormawa, { fields: [programKerja.ormawaId], references: [ormawa.id] }),
  proposals: many(proposals),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  programKerja: one(programKerja, { fields: [proposals.programKerjaId], references: [programKerja.id] }),
  ormawa: one(ormawa, { fields: [proposals.ormawaId], references: [ormawa.id] }),
  submittedBy: one(users, { fields: [proposals.submittedBy], references: [users.id] }),
  lpj: one(lpj),
}));

export const lpjRelations = relations(lpj, ({ one }) => ({
  proposal: one(proposals, { fields: [lpj.proposalId], references: [proposals.id] }),
}));

export const beritaRelations = relations(berita, ({ one }) => ({
  author: one(users, { fields: [berita.authorId], references: [users.id] }),
}));

export const galeriRelations = relations(galeri, ({ one }) => ({
  ormawa: one(ormawa, { fields: [galeri.ormawaId], references: [ormawa.id] }),
}));

export const reviewLogsRelations = relations(reviewLogs, ({ one }) => ({
  reviewer: one(users, { fields: [reviewLogs.reviewerId], references: [users.id] }),
}));