"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ormawa } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import { ormawaProfilSchema } from "@/lib/validations/identitas";
import { fileSchema } from "@/lib/validations/identitas";
import { uploadFile } from "@/lib/storage";

function fileOrUndefined(value: FormDataEntryValue | null): File | undefined {
  if (value instanceof File && value.size > 0) return value;
  return undefined;
}

export async function updateProfilOrmawa(ormawaId: string, formData: FormData) {
  const session = await auth();
  if (!can(session, "update", "ormawa", ormawaId)) return { error: "Forbidden" };

  const logo = fileOrUndefined(formData.get("logo"));
  const banner = fileOrUndefined(formData.get("banner"));

  if (logo && !fileSchema.safeParse(logo).success) return { error: "Logo harus jpg/png/webp & ≤5MB" };
  if (banner && !fileSchema.safeParse(banner).success) return { error: "Banner harus jpg/png/webp & ≤5MB" };

  const parsed = ormawaProfilSchema.partial().safeParse({
    nama: formData.get("nama") || undefined,
    visi: formData.get("visi") || undefined,
    misi: formData.get("misi") || undefined,
    deskripsi: formData.get("deskripsi") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  let logoPath: string | undefined;
  let bannerPath: string | undefined;
  if (logo) logoPath = await uploadFile(`ormawa/${ormawaId}`, logo, { public: true });
  if (banner) bannerPath = await uploadFile(`ormawa/${ormawaId}`, banner, { public: true });

  await db
    .update(ormawa)
    .set({ ...parsed.data, ...(logoPath ? { logoPath } : {}), ...(bannerPath ? { bannerPath } : {}) })
    .where(eq(ormawa.id, ormawaId));

  revalidatePath("/dashboard/ormawa");
  return { success: true };
}