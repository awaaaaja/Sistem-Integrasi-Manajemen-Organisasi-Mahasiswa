"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfilOrmawa } from "@/app/dashboard/ormawa/profil/actions";

export function ProfilForm({ ormawa }: { ormawa: { id: string; nama: string; visi: string | null; misi: string | null; deskripsi: string | null } }) {
  const [pending, startTransition] = useTransition();
  const [visi, setVisi] = useState(ormawa.visi ?? "");
  const [misi, setMisi] = useState(ormawa.misi ?? "");
  const [deskripsi, setDeskripsi] = useState(ormawa.deskripsi ?? "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil ORMAWA</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          action={(formData) =>
            startTransition(async () => {
              const res = await updateProfilOrmawa(ormawa.id, formData);
              if (res?.error) toast(res.error);
              else toast("Profil diperbarui");
            })
          }
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" defaultValue={ormawa.nama} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="visi">Visi</Label>
            <Textarea id="visi" name="visi" value={visi} onChange={(e) => setVisi(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="misi">Misi</Label>
            <Textarea id="misi" name="misi" value={misi} onChange={(e) => setMisi(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" name="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" name="logo" type="file" accept="image/*" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="banner">Banner</Label>
            <Input id="banner" name="banner" type="file" accept="image/*" />
          </div>
          <Button type="submit" disabled={pending}>
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}