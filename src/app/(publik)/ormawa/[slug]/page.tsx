import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAktifOrmawa, getOrmawaPublikBySlug, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await safePub(getAktifOrmawa, [])).map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safePub(() => getOrmawaPublikBySlug(slug), null);
  if (!data) return { title: "ORMAWA tidak ditemukan — SIM ORMAWA" };
  return {
    title: `${data.ormawa.nama} — SIM ORMAWA`,
    description: data.ormawa.deskripsi ?? `Profil ${data.ormawa.nama} Universitas Adzkia.`,
  };
}

const JENIS_LABEL: Record<string, string> = {
  bem: "BEM",
  mpm: "MPM",
  hima: "HIMA",
  ukm: "UKM",
};

export default async function DetailOrmawaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await safePub(() => getOrmawaPublikBySlug(slug), null);
  if (!data) notFound();

  const { ormawa, divisi, pengurus, programUnggulan, galeri } = data;

  return (
    <div className="flex flex-col">
      <section className="border-b bg-brand-dark text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          {ormawa.bannerPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getPublicUrl(ormawa.bannerPath)}
              alt={`Banner ${ormawa.nama}`}
              className="mb-6 aspect-[21/8] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-6 flex aspect-[21/8] w-full items-center justify-center rounded-xl bg-brand-deep">
              <span className="font-heading text-3xl font-bold text-white/20">{ormawa.nama}</span>
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            {ormawa.logoPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPublicUrl(ormawa.logoPath)}
                alt={`Logo ${ormawa.nama}`}
                className="h-20 w-20 shrink-0 rounded-2xl border border-white/20 object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 font-heading text-3xl font-bold text-amber-400">
                {ormawa.nama.charAt(0)}
              </span>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{ormawa.nama}</h1>
                <Badge className="bg-white/10 text-amber-300 hover:bg-white/10">
                  {JENIS_LABEL[ormawa.jenis] ?? ormawa.jenis.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-slate-300">Organisasi Mahasiswa Universitas Adzkia</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12">
        {ormawa.deskripsi && (
          <section className="flex max-w-3xl flex-col gap-3">
            <SectionTitle>Tentang</SectionTitle>
            <p className="text-base leading-relaxed text-muted-foreground">{ormawa.deskripsi}</p>
          </section>
        )}

        {(ormawa.visi || ormawa.misi) && (
          <section className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
            {ormawa.visi && (
              <div className="flex flex-col gap-3 border-l-2 border-brand pl-5 dark:border-amber-500/60">
                <SectionTitle>Visi</SectionTitle>
                <p className="font-heading text-xl font-medium leading-relaxed">{ormawa.visi}</p>
              </div>
            )}
            {ormawa.misi && (
              <div className="flex flex-col gap-3">
                <SectionTitle>Misi</SectionTitle>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{ormawa.misi}</p>
              </div>
            )}
          </section>
        )}

        <section className="flex flex-col gap-5">
          <SectionTitle>Divisi</SectionTitle>
          {divisi.length === 0 && <p className="text-muted-foreground">Belum ada data divisi.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {divisi.map((d) => (
              <div key={d.id} className="flex flex-col gap-1 rounded-xl border bg-card p-5">
                <h3 className="font-heading text-lg font-bold">{d.nama}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.deskripsi}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionTitle>Pengurus Aktif</SectionTitle>
          {pengurus.length === 0 && <p className="text-muted-foreground">Belum ada data pengurus.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pengurus.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center">
                {p.fotoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getPublicUrl(p.fotoPath)} alt={p.nama} className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft font-heading text-2xl font-bold text-brand dark:bg-white/10 dark:text-amber-400">
                    {p.nama.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-semibold">{p.nama}</p>
                  <p className="text-sm text-accent-ink dark:text-amber-400">{p.jabatan}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <SectionTitle>Program Unggulan</SectionTitle>
          {programUnggulan.length === 0 && <p className="text-muted-foreground">Belum ada program unggulan.</p>}
          <div className="divide-y divide-border rounded-xl border bg-card">
            {programUnggulan.map((p) => (
              <div key={p.id} className="flex flex-col gap-1 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-ink dark:text-amber-400">
                  {p.tahun}
                </p>
                <h3 className="font-heading text-lg font-bold">{p.judul}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.deskripsi}</p>
              </div>
            ))}
          </div>
        </section>

        {galeri.length > 0 && (
          <section className="flex flex-col gap-5">
            <SectionTitle>Galeri Kegiatan</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {galeri.map((g) => (
                <figure key={g.id} className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPublicUrl(g.fotoPath)}
                    alt={g.judul}
                    className="aspect-[4/3] w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                    loading="lazy"
                  />
                  <figcaption className="text-sm text-muted-foreground">{g.judul}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-2xl font-bold tracking-tight">
      {children}
      <span className="mt-1.5 block h-0.5 w-10 bg-accent-strong dark:bg-amber-400" aria-hidden="true" />
    </h2>
  );
}
