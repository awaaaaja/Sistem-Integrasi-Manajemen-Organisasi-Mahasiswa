"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewProposal } from "@/app/dashboard/reviewer/actions";

type Proposal = {
  id: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
};
type Log = {
  id: string;
  action: string;
  catatan: string | null;
  statusSebelum: string | null;
  statusSesudah: string;
  createdAt: Date;
};

export function ReviewProposalForm({
  proposal,
  logs,
  fileProposalUrl,
  fileRabUrl,
}: {
  proposal: Proposal;
  logs: Log[];
  fileProposalUrl: string | null;
  fileRabUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const isDiajukan = proposal.status === "diajukan";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{proposal.judul}</CardTitle>
          <CardDescription>
            Status: <Badge variant="default">{proposal.status}</Badge>
            {proposal.submittedAt && ` · Diajukan ${proposal.submittedAt.toLocaleDateString("id-ID")}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-3">
            {fileProposalUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={fileProposalUrl} target="_blank" rel="noopener noreferrer">
                  Lihat Proposal
                </a>
              </Button>
            )}
            {fileRabUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={fileRabUrl} target="_blank" rel="noopener noreferrer">
                  Lihat RAB
                </a>
              </Button>
            )}
          </div>

          {isDiajukan && (
            <ReviewDecisionForm proposalId={proposal.id} pending={pending} startTransition={startTransition} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Review</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada riwayat.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {logs.map((log) => (
                <li key={log.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.action}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {log.statusSebelum ?? "-"} → {log.statusSesudah} · {log.createdAt.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {log.catatan && <p className="mt-2 text-sm text-muted-foreground">{log.catatan}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewDecisionForm({
  proposalId,
  pending,
  startTransition,
}: {
  proposalId: string;
  pending: boolean;
  startTransition: (fn: () => void) => void;
}) {
  const submit = (action: "disetujui" | "ditolak" | "revisi") => (formData: FormData) =>
    startTransition(async () => {
      const catatan = String(formData.get("catatan") ?? "");
      const res = await reviewProposal(proposalId, action, catatan);
      if (res?.error) toast.error(res.error);
      else toast.success("Keputusan tersimpan");
    });

  return (
    <form className="flex flex-col gap-3 rounded-md border p-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="catatan">Catatan (wajib untuk revisi/tolak)</Label>
        <Textarea id="catatan" name="catatan" placeholder="Tulis catatan untuk ORMAWA pengaju…" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" formAction={submit("disetujui")} disabled={pending} variant="default">
          Setujui
        </Button>
        <Button type="submit" formAction={submit("revisi")} disabled={pending} variant="secondary">
          Minta Revisi
        </Button>
        <Button type="submit" formAction={submit("ditolak")} disabled={pending} variant="destructive">
          Tolak
        </Button>
      </div>
    </form>
  );
}