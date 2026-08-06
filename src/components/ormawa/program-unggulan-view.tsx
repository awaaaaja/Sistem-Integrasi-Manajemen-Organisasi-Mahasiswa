"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProgramUnggulan, updateProgramUnggulan, deleteProgramUnggulan } from "@/app/dashboard/ormawa/program-unggulan/actions";

type ProgramUnggulan = { id: string; judul: string; deskripsi: string | null; tahun: string };

export function ProgramUnggulanView({ ormawaId, programUnggulan }: { ormawaId: string; programUnggulan: ProgramUnggulan[] }) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ProgramUnggulan | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Unggulan</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form
          className="grid grid-cols-2 gap-3"
          action={(formData) =>
            startTransition(async () => {
              const res = editing
                ? await updateProgramUnggulan(ormawaId, editing.id, formData)
                : await createProgramUnggulan(ormawaId, formData);
              if (res?.error) toast(res.error);
              else {
                toast(editing ? "Program diperbarui" : "Program ditambahkan");
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
            <Label htmlFor="tahun">Tahun</Label>
            <Input id="tahun" name="tahun" defaultValue={editing?.tahun ?? ""} placeholder="2026" required />
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
          {programUnggulan.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">{p.judul}</p>
                <p className="text-xs text-muted-foreground">{p.tahun}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => startTransition(async () => { await deleteProgramUnggulan(ormawaId, p.id); })}>
                  Hapus
                </Button>
              </div>
            </li>
          ))}
          {programUnggulan.length === 0 && <li className="text-sm text-muted-foreground">Belum ada program unggulan.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}