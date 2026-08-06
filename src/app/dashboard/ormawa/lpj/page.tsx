import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLpjList } from "@/lib/db/queries/lpj";
import { getProposals } from "@/lib/db/queries/proposal";
import { LpjView } from "@/components/ormawa/lpj-view";

export default async function LpjPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const ormawaId = session.user.ormawaId ?? "";

  const [lpjList, proposals] = await Promise.all([
    getLpjList(session, ormawaId),
    getProposals(session, { ormawaId }),
  ]);

  // Form submit LPJ hanya untuk proposal disetujui (gate tetap di server action)
  const disetujui = proposals
    .filter((p) => p.status === "disetujui" && !lpjList.some((l) => l.proposalId === p.id))
    .map((p) => ({ id: p.id, judul: p.judul }));

  return <LpjView lpjList={lpjList} eligibleProposals={disetujui} />;
}