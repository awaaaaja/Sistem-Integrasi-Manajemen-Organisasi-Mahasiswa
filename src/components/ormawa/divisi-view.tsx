"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createDivisi, updateDivisi, deleteDivisi } from "@/app/dashboard/ormawa/divisi/actions";

type Divisi = { id: string; nama: string; deskripsi: string | null };

export function DivisiView({ ormawaId, divisi }: { ormawaId: string; divisi: Divisi[] }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Divisi | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Kelola Divisi</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form
            className="flex gap-2"
            action={(formData) =>
              startTransition(async () => {
                const res = editing
                  ? await updateDivisi(ormawaId, editing.id, formData)
                  : await createDivisi(ormawaId, formData);
                if (res?.error) toast(res.error);
                else {
                  toast(editing ? "Divisi diperbarui" : "Divisi ditambahkan");
                  setEditing(null);
                }
              })
            }
          >
            <Input name="nama" placeholder="Nama divisi" defaultValue={editing?.nama ?? ""} required />
            <Input name="deskripsi" placeholder="Deskripsi (opsional)" defaultValue={editing?.deskripsi ?? ""} />
            <Button type="submit" disabled={pending}>
              {editing ? "Simpan" : "Tambah"}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Batal
              </Button>
            )}
          </form>
          <ul className="flex flex-col gap-2">
            {divisi.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">{d.nama}</p>
                  {d.deskripsi && <p className="text-sm text-muted-foreground">{d.deskripsi}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(d)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => startTransition(async () => { await deleteDivisi(ormawaId, d.id); })}>
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
            {divisi.length === 0 && <li className="text-sm text-muted-foreground">Belum ada divisi.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}