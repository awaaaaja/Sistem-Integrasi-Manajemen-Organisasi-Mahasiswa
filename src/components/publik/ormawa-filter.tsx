"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrmawaRow = { id: string; nama: string; slug: string; jenis: string; deskripsi: string | null };

const JENIS_LABEL: Record<string, string> = {
  bem: "BEM",
  mpm: "MPM",
  hima: "HIMA",
  ukm: "UKM",
};

export function OrmawaFilter({ ormawas }: { ormawas: OrmawaRow[] }) {
  const [q, setQ] = useState("");
  const [jenis, setJenis] = useState("semua");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ormawas.filter(
      (o) =>
        (jenis === "semua" || o.jenis === jenis) &&
        (!query || o.nama.toLowerCase().includes(query) || (o.deskripsi ?? "").toLowerCase().includes(query)),
    );
  }, [q, jenis, ormawas]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Cari nama ORMAWA…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
            aria-label="Cari ORMAWA"
          />
        </div>
        <Select value={jenis} onValueChange={setJenis}>
          <SelectTrigger className="w-40" aria-label="Filter jenis ORMAWA">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Jenis</SelectItem>
            {Object.entries(JENIS_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-14 text-center">
          <Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">Tidak ada ORMAWA yang cocok.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => (
          <Link
            key={o.id}
            href={`/ormawa/${o.slug}`}
            className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md dark:hover:border-amber-500/40"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-soft font-heading text-lg font-bold text-brand dark:bg-white/10 dark:text-amber-400">
                {o.nama.charAt(0)}
              </span>
              <Badge variant="secondary">{JENIS_LABEL[o.jenis] ?? o.jenis.toUpperCase()}</Badge>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg font-bold leading-snug group-hover:text-brand dark:group-hover:text-amber-400">
                {o.nama}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{o.deskripsi}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
