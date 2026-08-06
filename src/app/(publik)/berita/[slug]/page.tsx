import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBeritaPublikBySlug, getBeritaPublikList, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await safePub(() => getBeritaPublikList(50), [])).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await safePub(() => getBeritaPublikBySlug(slug), null);
  if (!row) return { title: "Berita tidak ditemukan — SIM ORMAWA" };
  return {
    title: `${row.judul} — SIM ORMAWA`,
    description: row.konten.slice(0, 160),
  };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await safePub(() => getBeritaPublikBySlug(slug), null);
  if (!row) notFound();

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-brand-accent">{formatTanggal(row.publishedAt ?? row.createdAt)}</p>
        <h1 className="text-3xl font-bold">{row.judul}</h1>
      </header>
      {row.thumbnailPath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getPublicUrl(row.thumbnailPath)} alt={row.judul} className="aspect-[16/9] w-full rounded-xl object-cover" />
      )}
      <div className="whitespace-pre-wrap text-base leading-relaxed">{row.konten}</div>
    </article>
  );
}