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
import { galeri } from "@/lib/db/schema";

type Galeri = typeof galeri.$inferSelect;
import { formatTanggal } from "@/lib/format";
import { createGaleri, deleteGaleri } from "@/app/dashboard/super-admin/konten/actions";

export function GaleriManager({ items }: { items: (Galeri & { fotoUrl: string })[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Tambah Foto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Foto Galeri</DialogTitle>
            <DialogDescription>Foto kegiatan yang akan ditampilkan publik.</DialogDescription>
          </DialogHeader>
          <GaleriForm />
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">Belum ada foto galeri</p>
        )}
        {items.map((g) => (
          <div key={g.id} className="group flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.fotoUrl}
              alt={g.judul}
              className="aspect-[4/3] w-full rounded-lg border object-cover"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{g.judul}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTanggal(g.createdAt)}
                  {g.kategori ? ` · ${g.kategori}` : ""}
                </p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await deleteGaleri(g.id);
                    if (res?.error) toast.error(res.error);
                    else toast.success("Foto dihapus");
                  })
                }
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaleriForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-4"
      action={(formData) =>
        startTransition(async () => {
          const res = await createGaleri(formData);
          if (res?.error) toast.error(res.error);
          else toast.success("Foto ditambahkan");
        })
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="judul">Judul</Label>
        <Input id="judul" name="judul" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kategori">Kategori</Label>
        <Input id="kategori" name="kategori" placeholder="contoh: pentas seni, lomba" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="foto">Foto (jpg/png/webp, ≤5MB)</Label>
        <Input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" required />
      </div>
      <Button type="submit" disabled={pending}>
        Simpan
      </Button>
    </form>
  );
}