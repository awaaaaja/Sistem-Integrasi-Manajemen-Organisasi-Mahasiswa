import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="flex flex-col gap-14 pb-16">
      <section className="bg-brand py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Organisasi Mahasiswa <span className="text-brand-accent">Universitas Adzkia</span>
          </h1>
          <p className="max-w-xl text-lg text-blue-100">
            Portal resmi Organisasi Mahasiswa — informasi kegiatan, berita, program kerja, dan partisipasi mahasiswa dalam satu tempat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-accent text-white hover:bg-yellow-700">
              <Link href="/ormawa">Jelajahi ORMAWA</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/aspirasi">Sampaikan Aspirasi</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-3">
        <StatCard label="Organisasi Aktif" value={orgCount} />
        <StatCard label="Berita & Pengumuman" value={berita.length} />
        <StatCard label="Program Unggulan" value={programList.length} />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <SectionHeader title="Berita Terbaru" href="/berita" />
        <div className="grid gap-4 sm:grid-cols-3">
          {berita.length === 0 && <p className="text-muted-foreground">Belum ada berita.</p>}
          {berita.map((b) => (
            <Link key={b.id} href={`/berita/${b.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                {b.thumbnailPath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getPublicUrl(b.thumbnailPath)} alt={b.judul} className="aspect-[16/9] w-full rounded-t-lg object-cover" loading="lazy" />
                )}
                <CardHeader className="pt-4">
                  <CardDescription>{formatTanggal(b.publishedAt)}</CardDescription>
                  <CardTitle className="line-clamp-2 text-base">{b.judul}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <SectionHeader title="Program Unggulan" href="/ormawa" />
        <div className="grid gap-4 sm:grid-cols-3">
          {programList.length === 0 && <p className="text-muted-foreground">Belum ada program unggulan.</p>}
          {programList.map((p) => (
            <Card key={`${p.ormawaSlug}-${p.judul}`}>
              <CardHeader>
                <CardDescription className="text-brand-accent">
                  {p.ormawaNama} · {p.tahun}
                </CardDescription>
                <CardTitle className="text-base">{p.judul}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{p.deskripsi}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl text-brand">{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link href={href} className="text-sm text-brand hover:underline">
        Lihat semua
      </Link>
    </div>
  );
}