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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { kalender } from "@/lib/db/schema";

type Kalender = typeof kalender.$inferSelect;
import { formatTanggal } from "@/lib/format";
import { createKalender, updateKalender, deleteKalender } from "@/app/dashboard/super-admin/konten/actions";

function KalenderForm({ item }: { item?: Kalender | null }) {
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) =>
    startTransition(async () => {
      const res = item ? await updateKalender(item.id, formData) : await createKalender(formData);
      if (res?.error) toast.error(res.error);
      else toast.success(item ? "Acara diperbarui" : "Acara dibuat");
    });

  return (
    <form className="flex flex-col gap-4" action={submit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="judul">Judul</Label>
        <Input id="judul" name="judul" defaultValue={item?.judul ?? ""} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea id="deskripsi" name="deskripsi" rows={3} defaultValue={item?.deskripsi ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
          <Input
            id="tanggalMulai"
            name="tanggalMulai"
            type="datetime-local"
            defaultValue={item?.tanggalMulai ? new Date(item.tanggalMulai).toISOString().slice(0, 16) : undefined}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
          <Input
            id="tanggalSelesai"
            name="tanggalSelesai"
            type="datetime-local"
            defaultValue={item?.tanggalSelesai ? new Date(item.tanggalSelesai).toISOString().slice(0, 16) : undefined}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kategori">Kategori</Label>
        <Input id="kategori" name="kategori" defaultValue={item?.kategori ?? ""} placeholder="contoh: seminar, rapat, lomba" />
      </div>
      <Button type="submit" disabled={pending}>
        Simpan
      </Button>
    </form>
  );
}

export function KalenderManager({ items }: { items: Kalender[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Tambah Acara</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Acara Baru</DialogTitle>
            <DialogDescription>Masukkan agenda kegiatan yang akan ditampilkan publik.</DialogDescription>
          </DialogHeader>
          <KalenderForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada agenda
              </TableCell>
            </TableRow>
          )}
          {items.map((k) => (
            <TableRow key={k.id}>
              <TableCell className="font-medium">{k.judul}</TableCell>
              <TableCell>
                {formatTanggal(k.tanggalMulai)}
                {k.tanggalSelesai ? ` — ${formatTanggal(k.tanggalSelesai)}` : ""}
              </TableCell>
              <TableCell>
                {k.kategori ? <Badge variant="secondary">{k.kategori}</Badge> : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Acara</DialogTitle>
                    </DialogHeader>
                    <KalenderForm item={k} />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await deleteKalender(k.id);
                      if (res?.error) toast.error(res.error);
                      else toast.success("Acara dihapus");
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