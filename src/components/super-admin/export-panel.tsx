"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Ormawa = { id: string; nama: string };

const STATUSES = ["draft", "diajukan", "revisi", "disetujui", "ditolak"];

function bulanKePeriode(bulan: string): { from?: string; to?: string } {
  if (!bulan) return {};
  const [tahun, bulanIdx] = bulan.split("-").map(Number);
  const from = new Date(tahun, bulanIdx - 1, 1);
  const to = new Date(tahun, bulanIdx, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function ExportPanel({ ormawas }: { ormawas: Ormawa[] }) {
  const [ormawaId, setOrmawaId] = useState("");
  const [status, setStatus] = useState("");
  const [bulan, setBulan] = useState("");
  const periode = bulanKePeriode(bulan);

  const params = new URLSearchParams();
  if (ormawaId) params.set("ormawaId", ormawaId);
  if (status) params.set("status", status);
  if (periode.from) params.set("from", periode.from);
  if (periode.to) params.set("to", periode.to);
  const qs = params.toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Laporan</CardTitle>
        <CardDescription>Metadata proposal & LPJ (rekap, bukan rincian RAB).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label>ORMAWA</Label>
            <Select value={ormawaId} onValueChange={setOrmawaId}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">Semua</SelectItem>
                {ormawas.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">Semua</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="bulan">Periode (bulan)</Label>
            <Input id="bulan" type="month" value={bulan} onChange={(e) => setBulan(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <a href={`/api/export/proposals${qs ? `?${qs}` : ""}`}>Export Excel (Proposal)</a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            aria-disabled={!ormawaId}
            className={!ormawaId ? "pointer-events-none opacity-50" : ""}
          >
            <a href={`/api/export/lpj?ormawaId=${ormawaId || "x"}`}>Export PDF (LPJ per ORMAWA)</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}