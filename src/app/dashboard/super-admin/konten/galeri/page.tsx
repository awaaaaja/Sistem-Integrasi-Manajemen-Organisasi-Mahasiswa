import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getGaleriList } from "@/lib/db/queries/konten";
import { getPublicUrl } from "@/lib/storage";
import { GaleriManager } from "@/components/super-admin/galeri-manager";

export default async function SuperAdminGaleriPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const items = await getGaleriList();
  const withUrl = items.map((g) => ({ ...g, fotoUrl: getPublicUrl(g.fotoPath) }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Kelola Galeri</h1>
      <GaleriManager items={withUrl} />
    </div>
  );
}