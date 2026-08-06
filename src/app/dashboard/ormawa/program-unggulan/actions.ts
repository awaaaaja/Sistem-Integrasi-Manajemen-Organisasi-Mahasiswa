"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { programUnggulan } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { programUnggulanSchema } from "@/lib/validations/identitas";

export async function createProgramUnggulan(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "program_unggulan", ormawaId)) return { error: "Forbidden" };

  const parsed = programUnggulanSchema.safeParse({
    ormawaId,
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    tahun: formData.get("tahun"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(programUnggulan).values(parsed.data);
  revalidatePath("/dashboard/ormawa/program-unggulan");
  return { success: true };
}

export async function updateProgramUnggulan(ormawaId: string, id: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "program_unggulan", ormawaId)) return { error: "Forbidden" };

  const parsed = programUnggulanSchema.partial().safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi") || undefined,
    tahun: formData.get("tahun"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(programUnggulan).set(parsed.data).where(eq(programUnggulan.id, id));
  revalidatePath("/dashboard/ormawa/program-unggulan");
  return { success: true };
}

export async function deleteProgramUnggulan(ormawaId: string, id: string) {
  const session = await auth();
  if (!can(session, "delete", "program_unggulan", ormawaId)) return { error: "Forbidden" };

  await db.delete(programUnggulan).where(eq(programUnggulan.id, id));
  revalidatePath("/dashboard/ormawa/program-unggulan");
  return { success: true };
}