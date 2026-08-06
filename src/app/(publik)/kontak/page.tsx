import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Kontak — SIM ORMAWA",
  description: "Hubungi Organisasi Mahasiswa Universitas Adzkia.",
};

export default function KontakPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Kontak</h1>
      <Card>
        <CardHeader>
          <CardTitle>KM Universitas Adzkia</CardTitle>
          <CardDescription>Sekretariat Organisasi Mahasiswa, Universitas Adzkia.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a href="mailto:km@universitasadzkia.ac.id" className="text-brand hover:underline">
              km@universitasadzkia.ac.id
            </a>
          </p>
          <p>
            <span className="font-semibold">Alamat:</span> Kampus Universitas Adzkia
          </p>
          <p className="text-muted-foreground">
            Ada masukan untuk kemahasiswaan? Sampaikan lewat form aspirasi — ditindaklanjuti oleh pihak yang berwenang.
          </p>
          <Button asChild size="sm" className="self-start bg-brand-accent text-white hover:bg-yellow-700">
            <Link href="/aspirasi">Sampaikan Aspirasi</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}