import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import {
  Card,

  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MENU = [
  { title: "Berita", desc: "Kelola berita dan pengumuman", href: "/dashboard/super-admin/konten/berita" },
  { title: "Kalender", desc: "Agenda kegiatan", href: "/dashboard/super-admin/konten/kalender" },
  { title: "Galeri", desc: "Foto kegiatan", href: "/dashboard/super-admin/konten/galeri" },
  { title: "Arsip", desc: "Dokumen publik", href: "/dashboard/super-admin/konten/arsip" },
  { title: "Aspirasi", desc: "Inbox aspirasi mahasiswa", href: "/dashboard/super-admin/konten/aspirasi" },
];

export default async function SuperAdminKontenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "super_admin") redirect("/dashboard/super-admin");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Konten Publik</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {MENU.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="h-full transition-colors hover:bg-muted">
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription>{m.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}