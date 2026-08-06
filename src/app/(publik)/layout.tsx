import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Beranda", href: "/" },
  { label: "ORMAWA", href: "/ormawa" },
  { label: "Berita", href: "/berita" },
  { label: "Kalender", href: "/kalender" },
  { label: "Galeri", href: "/galeri" },
  { label: "Arsip", href: "/arsip" },
  { label: "Kontak", href: "/kontak" },
];

export default function PublikLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-[#1E3A5F]">
            SIM ORMAWA <span className="font-normal text-muted-foreground">· Universitas Adzkia</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" variant="outline" className="ml-2">
              <Link href="/login">Masuk</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-[#0F172A] py-8 text-sm text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4">
          <p className="font-semibold text-white">SIM ORMAWA — KM Universitas Adzkia</p>
          <p>Sistem Integrasi Manajemen Organisasi Mahasiswa. Hubungi kami lewat halaman Kontak.</p>
        </div>
      </footer>
    </div>
  );
}