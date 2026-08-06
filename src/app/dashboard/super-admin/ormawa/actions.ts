"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { ormawaSchema } from "@/lib/validations/identitas";

export async function createOrmawa(formData: FormData) {
  const session = await auth();
  if (!can(session, "create", "ormawa", undefined)) {
    throw new Error("Forbidden");
  }

  const parsed = ormawaSchema.safeParse({
    nama: formData.get("nama"),
    slug: formData.get("slug"),
    jenis: formData.get("jenis"),
    deskripsi: formData.get("deskripsi") || undefined,
    visi: formData.get("visi") || undefined,
    misi: formData.get("misi") || undefined,
    status: "aktif",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await db.insert(ormawa).values(parsed.data);
  revalidatePath("/dashboard/super-admin/ormawa");
  return { success: true };
}

export async function updateOrmawaStatus(id: string, status: "aktif" | "nonaktif") {
  const session = await auth();
  if (!can(session, "update", "ormawa", undefined)) return { error: "Forbidden" };

  await db.update(ormawa).set({ status }).where(eq(ormawa.id, id));
  revalidatePath("/dashboard/super-admin/ormawa");
  return { success: true };
}

export async function deleteOrmawa(id: string) {
  const session = await auth();
  if (!can(session, "delete", "ormawa", undefined)) return { error: "Forbidden" };

  await db.delete(ormawa).where(eq(ormawa.id, id));
  revalidatePath("/dashboard/super-admin/ormawa");
  redirect("/dashboard/super-admin/ormawa");
}

export async function editProfilOrmawa(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "ormawa", ormawaId)) return { error: "Forbidden" };

  const parsed = ormawaSchema
    .partial()
    .safeParse({
      nama: formData.get("nama"),
      deskripsi: formData.get("deskripsi") || undefined,
      visi: formData.get("visi") || undefined,
      misi: formData.get("misi") || undefined,
      status: formData.get("status") || "aktif",
    });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.update(ormawa).set(parsed.data).where(eq(ormawa.id, ormawaId));
  revalidatePath("/dashboard/super-admin/ormawa");
  return { success: true };
}