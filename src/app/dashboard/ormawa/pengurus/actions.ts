"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pengurus } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { pengurusSchema } from "@/lib/validations/identitas";

export async function createPengurus(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "pengurus", ormawaId)) return { error: "Forbidden" };

  const parsed = pengurusSchema.safeParse({
    ormawaId,
    divisiId: formData.get("divisiId") || undefined,
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    periodeMulai: formData.get("periodeMulai") || undefined,
    periodeSelesai: formData.get("periodeSelesai") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(pengurus).values(parsed.data);
  revalidatePath(`/dashboard/ormawa/pengurus`);
  return { success: true };
}

export async function updatePengurus(ormawaId: string, id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "pengurus", ormawaId)) return { error: "Forbidden" };

  const parsed = pengurusSchema.partial().safeParse({
    divisiId: formData.get("divisiId") || undefined,
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    periodeMulai: formData.get("periodeMulai") || undefined,
    periodeSelesai: formData.get("periodeSelesai") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(pengurus).set(parsed.data).where(eq(pengurus.id, id));
  revalidatePath("/dashboard/ormawa/pengurus");
  return { success: true };
}

export async function deletePengurus(ormawaId: string, id: string) {
  const session = await auth();
  if (!can(session, "delete", "pengurus", ormawaId)) return { error: "Forbidden" };

  await db.delete(pengurus).where(eq(pengurus.id, id));
  revalidatePath("/dashboard/ormawa/pengurus");
  return { success: true };
}