"use client";

import { useTransition, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createOrmawa } from "@/app/dashboard/super-admin/ormawa/actions";

export function CreateOrmawaForm() {
  const [pending, startTransition] = useTransition();
  const [jenis, setJenis] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Tambah ORMAWA</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah ORMAWA Baru</DialogTitle>
          <DialogDescription>Super admin bisa menambah ORMAWA baru.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          action={(formData) =>
            startTransition(async () => {
              const res = await createOrmawa(formData);
              if (res?.error) toast.error(res.error);
              else toast.success("ORMAWA dibuat");
            })
          }
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="hima-enterprise" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Jenis</Label>
            <Select value={jenis} onValueChange={setJenis} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                {["bem", "mpm", "hima", "ukm"].map((j) => (
                  <SelectItem key={j} value={j}>
                    {j.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="jenis" value={jenis} />
          </div>
          <Button type="submit" disabled={pending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}