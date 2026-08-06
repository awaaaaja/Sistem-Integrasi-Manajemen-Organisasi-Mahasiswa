import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProgramUnggulan } from "@/lib/db/queries/programUnggulan";
import { ProgramUnggulanView } from "@/components/ormawa/program-unggulan-view";

export default async function ProgramUnggulanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";
  const programUnggulan = await getProgramUnggulan(session, ormawaId);

  return (
    <ProgramUnggulanView ormawaId={ormawaId} programUnggulan={programUnggulan} />
  );
}