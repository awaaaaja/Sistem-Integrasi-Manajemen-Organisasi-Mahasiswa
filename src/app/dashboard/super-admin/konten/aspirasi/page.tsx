import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAspirasiList } from "@/lib/db/queries/konten";
import { AspirasiManager } from "@/components/super-admin/aspirasi-manager";

export default async function SuperAdminAspirasiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  const items = await getAspirasiList();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Inbox Aspirasi</h1>
      <AspirasiManager items={items} />
    </div>
  );
}