"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Badge,
} from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  updateOrmawaStatus,
  deleteOrmawa,
} from "@/app/dashboard/super-admin/ormawa/actions";

type OrmawaRow = {
  id: string;
  nama: string;
  slug: string;
  jenis: string;
  status: string;
};

export function OrmawaTable({ ormawas }: { ormawas: OrmawaRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ormawas.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.nama}</TableCell>
            <TableCell>{o.slug}</TableCell>
            <TableCell>{o.jenis.toUpperCase()}</TableCell>
            <TableCell>
              <Badge variant={o.status === "aktif" ? "default" : "secondary"}>{o.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() =>
                      startTransition(async () => {
                        const next = o.status === "aktif" ? "nonaktif" : "aktif";
                        const res = await updateOrmawaStatus(o.id, next);
                        toast(res?.error ? res.error : `Status → ${next}`);
                      })
                    }
                  >
                    {o.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={pending}
                    onSelect={() => startTransition(() => void deleteOrmawa(o.id))}
                  >
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}