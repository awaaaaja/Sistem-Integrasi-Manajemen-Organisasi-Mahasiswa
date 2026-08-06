"use client";

import { useTransition, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { berita } from "@/lib/db/schema";

type Berita = typeof berita.$inferSelect;
import { slugify } from "@/lib/validations/konten";
import { formatTanggal } from "@/lib/format";
import { createBerita, updateBerita, deleteBerita } from "@/app/dashboard/super-admin/konten/actions";

type FormProps = { berita?: Berita | null };

function BeritaForm({ berita }: FormProps) {
  const [pending, startTransition] = useTransition();
  const [judul, setJudul] = useState(berita?.judul ?? "");
  const [slug, setSlug] = useState(berita?.slug ?? "");

  const submit = (formData: FormData) =>
    startTransition(async () => {
      const res = berita
        ? await updateBerita(berita.id, formData)
        : await createBerita(formData);
      if (res?.error) toast.error(res.error);
      else toast.success(berita ? "Berita diperbarui" : "Berita dibuat");
    });

  return (
    <form className="flex flex-col gap-4" action={submit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="judul">Judul</Label>
        <Input
          id="judul"
          name="judul"
          value={judul}
          onChange={(e) => {
            setJudul(e.target.value);
            if (!berita) setSlug(slugify(e.target.value));
          }}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="konten">Konten</Label>
        <Textarea id="konten" name="konten" rows={8} defaultValue={berita?.konten ?? ""} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="publishedAt">Tanggal Publikasi (opsional)</Label>
        <Input
          id="publishedAt"
          name="publishedAt"
          type="datetime-local"
          defaultValue={berita?.publishedAt ? new Date(berita.publishedAt).toISOString().slice(0, 16) : undefined}
        />
      </div>
      {!berita && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="thumbnail">Thumbnail (jpg/png/webp, ≤5MB)</Label>
          <Input id="thumbnail" name="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" />
        </div>
      )}
      <Button type="submit" disabled={pending}>
        Simpan
      </Button>
    </form>
  );
}

export function BeritaManager({ beritaList }: { beritaList: Berita[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Tambah Berita</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Berita Baru</DialogTitle>
            <DialogDescription>Slug dibuat otomatis dari judul, bisa diubah manual.</DialogDescription>
          </DialogHeader>
          <BeritaForm />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Publikasi</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beritaList.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada berita
              </TableCell>
            </TableRow>
          )}
          {beritaList.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="max-w-[280px] truncate font-medium">{b.judul}</TableCell>
              <TableCell className="font-mono text-xs">{b.slug}</TableCell>
              <TableCell>{formatTanggal(b.publishedAt)}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Berita</DialogTitle>
                    </DialogHeader>
                    <BeritaForm berita={b} />
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await deleteBerita(b.id);
                      if (res?.error) toast.error(res.error);
                      else toast.success("Berita dihapus");
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