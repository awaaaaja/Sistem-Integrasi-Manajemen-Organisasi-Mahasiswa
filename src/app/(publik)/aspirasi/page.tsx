import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { AspirasiForm } from "./aspirasi-form";

export const metadata: Metadata = {
  title: "Aspirasi — SIM ORMAWA",
  description: "Sampaikan aspirasi untuk KM Universitas Adzkia",
};

export default function AspirasiPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand dark:bg-white/10 dark:text-amber-400">
          <MessagesSquare className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="font-heading text-4xl font-bold tracking-tight">Sampaikan Aspirasi</h1>
        <p className="text-muted-foreground">
          Aspirasi kamu untuk KM Universitas Adzkia — dibaca dan ditindaklanjuti oleh pihak yang berwenang.
        </p>
      </div>
      <AspirasiForm />
    </div>
  );
}
