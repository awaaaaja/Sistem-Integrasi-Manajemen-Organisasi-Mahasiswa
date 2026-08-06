import type { Metadata } from "next";
import { getGaleriPublikList, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Galeri — SIM ORMAWA",
  description: "Dokumentasi foto kegiatan Organisasi Mahasiswa Universitas Adzkia.",
};

export default async function GaleriPage() {
  const items = await safePub(getGaleriPublikList, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Galeri Kegiatan</h1>
      {items.length === 0 && <p className="text-muted-foreground">Belum ada foto.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <figure key={g.id} className="group flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getPublicUrl(g.fotoPath)} alt={g.judul} className="aspect-[4/3] w-full rounded-lg object-cover transition-opacity group-hover:opacity-90" loading="lazy" />
            <figcaption className="text-sm">
              <p className="font-medium">{g.judul}</p>
              <p className="text-muted-foreground">{formatTanggal(g.createdAt)}{g.kategori ? ` · ${g.kategori}` : ""}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}