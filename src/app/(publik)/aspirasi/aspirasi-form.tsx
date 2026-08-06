"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HONEYPOT_FIELD } from "@/lib/validations/konten";
import { submitAspirasi } from "./actions";

export function AspirasiForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sampaikan Aspirasi</CardTitle>
        <CardDescription>
          Aspirasi kamu untuk KM Universitas Adzkia — akan dibaca dan ditindaklanjuti oleh pihak yang berwenang.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            Terima kasih, aspirasi kamu sudah terkirim dan akan ditindaklanjuti.
          </p>
        ) : (
          <form
            className="flex flex-col gap-4"
            action={(formData) =>
              startTransition(async () => {
                const res = await submitAspirasi(formData);
                if (res?.error) toast.error(res.error);
                else {
                  toast.success("Aspirasi terkirim");
                  setSent(true);
                }
              })
            }
          >
            {/* Honeypot anti-bot: disembunyikan dari manusia via CSS */}
            <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
              <Label htmlFor={HONEYPOT_FIELD}>Jangan diisi</Label>
              <Input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="namaPengirim">Nama</Label>
                <Input id="namaPengirim" name="namaPengirim" required />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="pesan">Pesan</Label>
              <Textarea id="pesan" name="pesan" rows={5} required />
            </div>
            <Button type="submit" disabled={pending} className="self-start">
              Kirim Aspirasi
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}