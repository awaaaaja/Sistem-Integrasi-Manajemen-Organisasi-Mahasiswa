import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDivisi } from "@/lib/db/queries/divisi";
import { getPengurus } from "@/lib/db/queries/pengurus";
import { getProgramUnggulan } from "@/lib/db/queries/programUnggulan";

export default async function OrmawaDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = session.user.role;

const ormawaId = session.user.ormawaId ?? "";
  const [ormawaRow, counts] = await Promise.all([
    db.select().from(ormawa).where(eq(ormawa.id, ormawaId)).then((r) => r[0]),
    Promise.all([
      getDivisi(session, ormawaId),
      getPengurus(session, ormawaId),
      getProgramUnggulan(session, ormawaId),
    ]),
  ]);
  const [divisi, pengurus, programUnggulan] = counts;

  if (!ormawaRow) return <p>ORMAWA tidak ditemukan.</p>;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{ormawaRow.nama}</CardTitle>
          <CardDescription>
            {ormawaRow.jenis.toUpperCase()} · {role === "bem_koordinator" ? "koordinator BEM" : "admin_ormawa"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Stat label="Divisi" value={divisi.length} />
          <Stat label="Pengurus" value={pengurus.length} />
          <Stat label="Program Unggulan" value={programUnggulan.length} />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}