import Link from "next/link";
import { ArrowRight, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBeritaPublikList, getStatistikPublik, getProgramUnggulanTerbaru, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export default async function BerandaPage() {
  const [orgCount, berita, programList] = await Promise.all([
    safePub(getStatistikPublik, 0),
    safePub(() => getBeritaPublikList(3), []),
    safePub(() => getProgramUnggulanTerbaru(3), []),
  ]);

  const [featured, ...rest] = berita;

  return (
    <div className="flex flex-col">
      <section className="border-b bg-brand-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="flex flex-col items-start gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Portal Resmi Organisasi Mahasiswa
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Organisasi Mahasiswa{" "}
              <span className="text-accent-strong dark:text-amber-400">Universitas Adzkia</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Satu tempat untuk berita kegiatan, agenda, galeri, arsip, dan program kerja seluruh
              Organisasi Mahasiswa — dari BEM hingga UKM.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent-strong text-brand-dark hover:bg-amber-500">
                <Link href="/ormawa">
                  Jelajahi ORMAWA <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/aspirasi">Sampaikan Aspirasi</Link>
              </Button>
            </div>
          </div>
          <div className="border border-white/10 bg-white/5">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <StatItem label="Organisasi Aktif" value={orgCount} />
              <StatItem label="Berita & Pengumuman" value={berita.length} />
              <StatItem label="Program Unggulan" value={programList.length} />
            </div>
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-slate-400">Tahun Akademik</p>
              <p className="font-heading text-lg font-semibold text-white">2025 / 2026</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14">
        <SectionHeader title="Berita Terbaru" href="/berita" />
        {berita.length === 0 && <p className="text-muted-foreground">Belum ada berita.</p>}
        <div className="grid gap-6 lg:grid-cols-3">
          {featured && (
            <Link
              href={`/berita/${featured.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md lg:col-span-2 lg:row-span-2"
            >
              {featured.thumbnailPath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPublicUrl(featured.thumbnailPath)}
                  alt={featured.judul}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] lg:aspect-[16/8]"
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs uppercase tracking-widest text-accent-ink dark:text-amber-400">
                  {formatTanggal(featured.publishedAt ?? featured.createdAt)}
                </p>
                <h3 className="font-heading text-2xl font-bold leading-snug lg:text-3xl">{featured.judul}</h3>
                <p className="mt-auto text-sm font-medium text-accent-ink dark:text-amber-400 group-hover:underline">
                  Baca selengkapnya
                </p>
              </div>
            </Link>
          )}
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
                <h3 className="font-heading line-clamp-2 text-lg font-bold leading-snug">{b.judul}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-brand-soft/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14">
          <SectionHeader title="Program Unggulan" href="/ormawa" />
          {programList.length === 0 && <p className="text-muted-foreground">Belum ada program unggulan.</p>}
          <div className="divide-y divide-border rounded-xl border bg-card">
            {programList.map((p) => (
              <div key={`${p.ormawaSlug}-${p.judul}`} className="flex flex-col gap-1 px-5 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-accent-ink dark:text-amber-400">
                  {p.ormawaNama} · {p.tahun}
                </p>
                <div>
                  <h3 className="font-heading text-lg font-bold">{p.judul}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start gap-6 rounded-xl bg-brand-dark p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Suara Mahasiswa
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Punya masukan untuk kemahasiswaan?</h2>
            <p className="max-w-xl leading-relaxed text-slate-300">
              Aspirasi kamu dibaca dan ditindaklanjuti oleh pihak yang berwenang — rahasia dan mudah.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-accent-strong text-brand-dark hover:bg-amber-500">
            <Link href="/aspirasi">
              <MessagesSquare className="mr-2 h-4 w-4" aria-hidden="true" /> Sampaikan Aspirasi
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-5">
      <span className="font-heading text-3xl font-bold text-amber-400">{value}</span>
      <span className="text-xs leading-snug text-slate-300">{label}</span>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-brand pb-3 dark:border-amber-500/60">
      <h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-sm font-medium text-accent-ink hover:underline dark:text-amber-400">
        Lihat semua <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
