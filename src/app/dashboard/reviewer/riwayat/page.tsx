import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getReviewerLogs } from "@/lib/db/queries/proposal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReviewerRiwayatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const logs = await getReviewerLogs(session);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Review Saya</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada review yang dilakukan.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map((log) => (
              <li key={log.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{log.action}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {log.reviewableType} · {log.statusSebelum ?? "-"} → {log.statusSesudah} ·{" "}
                    {log.createdAt.toLocaleString("id-ID")}
                  </span>
                </div>
                {log.catatan && <p className="mt-2 text-sm text-muted-foreground">{log.catatan}</p>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}