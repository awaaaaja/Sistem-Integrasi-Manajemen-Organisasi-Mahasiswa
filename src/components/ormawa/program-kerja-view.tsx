"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProgramKerja, updateProgramKerja, deleteProgramKerja } from "@/app/dashboard/ormawa/program-kerja/actions";

type ProgramKerja = { id: string; judul: string; deskripsi: string | null; targetWaktu: Date | null };

export function ProgramKerjaView({ ormawaId, programKerja }: { ormawaId: string; programKerja: ProgramKerja[] }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ProgramKerja | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Kerja</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          className="grid grid-cols-2 gap-3"
          action={(formData) =>
            startTransition(async () => {
              const res = editing
                ? await updateProgramKerja(ormawaId, editing.id, formData)
                : await createProgramKerja(ormawaId, formData);
              if (res?.error) toast.error(res.error);
              else {
                toast.success(editing ? "Program kerja diperbarui" : "Program kerja ditambahkan");
                setEditing(null);
              }
            })
          }
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="judul">Judul</Label>
            <Input id="judul" name="judul" defaultValue={editing?.judul ?? ""} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="targetWaktu">Target Waktu</Label>
            <Input id="targetWaktu" name="targetWaktu" type="date" />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" name="deskripsi" defaultValue={editing?.deskripsi ?? ""} />
          </div>
          <div className="col-span-2 flex gap-2">
            <Button type="submit" disabled={pending}>
              {editing ? "Simpan" : "Tambah"}
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Batal
              </Button>
            )}
          </div>
        </form>
        <ul className="flex flex-col gap-2">
          {programKerja.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{p.judul}</p>
                {p.deskripsi && <p className="text-sm text-muted-foreground">{p.deskripsi}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => startTransition(async () => { await deleteProgramKerja(ormawaId, p.id); })}
                >
                  Hapus
                </Button>
              </div>
            </li>
          ))}
          {programKerja.length === 0 && <li className="text-sm text-muted-foreground">Belum ada program kerja.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}