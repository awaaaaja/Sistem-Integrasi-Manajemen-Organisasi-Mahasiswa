import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBeritaList } from "@/lib/db/queries/konten";
import { BeritaManager } from "@/components/super-admin/berita-manager";

export default async function SuperAdminBeritaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const beritaList = await getBeritaList();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Kelola Berita</h1>
      <BeritaManager beritaList={beritaList} />
    </div>
  );
}