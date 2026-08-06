import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPengurus } from "@/lib/db/queries/pengurus";
import { getDivisi } from "@/lib/db/queries/divisi";
import { PengurusView } from "@/components/ormawa/pengurus-view";

export default async function PengurusPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";
  const pengurus = await getPengurus(session, ormawaId);
  const divisi = await getDivisi(session, ormawaId);

  return (
    <PengurusView ormawaId={ormawaId} pengurus={pengurus} divisi={divisi} />
  );
}