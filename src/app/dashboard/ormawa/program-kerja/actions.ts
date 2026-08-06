"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { programKerja } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { programKerjaSchema } from "@/lib/validations/workflow";

export async function createProgramKerja(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "program_kerja", ormawaId)) return { error: "Forbidden" };

  const parsed = programKerjaSchema.safeParse({
    ormawaId,
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    targetWaktu: formData.get("targetWaktu") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(programKerja).values(parsed.data);
  revalidatePath("/dashboard/ormawa/program-kerja");
  return { success: true };
}

export async function updateProgramKerja(ormawaId: string, id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "program_kerja", ormawaId)) return { error: "Forbidden" };

  const parsed = programKerjaSchema.partial().safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    targetWaktu: formData.get("targetWaktu") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(programKerja).set(parsed.data).where(eq(programKerja.id, id));
  revalidatePath("/dashboard/ormawa/program-kerja");
  return { success: true };
}

export async function deleteProgramKerja(ormawaId: string, id: string) {
  const session = await auth();
  if (!can(session, "delete", "program_kerja", ormawaId)) return { error: "Forbidden" };

  await db.delete(programKerja).where(eq(programKerja.id, id));
  revalidatePath("/dashboard/ormawa/program-kerja");
  return { success: true };
}