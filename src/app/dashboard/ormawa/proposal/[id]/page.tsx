import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProposalById, getProposalLogs } from "@/lib/db/queries/proposal";
import { can } from "@/lib/auth/permissions";
import { getSignedUrl } from "@/lib/storage";
import { ProposalDetail } from "@/components/ormawa/proposal-detail";

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const proposal = await getProposalById(session, id);
  if (!proposal) return <p>Proposal tidak ditemukan.</p>;

  const logs = (await getProposalLogs(session, id)) ?? [];

  // Signed URL hanya setelah lolos can() (PRD §7 poin 2)
  const [fileProposalUrl, fileRabUrl] = await Promise.all([
    can(session, "read", "proposal", proposal.ormawaId)
      ? getSignedUrl(proposal.fileProposalPath)
      : null,
    proposal.fileRabPath
      ? getSignedUrl(proposal.fileRabPath)
      : null,
  ]);

  return <ProposalDetail proposal={proposal} logs={logs} fileProposalUrl={fileProposalUrl} fileRabUrl={fileRabUrl} />;
}