import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDivisi } from "@/lib/db/queries/divisi";
import { DivisiView } from "@/components/ormawa/divisi-view";

export default async function DivisiPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";
  const divisi = await getDivisi(session, ormawaId);

  return (
    <DivisiView ormawaId={ormawaId} divisi={divisi} />
  );
}