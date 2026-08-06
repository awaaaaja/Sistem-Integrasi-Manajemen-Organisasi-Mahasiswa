import { z } from "zod";

const slugSchema = z
  .string()
  .min(2, "Slug minimal 2 karakter")
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan dash");

export const ormawaSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter").max(200),
  slug: slugSchema,
  jenis: z.enum(["bem", "mpm", "hima", "ukm"]),
  deskripsi: z.string().max(2000).optional().nullable(),
  visi: z.string().max(1000).optional().nullable(),
  misi: z.string().max(2000).optional().nullable(),
  status: z.enum(["aktif", "nonaktif"]).default("aktif"),
});

export type OrmawaInput = z.input<typeof ormawaSchema>;
export type OrmawaOutput = z.output<typeof ormawaSchema>;

export const ormawaProfilSchema = ormawaSchema
  .omit({ slug: true })
  .extend({ logoPath: z.string().nullable().optional(), bannerPath: z.string().nullable().optional() });

export const divisiSchema = z.object({
  ormawaId: z.string().uuid(),
  nama: z.string().min(2, "Nama divisi minimal 2 karakter").max(100),
  deskripsi: z.string().max(1000).optional().nullable(),
});

export const pengurusSchema = z
  .object({
    ormawaId: z.string().uuid(),
    divisiId: z.string().uuid().optional().nullable(),
    nama: z.string().min(2, "Nama minimal 2 karakter").max(150),
    jabatan: z.string().min(2, "Jabatan minimal 2 karakter").max(100),
    fotoPath: z.string().max(500).optional().nullable(),
    periodeMulai: z.coerce.date(),
    periodeSelesai: z.coerce.date().optional().nullable(),
  })
  .refine((d) => !d.periodeSelesai || d.periodeSelesai > d.periodeMulai, {
    message: "Periode selesai harus setelah periode mulai",
    path: ["periodeSelesai"],
  });

export const programUnggulanSchema = z.object({
  ormawaId: z.string().uuid(),
  judul: z.string().min(2, "Judul minimal 2 karakter").max(200),
  deskripsi: z.string().max(2000).optional().nullable(),
  tahun: z.string().min(2).max(10),
});

export const FILE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, sesuai PRD §7

export const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE, { message: "File maksimal 5MB" })
  .refine((f) => FILE_MIME_TYPES.includes(f.type as MIME), {
    message: "Format harus jpg/png/webp",
  });

type MIME = (typeof FILE_MIME_TYPES)[number];