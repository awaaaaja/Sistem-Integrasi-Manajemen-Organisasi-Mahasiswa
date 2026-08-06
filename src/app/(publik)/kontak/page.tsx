import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mail, MapPin, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kontak — SIM ORMAWA",
  description: "Hubungi Organisasi Mahasiswa Universitas Adzkia.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Hubungi Kami
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Kontak</h1>
        <p className="text-muted-foreground">
          Sekretariat Organisasi Mahasiswa KM Universitas Adzkia terbuka untuk pertanyaan dan masukan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand dark:bg-white/10 dark:text-amber-400">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
              <a href="mailto:km@universitasadzkia.ac.id" className="font-heading text-lg font-bold text-brand hover:underline dark:text-amber-400">
                km@universitasadzkia.ac.id
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t pt-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand dark:bg-white/10 dark:text-amber-400">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Alamat</p>
              <p className="font-heading text-lg font-bold">Kampus Universitas Adzkia</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-xl bg-brand-dark p-8 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-amber-400">
            <MessagesSquare className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-bold">Ada masukan untuk kemahasiswaan?</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Sampaikan lewat form aspirasi — dibaca dan ditindaklanjuti oleh pihak yang berwenang.
            </p>
          </div>
          <Button asChild className="self-start bg-accent-strong text-brand-dark hover:bg-amber-500">
            <Link href="/aspirasi">
              Sampaikan Aspirasi <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
