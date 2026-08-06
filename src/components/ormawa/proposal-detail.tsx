"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resubmitProposal } from "@/app/dashboard/ormawa/proposal/actions";

type Proposal = {
  id: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
  ormawaId: string;
};
type Log = {
  id: string;
  action: string;
  catatan: string | null;
  statusSebelum: string | null;
  statusSesudah: string;
  createdAt: Date;
};

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  diajukan: "default",
  revisi: "secondary",
  disetujui: "default",
  ditolak: "destructive",
};

export function ProposalDetail({
  proposal,
  logs,
  fileProposalUrl,
  fileRabUrl,
  lpj,
}: {
  proposal: Proposal;
  logs: Log[];
  fileProposalUrl: string | null;
  fileRabUrl: string | null;
  lpj: { id: string; judul: string; status: string } | null;
}) {
  const [pending, startTransition] = useTransition();
  const canResubmit = proposal.status === "revisi" || proposal.status === "draft";

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{proposal.judul}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant={STATUS_BADGE[proposal.status] ?? "outline"}>{proposal.status}</Badge>
            {proposal.submittedAt && `Diajukan ${proposal.submittedAt.toLocaleDateString("id-ID")}`}
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
          {canResubmit && (
            <form
              className="flex flex-col gap-3 rounded-md border p-4"
              action={(formData) =>
                startTransition(async () => {
                  const res = await resubmitProposal(proposal.ormawaId, proposal.id, formData);
                  if (res?.error) toast.error(res.error);
                  else toast.success("Proposal disubmit ulang");
                })
              }
            >
              <p className="text-sm text-muted-foreground">
                Ganti file dan submit ulang (status <b>{proposal.status}</b> → <b>diajukan</b>).
              </p>
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileProposal">File Proposal (kosongkan jika tetap)</Label>
                <Input id="fileProposal" name="fileProposal" type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileRab">File RAB (kosongkan jika tetap)</Label>
                <Input id="fileRab" name="fileRab" type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <Button type="submit" disabled={pending} size="sm" className="self-start">
                Submit Ulang
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LPJ Terkait</CardTitle>
        </CardHeader>
        <CardContent>
          {lpj ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{lpj.judul}</p>
              <Badge variant={STATUS_BADGE[lpj.status] ?? "outline"}>{lpj.status}</Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {proposal.status === "disetujui"
                ? "Proposal disetujui — LPJ bisa diajukan dari halaman LPJ."
                : "LPJ hanya bisa diajukan setelah proposal disetujui."}
            </p>
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
                      {log.statusSebelum ?? "-"} → {log.statusSesudah} ·{" "}
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
    </div>
  );
}