"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
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
import { submitProposal } from "@/app/dashboard/ormawa/proposal/actions";

type Proposal = {
  id: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
};
type ProgramKerja = { id: string; judul: string };

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  diajukan: "default",
  revisi: "secondary",
  disetujui: "default",
  ditolak: "destructive",
};

const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: "judul",
    header: "Judul",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={STATUS_BADGE[row.original.status] ?? "outline"}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Diajukan",
    cell: ({ row }) => row.original.submittedAt?.toLocaleDateString("id-ID") ?? "-",
  },
  {
    id: "detail",
    header: "Detail",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/dashboard/ormawa/proposal/${row.original.id}`}>Lihat</Link>
      </Button>
    ),
  },
];

export function ProposalList({ ormawaId, proposals, programKerja }: { ormawaId: string; proposals: Proposal[]; programKerja: ProgramKerja[] }) {
  const [pending, startTransition] = useTransition();
  const [programKerjaId, setProgramKerjaId] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "submittedAt", desc: true }]);

  const table = useReactTable({
    data: proposals,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Ajukan Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-2 gap-3"
            action={(formData) =>
              startTransition(async () => {
                const res = await submitProposal(ormawaId, formData);
                if (res?.error) toast.error(res.error);
                else toast.success("Proposal diajukan");
              })
            }
          >
            <div className="flex flex-col gap-1">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" name="judul" required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Program Kerja</Label>
              <Select value={programKerjaId} onValueChange={setProgramKerjaId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih program kerja" />
                </SelectTrigger>
                <SelectContent>
                  {programKerja.map((pk) => (
                    <SelectItem key={pk.id} value={pk.id}>
                      {pk.judul}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="programKerjaId" value={programKerjaId} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="fileProposal">File Proposal (pdf/jpg/png, ≤5MB)</Label>
              <Input id="fileProposal" name="fileProposal" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="fileRab">File RAB (opsional, pdf/jpg/png, ≤5MB)</Label>
              <Input id="fileRab" name="fileRab" type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="col-span-2">
              <Button type="submit" disabled={pending}>
                Ajukan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.id === "detail" ? "text-right" : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "detail" ? "text-right" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                    Belum ada proposal.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}