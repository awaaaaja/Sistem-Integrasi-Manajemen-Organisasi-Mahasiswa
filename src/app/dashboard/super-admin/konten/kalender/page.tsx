import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getKalenderList } from "@/lib/db/queries/konten";
import { KalenderManager } from "@/components/super-admin/kalender-manager";

export default async function SuperAdminKalenderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const items = await getKalenderList();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Kelola Kalender</h1>
      <KalenderManager items={items} />
    </div>
  );
}