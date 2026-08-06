"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { aspirasi } from "@/lib/db/schema";
import { aspirasiSchema, HONEYPOT_FIELD } from "@/lib/validations/konten";
import { aspirasiRateLimit } from "@/lib/rate-limit";

export async function submitAspirasi(formData: FormData) {
  // Honeypot: bot yang mengisi field tersembunyi dianggap spam, tolak diam-diam
  if (String(formData.get(HONEYPOT_FIELD) ?? "").length > 0) {
    return { success: true };
  }

  // Rate limit per IP (PRD §7 poin 4)
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for") ?? "unknown";
  const { success } = await aspirasiRateLimit.limit(forwarded.split(",")[0]?.trim() || "unknown");
  if (!success) return { error: "Terlalu banyak pengiriman, coba lagi beberapa saat" };

  const parsed = aspirasiSchema.safeParse({
    namaPengirim: formData.get("namaPengirim"),
    email: formData.get("email"),
    pesan: formData.get("pesan"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  await db.insert(aspirasi).values(parsed.data);
  revalidatePath("/aspirasi");
  return { success: true };
}