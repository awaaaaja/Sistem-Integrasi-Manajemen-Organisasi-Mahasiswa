import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLpjById, getLpjLogs } from "@/lib/db/queries/lpj";
import { can } from "@/lib/auth/permissions";
import { getSignedUrl } from "@/lib/storage";
import { ReviewLpjForm } from "@/components/reviewer/review-lpj-form";

export default async function ReviewerLpjDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const lpjRow = await getLpjById(session, id);
  if (!lpjRow) return <p>LPJ tidak ditemukan.</p>;

  const logs = (await getLpjLogs(session, id)) ?? [];

  const [fileLpjUrl, fileBuktiUrl] = await Promise.all([
    can(session, "read", "lpj", lpjRow.proposalOrmawaId) ? getSignedUrl(lpjRow.fileLpjPath) : null,
    getSignedUrl(lpjRow.fileBuktiPengeluaranPath),
  ]);

  return (
    <ReviewLpjForm
      lpj={{
        id: lpjRow.id,
        judul: lpjRow.judul,
        status: lpjRow.status,
        submittedAt: lpjRow.submittedAt,
        proposalJudul: lpjRow.proposalJudul,
      }}
      logs={logs}
      fileLpjUrl={fileLpjUrl}
      fileBuktiUrl={fileBuktiUrl}
    />
  );
}