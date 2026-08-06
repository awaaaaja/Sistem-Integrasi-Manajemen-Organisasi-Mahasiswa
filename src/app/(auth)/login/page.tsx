import { redirect } from "next/navigation";
import { GraduationCap, MessagesSquare, Users } from "lucide-react";
import { auth } from "@/auth";
import { dashboardForRole } from "@/lib/auth/permissions";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect(dashboardForRole(session.user.role));

  return (
    <main className="flex flex-1">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-dark p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <GraduationCap className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-bold">SIM ORMAWA</span>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="font-heading text-4xl font-bold leading-tight">
            Kelola Organisasi Mahasiswa{" "}
            <span className="text-amber-400">dalam satu sistem.</span>
          </h1>
          <p className="max-w-md leading-relaxed text-slate-300">
            Pengajuan proposal, laporan pertanggungjawaban, berita, dan arsip — semuanya terintegrasi
            untuk KM Universitas Adzkia.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-300">
                Manajemen pengurus, divisi, dan program kerja setiap ORMAWA.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MessagesSquare className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-300">
                Alur review proposal dan LPJ dari pengajuan hingga persetujuan.
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400">KM Universitas Adzkia · Sistem Integrasi Manajemen Organisasi Mahasiswa</p>
      </div>
      <div className="flex w-full items-center justify-center bg-background px-4 lg:w-1/2">
        <LoginForm />
      </div>
    </main>
  );
}
