import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getArsipList } from "@/lib/db/queries/konten";
import { getPublicUrl } from "@/lib/storage";
import { ArsipManager } from "@/components/super-admin/arsip-manager";

export default async function SuperAdminArsipPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const items = await getArsipList();
  const withUrl = items.map((a) => ({ ...a, fileUrl: getPublicUrl(a.filePath) }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Kelola Arsip</h1>
      <ArsipManager items={withUrl} />
    </div>
  );
}