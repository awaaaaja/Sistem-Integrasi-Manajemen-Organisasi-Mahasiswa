"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrmawaRow = { id: string; nama: string; slug: string; jenis: string; deskripsi: string | null };

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Cari nama ORMAWA…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
          aria-label="Cari ORMAWA"
        />
        <Select value={jenis} onValueChange={setJenis}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Jenis</SelectItem>
            {["bem", "mpm", "hima", "ukm"].map((j) => (
              <SelectItem key={j} value={j}>
                {j.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 && <p className="text-muted-foreground">Tidak ada ORMAWA yang cocok.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => (
          <Link key={o.id} href={`/ormawa/${o.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{o.nama}</CardTitle>
                  <Badge variant="secondary">{o.jenis.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="line-clamp-3 text-sm text-muted-foreground">{o.deskripsi}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}