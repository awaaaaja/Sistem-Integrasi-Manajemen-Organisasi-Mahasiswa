"use client";

import { useState } from "react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Proposal = {
  id: string;
  judul: string;
  status: string;
  submittedAt: Date | null;
  ormawaId: string;
};

const columns: ColumnDef<Proposal>[] = [
  { accessorKey: "judul", header: "Judul" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="default">{row.original.status}</Badge>,
  },
  {
    accessorKey: "submittedAt",
    header: "Diajukan",
    cell: ({ row }) => row.original.submittedAt?.toLocaleDateString("id-ID") ?? "-",
  },
  {
    id: "detail",
    header: "Aksi",
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/dashboard/reviewer/proposal/${row.original.id}`}>Review</Link>
      </Button>
    ),
  },
];

export function ReviewerQueue({ proposals }: { proposals: Proposal[] }) {
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
    <Card>
      <CardHeader>
        <CardTitle>Antrian Review Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className={header.id === "detail" ? "text-right" : undefined}>
                    {header.isPlaceholder ? null : (
                      <button type="button" onClick={header.column.getToggleSortingHandler()} className="flex items-center gap-1">
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
                  <TableCell key={cell.id} className={cell.column.id === "detail" ? "text-right" : undefined}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  Tidak ada proposal menunggu review.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}