import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getReviewQueue } from "@/lib/db/queries/proposal";
import { getLpjReviewQueue } from "@/lib/db/queries/lpj";
import { ReviewerQueue } from "@/components/reviewer/reviewer-queue";

export default async function ReviewerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const [queue, lpjQueue] = await Promise.all([getReviewQueue(session), getLpjReviewQueue(session)]);

  return <ReviewerQueue proposals={queue} lpjQueue={lpjQueue} />;
}