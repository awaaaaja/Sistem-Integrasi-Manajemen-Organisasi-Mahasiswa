import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrmawaList } from "@/lib/db/queries/ormawa";
import { CreateOrmawaForm } from "@/components/ormawa/create-ormawa-form";
import { OrmawaTable } from "@/components/ormawa/ormawa-table";

export default async function SuperAdminOrmawaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") {
    redirect("/dashboard/super-admin");
  }

  const ormawas = await getOrmawaList(session, { includeNonaktif: true });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Kelola ORMAWA</h1>
        <CreateOrmawaForm />
      </div>
      <OrmawaTable ormawas={ormawas} />
    </div>
  );
}