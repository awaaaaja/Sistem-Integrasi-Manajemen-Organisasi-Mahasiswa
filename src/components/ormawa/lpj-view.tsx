"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { submitLpj, resubmitLpj } from "@/app/dashboard/ormawa/lpj/actions";

type Lpj = {
  id: string;
  proposalId: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
  proposalJudul: string;
};
type Proposal = { id: string; judul: string };

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  diajukan: "default",
  revisi: "secondary",
  disetujui: "default",
  ditolak: "destructive",
};

export function LpjView({ lpjList, eligibleProposals }: { lpjList: Lpj[]; eligibleProposals: Proposal[] }) {
  const [pending, startTransition] = useTransition();
  const [proposalId, setProposalId] = useState("");
  const [resubmitId, setResubmitId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {eligibleProposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ajukan LPJ</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-2 gap-3"
              action={(formData) =>
                startTransition(async () => {
                  const res = await submitLpj(formData);
                  if (res?.error) toast.error(res.error);
                  else toast.success("LPJ diajukan");
                })
              }
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor="judul">Judul LPJ</Label>
                <Input id="judul" name="judul" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Proposal Disetujui</Label>
                <Select value={proposalId} onValueChange={setProposalId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih proposal" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleProposals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.judul}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="proposalId" value={proposalId} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileLpj">File LPJ (pdf/jpg/png, ≤5MB)</Label>
                <Input id="fileLpj" name="fileLpj" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileBuktiPengeluaran">File Bukti Pengeluaran (pdf/jpg/png, ≤5MB)</Label>
                <Input id="fileBuktiPengeluaran" name="fileBuktiPengeluaran" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="col-span-2">
                <Button type="submit" disabled={pending}>
                  Ajukan LPJ
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar LPJ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul LPJ</TableHead>
                <TableHead>Proposal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lpjList.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.judul}</TableCell>
                  <TableCell>{l.proposalJudul}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[l.status] ?? "outline"}>{l.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {(l.status === "revisi" || l.status === "draft") && (
                      <Button size="sm" variant="outline" onClick={() => setResubmitId(resubmitId === l.id ? null : l.id)}>
                        Submit Ulang
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {lpjList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada LPJ.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {resubmitId && (
            <form
              className="mt-4 grid grid-cols-2 gap-3 rounded-md border p-4"
              action={(formData) =>
                startTransition(async () => {
                  const res = await resubmitLpj(resubmitId, formData);
                  if (res?.error) toast.error(res.error);
                  else {
                    toast.success("LPJ disubmit ulang");
                    setResubmitId(null);
                  }
                })
              }
            >
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileLpj">File LPJ (kosongkan jika tetap)</Label>
                <Input id="fileLpj" name="fileLpj" type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="fileBuktiPengeluaran">File Bukti Pengeluaran (kosongkan jika tetap)</Label>
                <Input id="fileBuktiPengeluaran" name="fileBuktiPengeluaran" type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit" disabled={pending} size="sm">
                  Simpan & Submit Ulang
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setResubmitId(null)}>
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}