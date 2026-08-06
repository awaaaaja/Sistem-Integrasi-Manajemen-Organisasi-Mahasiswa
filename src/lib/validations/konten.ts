import { z } from "zod";
import { fileSchema } from "./identitas";
import { proposalFileSchema } from "./workflow";

export const beritaSchema = z.object({
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan dash")
    .optional(),
  konten: z.string().min(2, "Konten minimal 2 karakter").max(100000),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const kalenderSchema = z
  .object({
    judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
    deskripsi: z.string().max(2000).optional().nullable(),
    tanggalMulai: z.coerce.date(),
    tanggalSelesai: z.coerce.date().optional().nullable(),
    kategori: z.string().max(50).optional().nullable(),
  })
  .refine((d) => !d.tanggalSelesai || d.tanggalSelesai >= d.tanggalMulai, {
    message: "Tanggal selesai harus setelah tanggal mulai",
    path: ["tanggalSelesai"],
  });

export const galeriSchema = z.object({
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
  kategori: z.string().max(50).optional().nullable(),
  ormawaId: z.string().uuid().optional().nullable(),
});

export const arsipSchema = z.object({
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
  kategori: z.string().max(50).optional().nullable(),
  tahun: z.string().min(2, "Tahun minimal 2 karakter").max(10),
});

export const aspirasiSchema = z.object({
  namaPengirim: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Email tidak valid").max(150),
  pesan: z.string().min(5, "Pesan minimal 5 karakter").max(5000),
});

/** Honeypot: field tersembunyi, bot yang mengisi dianggap spam (nilai apa pun = tolak). */
export const HONEYPOT_FIELD = "website";

/** Slug otomatis dari judul (PRD/Sprint 6: auto-generate + uniqueness check). */
export function slugify(judul: string): string {
  return judul
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 190);
}

export const publicFileSchema = fileSchema; // galeri: foto jpg/png/webp, 5MB
export const arsipFileSchema = proposalFileSchema; // arsip: dokumen pdf/jpg/png, 5MB