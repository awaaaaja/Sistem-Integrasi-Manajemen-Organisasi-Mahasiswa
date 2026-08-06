"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex flex-col gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Masuk</h1>
          <p className="text-sm text-muted-foreground">Akses dashboard SIM ORMAWA — KM Universitas Adzkia.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nama@example.com" autoComplete="email" required className="h-11" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
          </div>
          {state?.error && (
            <p role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="h-11 w-full bg-accent-strong text-brand-dark hover:bg-amber-500">
            {pending ? "Memproses…" : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
