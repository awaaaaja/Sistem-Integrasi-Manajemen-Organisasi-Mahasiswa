import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } },
);

const PRIVATE_BUCKET = "simormawa-files";
const PUBLIC_BUCKET = "simormawa-publik";

/** Create private + public buckets (dijalankan sekali via script/CLI). */
export async function ensureBucket() {
  const { error } = await supabase.storage.getBucket(PRIVATE_BUCKET);
  if (error) {
    const { error: createError } = await supabase.storage.createBucket(PRIVATE_BUCKET, { public: false });
    if (createError) throw createError;
  }
  console.log("Bucket private siap:", PRIVATE_BUCKET);

  const { error: pubError } = await supabase.storage.getBucket(PUBLIC_BUCKET);
  if (pubError) {
    const { error: createError } = await supabase.storage.createBucket(PUBLIC_BUCKET, { public: true });
    if (createError) throw createError;
  }
  console.log("Bucket publik siap:", PUBLIC_BUCKET);
}

ensureBucket().catch((e) => {
  console.error(e.message);
  process.exit(1);
});