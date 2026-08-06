import { db } from "@/lib/db";
import { ormawa, divisi, pengurus, programUnggulan, berita, kalender, galeri, arsip } from "@/lib/db/schema";
import { and, desc, eq, gt, isNull, or, asc, sql } from "drizzle-orm";

/** Bungkus query publik supaya build tetap jalan saat DB tak terjangkau (rendah hati: fallback kosong). */
export async function safePub<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/** Direktori ORMAWA aktif (publik, session-free). */
export async function getAktifOrmawa() {
  return db.select().from(ormawa).where(eq(ormawa.status, "aktif")).orderBy(ormawa.nama);
}

export async function getOrmawaPublikBySlug(slug: string) {
  const [org] = await db.select().from(ormawa).where(and(eq(ormawa.slug, slug), eq(ormawa.status, "aktif")));
  if (!org) return null;

  const [divisiList, pengurusList, programList, galeriList] = await Promise.all([
    db.select().from(divisi).where(eq(divisi.ormawaId, org.id)).orderBy(divisi.nama),
    db
      .select()
      .from(pengurus)
      .where(
        and(
          eq(pengurus.ormawaId, org.id),
          or(isNull(pengurus.periodeSelesai), gt(pengurus.periodeSelesai, new Date())),
        ),
      )
      .orderBy(asc(pengurus.jabatan)),
    db.select().from(programUnggulan).where(eq(programUnggulan.ormawaId, org.id)).orderBy(desc(programUnggulan.tahun)),
    db.select().from(galeri).where(eq(galeri.ormawaId, org.id)).orderBy(desc(galeri.createdAt)),
  ]);

  return { ormawa: org, divisi: divisiList, pengurus: pengurusList, programUnggulan: programList, galeri: galeriList };
}

export async function getBeritaPublikList(limit?: number) {
  return db.select().from(berita).orderBy(desc(berita.publishedAt), desc(berita.createdAt)).limit(limit ?? 50);
}

export async function getBeritaPublikBySlug(slug: string) {
  const [row] = await db.select().from(berita).where(eq(berita.slug, slug));
  return row ?? null;
}

export async function getKalenderPublikList() {
  return db.select().from(kalender).orderBy(desc(kalender.tanggalMulai));
}

export async function getGaleriPublikList() {
  return db.select().from(galeri).orderBy(desc(galeri.createdAt));
}

export async function getArsipPublikList() {
  return db.select().from(arsip).orderBy(desc(arsip.createdAt));
}

export async function getStatistikPublik() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ormawa)
    .where(eq(ormawa.status, "aktif"));
  return row?.count ?? 0;
}

/** Program unggulan terbaru lintas ORMAWA (untuk beranda). */
export async function getProgramUnggulanTerbaru(limit = 3) {
  return db
    .select({
      judul: programUnggulan.judul,
      deskripsi: programUnggulan.deskripsi,
      tahun: programUnggulan.tahun,
      ormawaNama: ormawa.nama,
      ormawaSlug: ormawa.slug,
    })
    .from(programUnggulan)
    .innerJoin(ormawa, eq(programUnggulan.ormawaId, ormawa.id))
    .where(eq(ormawa.status, "aktif"))
    .orderBy(desc(programUnggulan.tahun))
    .limit(limit);
}