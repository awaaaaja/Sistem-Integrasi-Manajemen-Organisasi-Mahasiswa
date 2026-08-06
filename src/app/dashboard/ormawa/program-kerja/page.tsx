import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProgramKerja } from "@/lib/db/queries/programKerja";
import { ProgramKerjaView } from "@/components/ormawa/program-kerja-view";

export default async function ProgramKerjaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";
  const programKerja = await getProgramKerja(session, ormawaId);

  return <ProgramKerjaView ormawaId={ormawaId} programKerja={programKerja} />;
}