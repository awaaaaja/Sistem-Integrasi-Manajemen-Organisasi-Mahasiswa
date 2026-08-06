import { pgTable, uuid, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { roleEnum, ormawaJenisEnum, ormawaStatusEnum } from "./enums";

export const ormawa = pgTable(
  "ormawa",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nama: text("nama").notNull(),
    slug: text("slug").notNull().unique(),
    jenis: ormawaJenisEnum("jenis").notNull(),
    deskripsi: text("deskripsi"),
    visi: text("visi"),
    misi: text("misi"),
    logoPath: text("logo_path"),
    bannerPath: text("banner_path"),
    status: ormawaStatusEnum("status").default("aktif").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("ormawa_slug_idx").on(table.slug)],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email), index("users_ormawa_id_idx").on(table.ormawaId)],
);

export const divisi = pgTable(
  "divisi",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
    nama: text("nama").notNull(),
    deskripsi: text("deskripsi"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("divisi_ormawa_id_idx").on(table.ormawaId)],
);

export const pengurus = pgTable(
  "pengurus",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
    divisiId: uuid("divisi_id").references(() => divisi.id),
    nama: text("nama").notNull(),
    jabatan: text("jabatan").notNull(),
    fotoPath: text("foto_path"),
    periodeMulai: timestamp("periode_mulai").notNull(),
    periodeSelesai: timestamp("periode_selesai"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("pengurus_ormawa_id_idx").on(table.ormawaId)],
);

export const programUnggulan = pgTable(
  "program_unggulan",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi"),
    tahun: text("tahun").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("program_unggulan_ormawa_id_idx").on(table.ormawaId)],
);