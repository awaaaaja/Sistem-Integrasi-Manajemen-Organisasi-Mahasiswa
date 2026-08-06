import type { MetadataRoute } from "next";
import { getAktifOrmawa, getBeritaPublikList } from "@/lib/db/queries/publik";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://simormawa-ten.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let ormawas: Awaited<ReturnType<typeof getAktifOrmawa>> = [];
  let berita: Awaited<ReturnType<typeof getBeritaPublikList>> = [];
  try {
    [ormawas, berita] = await Promise.all([getAktifOrmawa(), getBeritaPublikList(50)]);
  } catch {
    // ponytail: DB tak terjangkau → sitemap hanya rute statis
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/ormawa`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/berita`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/kalender`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/galeri`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/arsip`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/kontak`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/aspirasi`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const ormawaRoutes: MetadataRoute.Sitemap = ormawas.map((o) => ({
    url: `${BASE}/ormawa/${o.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const beritaRoutes: MetadataRoute.Sitemap = berita.map((b) => ({
    url: `${BASE}/berita/${b.slug}`,
    lastModified: b.createdAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...ormawaRoutes, ...beritaRoutes];
}