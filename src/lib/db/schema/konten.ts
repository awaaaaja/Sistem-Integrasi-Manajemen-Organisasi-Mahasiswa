import { pgTable, uuid, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { aspirasiStatusEnum } from "./enums";
import { users, ormawa } from "./identitas";

export const berita = pgTable(
  "berita",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    judul: text("judul").notNull(),
    slug: text("slug").notNull().unique(),
    konten: text("konten").notNull(),
    thumbnailPath: text("thumbnail_path"),
    authorId: uuid("author_id").references(() => users.id).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("berita_slug_idx").on(table.slug)],
);

export const kalender = pgTable("kalender", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  tanggalMulai: timestamp("tanggal_mulai").notNull(),
  tanggalSelesai: timestamp("tanggal_selesai"),
  kategori: text("kategori"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aspirasi = pgTable("aspirasi", {
  id: uuid("id").defaultRandom().primaryKey(),
  namaPengirim: text("nama_pengirim").notNull(),
  email: text("email").notNull(),
  pesan: text("pesan").notNull(),
  status: aspirasiStatusEnum("status").default("baru").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galeri = pgTable(
  "galeri",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    judul: text("judul").notNull(),
    fotoPath: text("foto_path").notNull(),
    kategori: text("kategori"),
    ormawaId: uuid("ormawa_id").references(() => ormawa.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("galeri_ormawa_id_idx").on(table.ormawaId)],
);

export const arsip = pgTable("arsip", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  filePath: text("file_path").notNull(),
  kategori: text("kategori"),
  tahun: text("tahun").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});