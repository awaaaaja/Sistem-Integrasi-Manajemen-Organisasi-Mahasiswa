import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProposals } from "@/lib/db/queries/proposal";
import { getProgramKerja } from "@/lib/db/queries/programKerja";
import { ProposalList } from "@/components/ormawa/proposal-list";

export default async function ProposalListPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";
  const [proposals, programKerja] = await Promise.all([
    getProposals(session, { ormawaId }),
    getProgramKerja(session, ormawaId),
  ]);

  return <ProposalList ormawaId={ormawaId} proposals={proposals} programKerja={programKerja} />;
}