import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
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
    <article className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12">
      <Link
        href="/berita"
        className="mb-8 flex items-center gap-2 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua Berita
      </Link>

      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          {formatTanggal(row.publishedAt ?? row.createdAt)}
        </p>
        <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{row.judul}</h1>
        <span className="mt-1 h-1 w-16 bg-accent-strong dark:bg-amber-400" aria-hidden="true" />
      </header>

      {row.thumbnailPath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getPublicUrl(row.thumbnailPath)}
          alt={row.judul}
          className="my-8 aspect-[16/9] w-full rounded-xl object-cover"
        />
      )}

      <div className="whitespace-pre-wrap font-heading text-xl leading-relaxed">{row.konten}</div>
    </article>
  );
}
