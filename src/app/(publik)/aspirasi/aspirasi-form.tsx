"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HONEYPOT_FIELD } from "@/lib/validations/konten";
import { submitAspirasi } from "./actions";

export function AspirasiForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-6 sm:p-8">
      {sent ? (
        <div className="flex flex-col gap-2 py-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand dark:bg-white/10 dark:text-amber-400">
            <Send className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="font-heading text-xl font-bold">Aspirasi terkirim</p>
          <p className="text-sm text-muted-foreground">
            Terima kasih, aspirasi kamu sudah terkirim dan akan ditindaklanjuti.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-5"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="namaPengirim">Nama</Label>
              <Input id="namaPengirim" name="namaPengirim" placeholder="Nama lengkap kamu" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="nama@example.com" required />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pesan">Pesan</Label>
            <Textarea
              id="pesan"
              name="pesan"
              rows={5}
              placeholder="Tulis aspirasi, kritik, atau saran kamu di sini…"
              required
            />
          </div>
          <Button type="submit" disabled={pending} className="self-start bg-accent-strong text-brand-dark hover:bg-amber-500">
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            {pending ? "Mengirim…" : "Kirim Aspirasi"}
          </Button>
        </form>
      )}
    </div>
  );
}
