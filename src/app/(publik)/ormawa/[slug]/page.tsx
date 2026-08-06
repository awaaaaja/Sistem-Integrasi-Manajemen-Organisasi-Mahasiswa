import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAktifOrmawa, getOrmawaPublikBySlug, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default async function DetailOrmawaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await safePub(() => getOrmawaPublikBySlug(slug), null);
  if (!data) notFound();

  const { ormawa, divisi, pengurus, programUnggulan, galeri } = data;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <section className="flex flex-col gap-4">
        {ormawa.bannerPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getPublicUrl(ormawa.bannerPath)} alt={`Banner ${ormawa.nama}`} className="aspect-[21/9] w-full rounded-xl object-cover" />
        ) : (
          <div className="flex aspect-[21/9] w-full items-center justify-center rounded-xl bg-brand text-white">
            {ormawa.nama}
          </div>
        )}
        <div className="flex items-center gap-4">
          {ormawa.logoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getPublicUrl(ormawa.logoPath)} alt={`Logo ${ormawa.nama}`} className="h-16 w-16 rounded-full border object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
              {ormawa.nama.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              {ormawa.nama} <Badge variant="secondary">{ormawa.jenis.toUpperCase()}</Badge>
            </h1>
            <p className="text-muted-foreground">Organisasi Mahasiswa Universitas Adzkia</p>
          </div>
        </div>
      </section>

      {(ormawa.deskripsi || ormawa.visi || ormawa.misi) && (
        <section className="grid gap-4 lg:grid-cols-3">
          {ormawa.deskripsi && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Deskripsi</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{ormawa.deskripsi}</CardContent>
            </Card>
          )}
          {ormawa.visi && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visi</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{ormawa.visi}</CardContent>
            </Card>
          )}
          {ormawa.misi && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Misi</CardTitle>
              </CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">{ormawa.misi}</CardContent>
            </Card>
          )}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Divisi</h2>
        {divisi.length === 0 && <p className="text-muted-foreground">Belum ada data divisi.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {divisi.map((d) => (
            <Card key={d.id}>
              <CardHeader>
                <CardTitle className="text-base">{d.nama}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{d.deskripsi}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Pengurus Aktif</h2>
        {pengurus.length === 0 && <p className="text-muted-foreground">Belum ada data pengurus.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pengurus.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex flex-col items-center gap-2 pt-6 text-center">
                {p.fotoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getPublicUrl(p.fotoPath)} alt={p.nama} className="h-20 w-20 rounded-full border object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
                    {p.nama.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{p.nama}</p>
                  <p className="text-sm text-brand-accent">{p.jabatan}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Program Unggulan</h2>
        {programUnggulan.length === 0 && <p className="text-muted-foreground">Belum ada program unggulan.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programUnggulan.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardDescription className="text-brand-accent">{p.tahun}</CardDescription>
                <CardTitle className="text-base">{p.judul}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.deskripsi}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {galeri.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Galeri Kegiatan</h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galeri.map((g) => (
              <figure key={g.id} className="flex flex-col gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getPublicUrl(g.fotoPath)} alt={g.judul} className="aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />
                <figcaption className="text-sm text-muted-foreground">{g.judul}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}