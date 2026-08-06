import { createClient } from "@supabase/supabase-js";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "simormawa-files";

/** Upload via service role. Return storage path. Path unik per upload: {folder}/{uuid}-{nama}. */
export async function uploadFile(
  folder: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await serviceClient.storage
    .from(storageBucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  return path;
}

/** Signed URL untuk akses file privat (≤5 menit, dipakai UI). */
export async function getSignedUrl(path: string, expiresIn = 300) {
  const { data, error } = await serviceClient.storage
    .from(storageBucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw new Error(`Signed URL gagal: ${error.message}`);
  return data.signedUrl;
}