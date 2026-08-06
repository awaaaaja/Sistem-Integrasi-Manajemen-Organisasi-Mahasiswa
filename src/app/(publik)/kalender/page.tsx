import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getKalenderPublikList, safePub } from "@/lib/db/queries/publik";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kalender Kegiatan — SIM ORMAWA",
  description: "Agenda kegiatan seluruh Organisasi Mahasiswa Universitas Adzkia.",
};

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function KalenderPage() {
  const items = await safePub(getKalenderPublikList, []);

  const grouped = items.reduce<Map<string, typeof items>>((acc, k) => {
    const d = new Date(k.tanggalMulai);
    const key = `${d.getFullYear()} ${BULAN[d.getMonth()]}`;
    const list = acc.get(key) ?? [];
    list.push(k);
    acc.set(key, list);
    return acc;
  }, new Map());

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Agenda
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Kalender Kegiatan</h1>
        <p className="text-muted-foreground">Agenda kegiatan seluruh Organisasi Mahasiswa Universitas Adzkia.</p>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-14 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">Belum ada agenda.</p>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {[...grouped.entries()].map(([bulan, list]) => (
          <section key={bulan} className="flex flex-col gap-4">
            <h2 className="flex items-baseline gap-3">
              <span className="font-heading text-2xl font-bold">{bulan.split(" ")[1]}</span>
              <span className="text-sm font-medium uppercase tracking-widest text-accent-ink dark:text-amber-400">
                {bulan.split(" ")[0]}
              </span>
            </h2>
            <div className="divide-y divide-border rounded-xl border bg-card">
              {list.map((k) => (
                <div key={k.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <p className="shrink-0 font-mono text-sm font-semibold text-brand dark:text-amber-400">
                    {formatTanggal(k.tanggalMulai)}
                    {k.tanggalSelesai ? ` – ${formatTanggal(k.tanggalSelesai)}` : ""}
                  </p>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold">{k.judul}</h3>
                      {k.kategori && <Badge variant="secondary">{k.kategori}</Badge>}
                    </div>
                    {k.deskripsi && <p className="text-sm leading-relaxed text-muted-foreground">{k.deskripsi}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
