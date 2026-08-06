import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Arsip Dokumen</h1>
      {items.length === 0 && <p className="text-muted-foreground">Belum ada arsip.</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Diunggah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.judul}</TableCell>
              <TableCell>{a.kategori ? <Badge variant="secondary">{a.kategori}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
              <TableCell>{a.tahun}</TableCell>
              <TableCell className="text-muted-foreground">{formatTanggal(a.createdAt)}</TableCell>
              <TableCell className="text-right">
                <a href={getPublicUrl(a.filePath)} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    Buka
                  </Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}