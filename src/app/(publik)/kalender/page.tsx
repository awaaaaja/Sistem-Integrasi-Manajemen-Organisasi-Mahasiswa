import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getKalenderPublikList, safePub } from "@/lib/db/queries/publik";
import { formatTanggal } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kalender Kegiatan — SIM ORMAWA",
  description: "Agenda kegiatan seluruh Organisasi Mahasiswa Universitas Adzkia.",
};

export default async function KalenderPage() {
  const items = await safePub(getKalenderPublikList, []);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Kalender Kegiatan</h1>
      {items.length === 0 && <p className="text-muted-foreground">Belum ada agenda.</p>}
      <div className="flex flex-col gap-3">
        {items.map((k) => (
          <Card key={k.id}>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <CardTitle className="text-base">{k.judul}</CardTitle>
              {k.kategori && <Badge variant="secondary">{k.kategori}</Badge>}
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm font-medium text-brand">
                {formatTanggal(k.tanggalMulai)}
                {k.tanggalSelesai ? ` — ${formatTanggal(k.tanggalSelesai)}` : ""}
              </p>
              {k.deskripsi && <p className="text-sm text-muted-foreground">{k.deskripsi}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}