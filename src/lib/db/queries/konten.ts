import { db } from "@/lib/db";
import { berita, kalender, galeri, arsip, aspirasi } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getBeritaList(limit?: number) {
  return db.select().from(berita).orderBy(desc(berita.publishedAt), desc(berita.createdAt)).limit(limit ?? 100);
}

export async function getBeritaBySlug(slug: string) {
  const [row] = await db.select().from(berita).where(eq(berita.slug, slug));
  return row ?? null;
}

export async function getKalenderList() {
  return db.select().from(kalender).orderBy(desc(kalender.tanggalMulai));
}

export async function getGaleriList() {
  return db.select().from(galeri).orderBy(desc(galeri.createdAt));
}

export async function getArsipList() {
  return db.select().from(arsip).orderBy(desc(arsip.createdAt));
}

export async function getAspirasiList() {
  return db.select().from(aspirasi).orderBy(desc(aspirasi.createdAt));
}

export async function getAspirasiById(id: string) {
  const [row] = await db.select().from(aspirasi).where(eq(aspirasi.id, id));
  return row ?? null;
}