import Link from "next/link";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";

const NAV: Record<string, { label: string; href: string }[]> = {
  super_admin: [
    { label: "ORMAWA", href: "/dashboard/super-admin/ormawa" },
    { label: "Dashboard", href: "/dashboard/super-admin" },
  ],
  kemahasiswaan: [
    { label: "Antrian Proposal", href: "/dashboard/reviewer" },
    { label: "Riwayat Review", href: "/dashboard/reviewer/riwayat" },
  ],
  lkpka: [
    { label: "Antrian Proposal", href: "/dashboard/reviewer" },
    { label: "Riwayat Review", href: "/dashboard/reviewer/riwayat" },
  ],
  mpm: [
    { label: "Antrian Proposal", href: "/dashboard/reviewer" },
    { label: "Riwayat Review", href: "/dashboard/reviewer/riwayat" },
  ],
  bem_koordinator: [
    { label: "Dashboard", href: "/dashboard/koordinator" },
    { label: "Profil BEM", href: "/dashboard/ormawa/profil" },
    { label: "Divisi", href: "/dashboard/ormawa/divisi" },
    { label: "Pengurus", href: "/dashboard/ormawa/pengurus" },
    { label: "Program Unggulan", href: "/dashboard/ormawa/program-unggulan" },
    { label: "Program Kerja", href: "/dashboard/ormawa/program-kerja" },
    { label: "Proposal", href: "/dashboard/ormawa/proposal" },
  ],
  admin_ormawa: [
    { label: "Dashboard", href: "/dashboard/ormawa" },
    { label: "Profil", href: "/dashboard/ormawa/profil" },
    { label: "Divisi", href: "/dashboard/ormawa/divisi" },
    { label: "Pengurus", href: "/dashboard/ormawa/pengurus" },
    { label: "Program Unggulan", href: "/dashboard/ormawa/program-unggulan" },
    { label: "Program Kerja", href: "/dashboard/ormawa/program-kerja" },
    { label: "Proposal", href: "/dashboard/ormawa/proposal" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  const nav = NAV[role] ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-semibold">SIM ORMAWA</span>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{role}</Badge>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
              {session?.user?.email}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 p-6">
        {nav.length > 0 && (
          <nav className="flex w-52 shrink-0 flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}