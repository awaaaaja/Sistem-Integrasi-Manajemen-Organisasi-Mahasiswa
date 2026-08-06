import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getBeritaPublikList, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Berita — SIM ORMAWA",
  description: "Berita dan pengumuman kegiatan Organisasi Mahasiswa Universitas Adzkia.",
};

export default async function BeritaListPage() {
  const berita = await safePub(() => getBeritaPublikList(50), []);
  const [featured, ...rest] = berita;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Publikasi
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Berita & Pengumuman</h1>
        <p className="text-muted-foreground">Kabar terbaru dari Organisasi Mahasiswa Universitas Adzkia.</p>
      </div>

      {berita.length === 0 && <p className="text-muted-foreground">Belum ada berita.</p>}

      {featured && (
        <Link
          href={`/berita/${featured.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md lg:grid lg:grid-cols-2"
        >
          {featured.thumbnailPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getPublicUrl(featured.thumbnailPath)}
              alt={featured.judul}
              className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          <div className="flex flex-col justify-center gap-3 p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink dark:text-amber-400">
              Terbaru · {formatTanggal(featured.publishedAt ?? featured.createdAt)}
            </p>
            <h2 className="font-heading text-2xl font-bold leading-snug lg:text-3xl">{featured.judul}</h2>
            <p className="mt-auto flex items-center gap-1 text-sm font-medium text-accent-ink group-hover:underline dark:text-amber-400">
              Baca selengkapnya <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </p>
          </div>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((b) => (
          <Link key={b.id} href={`/berita/${b.slug}`} className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
            {b.thumbnailPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPublicUrl(b.thumbnailPath)}
                alt={b.judul}
                className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            )}
            <div className="flex flex-1 flex-col gap-2 p-4">
              <p className="text-xs uppercase tracking-widest text-accent-ink dark:text-amber-400">
                {formatTanggal(b.publishedAt ?? b.createdAt)}
              </p>
              <h2 className="font-heading line-clamp-2 text-lg font-bold leading-snug">{b.judul}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
