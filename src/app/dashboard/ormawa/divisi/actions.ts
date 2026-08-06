"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { divisi } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { divisiSchema } from "@/lib/validations/identitas";

export async function createDivisi(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "divisi", ormawaId)) return { error: "Forbidden" };

  const parsed = divisiSchema.safeParse({
    ormawaId,
    nama: formData.get("nama"),
    deskripsi: formData.get("deskripsi") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(divisi).values(parsed.data);
  revalidatePath(`/dashboard/ormawa/divisi`);
  return { success: true };
}

export async function updateDivisi(ormawaId: string, id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "divisi", ormawaId)) return { error: "Forbidden" };

  const parsed = divisiSchema.partial().safeParse({
    nama: formData.get("nama"),
    deskripsi: formData.get("deskripsi") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(divisi).set(parsed.data).where(eq(divisi.id, id));
  revalidatePath("/dashboard/ormawa/divisi");
  return { success: true };
}

export async function deleteDivisi(ormawaId: string, id: string) {
  const session = await auth();
  if (!can(session, "delete", "divisi", ormawaId)) return { error: "Forbidden" };

  await db.delete(divisi).where(eq(divisi.id, id));
  revalidatePath(`/dashboard/ormawa/divisi`);
  return { success: true };
}