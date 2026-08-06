"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { arsip } from "@/lib/db/schema";

type Arsip = typeof arsip.$inferSelect;
import { formatTanggal } from "@/lib/format";
import { createArsip, deleteArsip } from "@/app/dashboard/super-admin/konten/actions";

export function ArsipManager({ items }: { items: (Arsip & { fileUrl: string })[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Tambah Arsip</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Arsip Dokumen</DialogTitle>
            <DialogDescription>Dokumen publik seperti SK, pedoman, atau laporan (pdf/jpg/png, ≤5MB).</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            action={(formData) =>
              startTransition(async () => {
                const res = await createArsip(formData);
                if (res?.error) toast.error(res.error);
                else toast.success("Arsip ditambahkan");
              })
            }
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" name="judul" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Input id="kategori" name="kategori" placeholder="contoh: SK, pedoman, laporan" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input id="tahun" name="tahun" placeholder="contoh: 2025/2026" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="file">File (pdf/jpg/png, ≤5MB)</Label>
              <Input id="file" name="file" type="file" accept="application/pdf,image/jpeg,image/png" required />
            </div>
            <Button type="submit" disabled={pending}>
              Simpan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Diunggah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada arsip
              </TableCell>
            </TableRow>
          )}
          {items.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.judul}</TableCell>
              <TableCell>
                {a.kategori ? <Badge variant="secondary">{a.kategori}</Badge> : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>{a.tahun}</TableCell>
              <TableCell>{formatTanggal(a.createdAt)}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    Buka
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await deleteArsip(a.id);
                      if (res?.error) toast.error(res.error);
                      else toast.success("Arsip dihapus");
                    })
                  }
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}