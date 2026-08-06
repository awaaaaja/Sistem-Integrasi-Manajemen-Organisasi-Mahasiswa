"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { GraduationCap, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PUBLIK_NAV } from "@/lib/publik-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) =>
    PUBLIK_NAV.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive(item.href) ? "page" : undefined}
        className={`rounded-md px-3 py-2 text-sm transition-colors ${
          isActive(item.href)
            ? "font-medium text-accent-ink dark:text-accent-ink"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {item.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-bold tracking-tight text-brand dark:text-white">
              SIM ORMAWA
            </span>
            <span className="hidden text-[11px] uppercase tracking-widest text-muted-foreground sm:block">
              Universitas Adzkia
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={resolvedTheme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            className="h-10 w-10"
          >
            <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
            <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
          </Button>
          <Button asChild size="sm" className="hidden bg-accent-strong text-brand-dark hover:bg-accent-strong/90 md:inline-flex">
            <Link href="/login">Masuk</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 md:hidden" aria-label="Buka menu navigasi">
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="fixed inset-y-0 right-0 top-0 left-auto flex h-full w-80 translate-x-0 translate-y-0 flex-col gap-6 overflow-y-auto rounded-none border-l bg-background p-6 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Menu navigasi</DialogTitle>
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-brand dark:text-white">SIM ORMAWA</span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Tutup menu">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
              <Button
                asChild
                className="mt-auto bg-accent-strong text-brand-dark hover:bg-accent-strong/90"
                onClick={() => setOpen(false)}
              >
                <Link href="/login">Masuk</Link>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
