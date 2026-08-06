import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfilForm } from "@/components/ormawa/profil-form";

export default async function ProfilOrmawaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";

  const [row] = await db.select().from(ormawa).where(eq(ormawa.id, ormawaId));
  if (!row) return <p>ORMAWA tidak ditemukan.</p>;

  return (
    <ProfilForm
      ormawa={{
        id: row.id,
        nama: row.nama,
        visi: row.visi,
        misi: row.misi,
        deskripsi: row.deskripsi,
      }}
    />
  );
}