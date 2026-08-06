import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrmawaList } from "@/lib/db/queries/ormawa";
import { ExportPanel } from "@/components/super-admin/export-panel";

export default async function SuperAdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const ormawas = await getOrmawaList(session, { includeNonaktif: true });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Dashboard Super Admin</h1>
      <ExportPanel ormawas={ormawas.map((o) => ({ id: o.id, nama: o.nama }))} />
    </div>
  );
}