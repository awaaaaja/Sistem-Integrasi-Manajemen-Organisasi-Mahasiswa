import Link from "next/link";
import { GraduationCap, Mail, MapPin, MessagesSquare } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/publik/site-header";
import { PUBLIK_NAV } from "@/lib/publik-nav";

export default function PublikLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t bg-brand-dark text-slate-300">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-lg font-bold text-white">SIM ORMAWA</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                Sistem Integrasi Manajemen Organisasi Mahasiswa KM Universitas Adzkia — satu pintu untuk
                informasi kegiatan, berita, dan partisipasi mahasiswa.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-white">Navigasi</p>
              <nav className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm" aria-label="Navigasi footer">
                {PUBLIK_NAV.map((item) => (
                  <Link key={item.href} href={item.href} className="text-slate-400 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-white">Layanan</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/aspirasi" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
                  <MessagesSquare className="h-4 w-4" aria-hidden="true" /> Sampaikan Aspirasi
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
                  Masuk Dashboard
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-white">Kontak</p>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                <a href="mailto:km@universitasadzkia.ac.id" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden="true" /> km@universitasadzkia.ac.id
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Kampus Universitas Adzkia
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row">
              <p>© {new Date().getFullYear()} KM Universitas Adzkia. Seluruh hak cipta dilindungi.</p>
              <p>Sistem Integrasi Manajemen Organisasi Mahasiswa</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
