"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Item = { id: string; judul: string; kategori: string | null; tanggal: string; url: string };

export function GaleriGrid({ items }: { items: Item[] }) {
  const [active, setActive] = useState<Item | null>(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((g) => (
        <Dialog key={g.id} open={active?.id === g.id} onOpenChange={(open) => setActive(open ? g : null)}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group flex cursor-zoom-in flex-col gap-2 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={`Perbesar foto: ${g.judul}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={g.judul}
                className="aspect-[4/3] w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
                loading="lazy"
              />
              <figcaption className="text-sm">
                <p className="font-medium">{g.judul}</p>
                <p className="text-muted-foreground">
                  {g.tanggal}
                  {g.kategori ? ` · ${g.kategori}` : ""}
                </p>
              </figcaption>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl overflow-hidden rounded-xl bg-card p-0" showCloseButton>
            <DialogTitle className="sr-only">{active?.judul}</DialogTitle>
            <div className="flex max-h-[75vh] flex-col overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt={g.judul} className="max-h-[62vh] w-full object-contain bg-black/5" />
              <div className="flex flex-col gap-0.5 p-4">
                <p className="font-heading text-lg font-bold">{g.judul}</p>
                <p className="text-sm text-muted-foreground">
                  {g.tanggal}
                  {g.kategori ? ` · ${g.kategori}` : ""}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
