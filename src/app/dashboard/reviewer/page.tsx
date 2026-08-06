import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getReviewQueue } from "@/lib/db/queries/proposal";
import { ReviewerQueue } from "@/components/reviewer/reviewer-queue";

export default async function ReviewerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const queue = await getReviewQueue(session);

  return <ReviewerQueue proposals={queue} />;
}