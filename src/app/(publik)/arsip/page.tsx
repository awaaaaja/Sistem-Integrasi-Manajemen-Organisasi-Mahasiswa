import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArsipPublikList, safePub } from "@/lib/db/queries/publik";
import { getPublicUrl } from "@/lib/storage";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Arsip Dokumen — SIM ORMAWA",
  description: "Dokumen publik Organisasi Mahasiswa Universitas Adzkia: SK, pedoman, dan laporan.",
};

export default async function ArsipPage() {
  const items = await safePub(getArsipPublikList, []);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12">
      <div className="flex max-w-2xl flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink dark:text-amber-400">
          Dokumen
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Arsip Dokumen</h1>
        <p className="text-muted-foreground">
          Dokumen publik Organisasi Mahasiswa Universitas Adzkia: SK, pedoman, dan laporan.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-14 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">Belum ada arsip.</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-xl border bg-card">
          {items.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
              <FileText className="h-8 w-8 shrink-0 text-accent-ink dark:text-amber-400" aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-base font-bold leading-snug">{a.judul}</p>
                  {a.kategori && <Badge variant="secondary">{a.kategori}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tahun {a.tahun} · Diunggah {formatTanggal(a.createdAt)}
                </p>
              </div>
              <a
                href={getPublicUrl(a.filePath)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button size="sm" variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Buka
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
