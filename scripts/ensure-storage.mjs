import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const BUCKET = "simormawa-files";

/** Create private bucket + RLS policy (dijalankan sekali via script/CLI). */
export async function ensureBucket() {
  const { error } = await supabase.storage.getBucket(BUCKET);
  if (error) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (createError) throw createError;
  }
  console.log("Bucket private siap:", BUCKET);
}