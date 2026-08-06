import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProposalById, getProposalLogs } from "@/lib/db/queries/proposal";
import { can } from "@/lib/auth/permissions";
import { getSignedUrl } from "@/lib/storage";
import { ReviewProposalForm } from "@/components/reviewer/review-proposal-form";

export default async function ReviewerProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const proposal = await getProposalById(session, id);
  if (!proposal) return <p>Proposal tidak ditemukan.</p>;

  const logs = (await getProposalLogs(session, id)) ?? [];

  const [fileProposalUrl, fileRabUrl] = await Promise.all([
    can(session, "read", "proposal", proposal.ormawaId) ? getSignedUrl(proposal.fileProposalPath) : null,
    proposal.fileRabPath ? getSignedUrl(proposal.fileRabPath) : null,
  ]);

  return (
    <ReviewProposalForm
      proposal={{ id: proposal.id, judul: proposal.judul, status: proposal.status, submittedAt: proposal.submittedAt }}
      logs={logs}
      fileProposalUrl={fileProposalUrl}
      fileRabUrl={fileRabUrl}
    />
  );
}