"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
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
import { createPengurus, updatePengurus, deletePengurus } from "@/app/dashboard/ormawa/pengurus/actions";

type Pengurus = {
  id: string;
  nama: string;
  jabatan: string;
  divisiId: string | null;
  periodeMulai: Date;
  periodeSelesai: Date | null;
};
type Divisi = { id: string; nama: string };

export function PengurusView({ ormawaId, pengurus, divisi }: { ormawaId: string; pengurus: Pengurus[]; divisi: Divisi[] }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Pengurus | null>(null);
  const [divisiId, setDivisiId] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelola Pengurus</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          className="grid grid-cols-2 gap-3"
          action={(formData) =>
            startTransition(async () => {
              const res = editing
                ? await updatePengurus(ormawaId, editing.id, formData)
                : await createPengurus(ormawaId, formData);
              if (res?.error) toast(res.error);
              else {
                toast(editing ? "Pengurus diperbarui" : "Pengurus ditambahkan");
                setEditing(null);
              }
            })
          }
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" defaultValue={editing?.nama ?? ""} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="jabatan">Jabatan</Label>
            <Input id="jabatan" name="jabatan" defaultValue={editing?.jabatan ?? ""} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Divisi</Label>
            <Select value={divisiId || editing?.divisiId || "none"} onValueChange={setDivisiId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanpa divisi</SelectItem>
                {divisi.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="divisiId" value={divisiId === "none" ? "" : divisiId} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="periodeMulai">Periode Mulai</Label>
            <Input id="periodeMulai" name="periodeMulai" type="date" required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="periodeSelesai">Periode Selesai</Label>
            <Input id="periodeSelesai" name="periodeSelesai" type="date" />
          </div>
          <div className="col-span-2 flex gap-2">
            <Button type="submit" disabled={pending}>
              {editing ? "Simpan" : "Tambah"}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => { setEditing(null); setDivisiId(""); }}>
                Batal
              </Button>
            )}
          </div>
        </form>
        <ul className="flex flex-col gap-2">
          {pengurus.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  {p.nama} — {p.jabatan}
                </p>
                {p.divisiId && <p className="text-xs text-muted-foreground">Divisi {p.divisiId}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => startTransition(async () => { await deletePengurus(ormawaId, p.id); })}>
                  Hapus
                </Button>
              </div>
            </li>
          ))}
          {pengurus.length === 0 && <li className="text-sm text-muted-foreground">Belum ada pengurus.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}