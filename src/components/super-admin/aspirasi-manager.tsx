"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { aspirasi } from "@/lib/db/schema";

type Aspirasi = typeof aspirasi.$inferSelect;
import { formatTanggalWaktu } from "@/lib/format";
import { updateAspirasiStatus } from "@/app/dashboard/super-admin/konten/actions";

export function AspirasiManager({ items }: { items: Aspirasi[] }) {
  const [pending, startTransition] = useTransition();
  const baru = items.filter((a) => a.status === "baru");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{baru.length} aspirasi belum ditindaklanjuti</p>
      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">Belum ada aspirasi masuk</p>
      )}
      {items.map((a) => (
        <Card key={a.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">
                {a.namaPengirim} <span className="text-sm font-normal text-muted-foreground">({a.email})</span>
              </CardTitle>
              <Badge variant={a.status === "baru" ? "default" : "secondary"}>
                {a.status === "baru" ? "Baru" : "Ditindaklanjuti"}
              </Badge>
            </div>
            <CardDescription>{formatTanggalWaktu(a.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="whitespace-pre-wrap text-sm">{a.pesan}</p>
            {a.status === "baru" && (
              <Button
                size="sm"
                className="self-start"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await updateAspirasiStatus(a.id, "ditindaklanjuti");
                    if (res?.error) toast.error(res.error);
                    else toast.success("Ditandai ditindaklanjuti");
                  })
                }
              >
                Tandai Ditindaklanjuti
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}