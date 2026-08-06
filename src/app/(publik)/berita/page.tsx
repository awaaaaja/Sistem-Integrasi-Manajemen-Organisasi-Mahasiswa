import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Berita & Pengumuman</h1>
      {berita.length === 0 && <p className="text-muted-foreground">Belum ada berita.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {berita.map((b) => (
          <Link key={b.id} href={`/berita/${b.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              {b.thumbnailPath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getPublicUrl(b.thumbnailPath)} alt={b.judul} className="aspect-[16/9] w-full rounded-t-lg object-cover" loading="lazy" />
              )}
              <CardHeader className="pt-4">
                <CardDescription>{formatTanggal(b.publishedAt ?? b.createdAt)}</CardDescription>
                <CardTitle className="line-clamp-2 text-base">{b.judul}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}