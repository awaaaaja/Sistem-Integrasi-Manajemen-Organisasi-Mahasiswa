import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { getGaleriPublikList, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";
import { GaleriGrid } from "@/components/publik/galeri-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Galeri — SIM ORMAWA",
  description: "Dokumentasi foto kegiatan Organisasi Mahasiswa Universitas Adzkia.",
};

export default async function GaleriPage() {
  const items = await safePub(getGaleriPublikList, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Dokumentasi
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Galeri Kegiatan</h1>
        <p className="text-muted-foreground">Dokumentasi foto kegiatan Organisasi Mahasiswa Universitas Adzkia.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-14 text-center">
          <Camera className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">Belum ada foto.</p>
        </div>
      ) : (
        <GaleriGrid
          items={items.map((g) => ({
            id: g.id,
            judul: g.judul,
            kategori: g.kategori,
            tanggal: formatTanggal(g.createdAt),
            url: getPublicUrl(g.fotoPath),
          }))}
        />
      )}
    </div>
  );
}
