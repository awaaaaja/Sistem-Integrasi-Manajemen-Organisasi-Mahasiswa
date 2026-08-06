import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "super_admin",
  "kemahasiswaan",
  "lkpka",
  "mpm",
  "bem_koordinator",
  "admin_ormawa",
]);

export const ormawaJenisEnum = pgEnum("ormawa_jenis", ["bem", "mpm", "hima", "ukm"]);

export const ormawaStatusEnum = pgEnum("ormawa_status", ["aktif", "nonaktif"]);

export const proposalStatusEnum = pgEnum("proposal_status", [
  "draft",
  "diajukan",
  "revisi",
  "disetujui",
  "ditolak",
]);

export const aspirasiStatusEnum = pgEnum("aspirasi_status", ["baru", "ditindaklanjuti"]);

export const reviewableTypeEnum = pgEnum("reviewable_type", ["proposal", "lpj"]);