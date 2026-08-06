import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>SIM ORMAWA — Universitas Adzkia</CardTitle>
          <CardDescription>
            Sistem Integrasi Manajemen Organisasi Mahasiswa. Sprint 0: fondasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}