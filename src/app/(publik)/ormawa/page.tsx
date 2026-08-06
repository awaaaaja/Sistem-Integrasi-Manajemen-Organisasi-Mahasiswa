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
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">Direktori ORMAWA</h1>
        <p className="text-muted-foreground">
          {ormawas.length} organisasi mahasiswa aktif. Klik untuk melihat profil lengkap.
        </p>
      </div>
      <OrmawaFilter ormawas={ormawas} />
    </div>
  );
}