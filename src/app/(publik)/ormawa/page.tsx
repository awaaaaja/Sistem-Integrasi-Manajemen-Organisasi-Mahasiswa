import type { Metadata } from "next";
import { getAktifOrmawa, safePub } from "@/lib/db/queries/publik";
import { OrmawaFilter } from "@/components/publik/ormawa-filter";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Direktori ORMAWA — SIM ORMAWA",
  description: "Daftar Organisasi Mahasiswa aktif Universitas Adzkia: BEM, MPM, HIMA, dan UKM.",
};

export default async function DirektoriPage() {
  const ormawas = await safePub(getAktifOrmawa, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Direktori
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Direktori ORMAWA</h1>
        <p className="text-muted-foreground">
          {ormawas.length} organisasi mahasiswa aktif di Universitas Adzkia. Klik kartu untuk melihat
          profil lengkap.
        </p>
      </div>
      <OrmawaFilter ormawas={ormawas} />
    </div>
  );
}