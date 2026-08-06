"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewLpj } from "@/app/dashboard/reviewer/actions";

type Lpj = {
  id: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
  proposalJudul: string;
};
type Log = {
  id: string;
  action: string;
  catatan: string | null;
  statusSebelum: string | null;
  statusSesudah: string;
  createdAt: Date;
};

export function ReviewLpjForm({
  lpj,
  logs,
  fileLpjUrl,
  fileBuktiUrl,
}: {
  lpj: Lpj;
  logs: Log[];
  fileLpjUrl: string | null;
  fileBuktiUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const isDiajukan = lpj.status === "diajukan";

  const submit = (action: "disetujui" | "ditolak" | "revisi") => (formData: FormData) =>
    startTransition(async () => {
      const catatan = String(formData.get("catatan") ?? "");
      const res = await reviewLpj(lpj.id, action, catatan);
      if (res?.error) toast.error(res.error);
      else toast.success("Keputusan tersimpan");
    });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{lpj.judul}</CardTitle>
          <CardDescription>
            Proposal: {lpj.proposalJudul} · Status: <Badge variant="default">{lpj.status}</Badge>
            {lpj.submittedAt && ` · Diajukan ${lpj.submittedAt.toLocaleDateString("id-ID")}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-3">
            {fileLpjUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={fileLpjUrl} target="_blank" rel="noopener noreferrer">
                  Lihat LPJ
                </a>
              </Button>
            )}
            {fileBuktiUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={fileBuktiUrl} target="_blank" rel="noopener noreferrer">
                  Lihat Bukti Pengeluaran
                </a>
              </Button>
            )}
          </div>

          {isDiajukan && (
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