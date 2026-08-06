"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { berita, kalender, galeri, arsip, aspirasi } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import {
  beritaSchema,
  kalenderSchema,
  galeriSchema,
  arsipSchema,
  slugify,
  arsipFileSchema,
} from "@/lib/validations/konten";
import { fileSchema } from "@/lib/validations/identitas";
import { uploadFile } from "@/lib/storage";

const KONTEN_PATH = "/dashboard/super-admin/konten";

function fileOrUndefined(value: FormDataEntryValue | null): File | undefined {
  if (value instanceof File && value.size > 0) return value;
  return undefined;
}

// ---------- BERITA ----------

export async function createBerita(formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "berita")) return { error: "Forbidden" };

  const judul = String(formData.get("judul") ?? "");
  const slug = String(formData.get("slug") ?? "") || slugify(judul);

  const parsed = beritaSchema.safeParse({
    judul,
    slug,
    konten: formData.get("konten"),
    publishedAt: formData.get("publishedAt") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const [existing] = await db.select({ id: berita.id }).from(berita).where(eq(berita.slug, slug));
  if (existing) return { error: `Slug "${slug}" sudah dipakai` };

  const thumbnail = fileOrUndefined(formData.get("thumbnail"));
  if (thumbnail && !fileSchema.safeParse(thumbnail).success) return { error: "Thumbnail harus jpg/png/webp & ≤5MB" };
  const thumbnailPath = thumbnail ? await uploadFile("berita", thumbnail) : null;

  await db.insert(berita).values({
    judul: parsed.data.judul,
    slug: parsed.data.slug!,
    konten: parsed.data.konten,
    thumbnailPath,
    authorId: session!.user.id,
    publishedAt: parsed.data.publishedAt ?? null,
  });
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function updateBerita(id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "berita")) return { error: "Forbidden" };

  const parsed = beritaSchema.partial().safeParse({
    judul: formData.get("judul") || undefined,
    slug: formData.get("slug") || undefined,
    konten: formData.get("konten") || undefined,
    publishedAt: formData.get("publishedAt") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  if (parsed.data.slug) {
    const [existing] = await db.select({ id: berita.id }).from(berita).where(eq(berita.slug, parsed.data.slug));
    if (existing && existing.id !== id) return { error: `Slug "${parsed.data.slug}" sudah dipakai` };
  }

  await db.update(berita).set(parsed.data).where(eq(berita.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function deleteBerita(id: string) {
  const session = await auth();
  if (!can(session, "delete", "berita")) return { error: "Forbidden" };
  await db.delete(berita).where(eq(berita.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

// ---------- KALENDER ----------

export async function createKalender(formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "kalender")) return { error: "Forbidden" };

  const parsed = kalenderSchema.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    tanggalMulai: formData.get("tanggalMulai"),
    tanggalSelesai: formData.get("tanggalSelesai") || undefined,
    kategori: formData.get("kategori") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(kalender).values(parsed.data);
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function updateKalender(id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "kalender")) return { error: "Forbidden" };

  const parsed = kalenderSchema.partial().safeParse({
    judul: formData.get("judul") || undefined,
    deskripsi: formData.get("deskripsi") || undefined,
    tanggalMulai: formData.get("tanggalMulai") || undefined,
    tanggalSelesai: formData.get("tanggalSelesai") || undefined,
    kategori: formData.get("kategori") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(kalender).set(parsed.data).where(eq(kalender.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function deleteKalender(id: string) {
  const session = await auth();
  if (!can(session, "delete", "kalender")) return { error: "Forbidden" };
  await db.delete(kalender).where(eq(kalender.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

// ---------- GALERI ----------

export async function createGaleri(formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "galeri")) return { error: "Forbidden" };

  const parsed = galeriSchema.safeParse({
    judul: formData.get("judul"),
    kategori: formData.get("kategori") || undefined,
    ormawaId: formData.get("ormawaId") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const foto = fileOrUndefined(formData.get("foto"));
  if (!foto) return { error: "Foto wajib diunggah" };
  if (!fileSchema.safeParse(foto).success) return { error: "Foto harus jpg/png/webp & ≤5MB" };

  const fotoPath = await uploadFile("galeri", foto);
  await db.insert(galeri).values({ ...parsed.data, fotoPath });
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function deleteGaleri(id: string) {
  const session = await auth();
  if (!can(session, "delete", "galeri")) return { error: "Forbidden" };
  await db.delete(galeri).where(eq(galeri.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

// ---------- ARSIP ----------

export async function createArsip(formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "arsip")) return { error: "Forbidden" };

  const parsed = arsipSchema.safeParse({
    judul: formData.get("judul"),
    kategori: formData.get("kategori") || undefined,
    tahun: formData.get("tahun"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const file = fileOrUndefined(formData.get("file"));
  if (!file) return { error: "File wajib diunggah" };
  if (!arsipFileSchema.safeParse(file).success) return { error: "File harus pdf/jpg/png & ≤5MB" };

  const filePath = await uploadFile("arsip", file);
  await db.insert(arsip).values({ ...parsed.data, filePath });
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

export async function deleteArsip(id: string) {
  const session = await auth();
  if (!can(session, "delete", "arsip")) return { error: "Forbidden" };
  await db.delete(arsip).where(eq(arsip.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}

// ---------- ASPIRASI (hanya ubah status, isi read-only) ----------

export async function updateAspirasiStatus(id: string, status: "baru" | "ditindaklanjuti") {
  const session = await auth();
  if (!can(session, "update", "aspirasi")) return { error: "Forbidden" };
  await db.update(aspirasi).set({ status }).where(eq(aspirasi.id, id));
  revalidatePath(KONTEN_PATH);
  return { success: true };
}