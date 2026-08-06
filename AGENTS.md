# AGENTS.md — Panduan Kerja AI Agent untuk SIM ORMAWA (Next.js)

Dokumen ini adalah kontrak kerja untuk AI agent (OpenCode) yang membangun project ini. Wajib dibaca sebelum eksekusi task apa pun.

---

## 0. Konfigurasi Project & Kredensial (DARI PEMILIK — jangan tanya ulang)

Semua kredensial sudah tersimpan di **`.env.local`** (gitignored, jangan pernah di-commit/push). Referensi kolom: `SCHEMA.md` §7. Kalau butuh nilai secret, baca dari `.env.local` — jangan minta ke user lagi.

| Item | Nilai / Lokasi |
|---|---|
| Supabase project ref | `xdyohbilfnlhtcrflgcm` (region aws-0-ap-northeast-2, Seoul) |
| Supabase URL + anon/publishable | `.env.local` → `NEXT_PUBLIC_SUPABASE_*` |
| Database (Shared Pooler) | `.env.local` → `DATABASE_URL` (password `Cq4GShc4aGJmgpbp`) |
| Service role key | `.env.local` → `SUPABASE_SERVICE_ROLE_KEY` (server-side only) |
| Supabase CLI access token | `.env.local` → `SUPABASE_ACCESS_TOKEN` (`sbp_...`) |
| Git remote (PUSH LAGI NANTI — jangan push sebelum diminta) | `origin` → `https://github.com/awaaaaja/Sistem-Integrasi-Manajemen-Organisasi-Mahasiswa` |
| Deploy | Pakai **Vercel CLI** (`vercel`) + **Supabase CLI** (`supabase link`). Set env vars production saat deploy. |

Catatan: project Supabase di-link via CLI dengan access token di atas; Drizzle migration dijalankan dengan `DATABASE_URL` (Shared Pooler).

---

## 1. Habit Wajib di Setiap Fase: R-T-B-R-F-S

Setiap unit kerja (fitur, endpoint, komponen) **wajib** melalui 6 tahap ini, berurutan, tanpa lompat:

### 1️⃣ READ (Baca)
- Baca `PRD.md`, `SCHEMA.md`, dan bagian relevan di `SPRINTS.md` sebelum menulis kode apa pun.
- Baca kode yang sudah ada di sekitar area yang akan diubah (jangan asumsi struktur — cek langsung).
- Baca constraint yang berlaku: role mana yang boleh akses, apakah butuh scope `ormawa_id`, apakah ada Zod schema yang harus dipakai ulang.
- **Output tahap ini**: pemahaman jelas tentang apa yang dibangun dan batasannya — bukan kode.

### 2️⃣ THINKING (Berpikir)
- Rancang pendekatan sebelum menulis kode: struktur file, nama fungsi, tipe data, edge case.
- Pertimbangkan minimal 2 hal: "apa yang bisa salah?" dan "siapa yang boleh akses ini?"
- Jika fitur menyentuh workflow proposal/LPJ, cek ulang state machine di `PRD.md` §4.2 — jangan buat transisi status yang tidak terdefinisi.
- Jika ambigu, pilih pendekatan paling konsisten dengan kode yang sudah ada.

### 3️⃣ BUILD (Bangun)
- Implementasi sesuai rencana tahap Thinking.
- **Urutan wajib** untuk setiap fitur yang menyentuh data:
  1. Drizzle schema (jika ada tabel baru) → migration
  2. Zod schema (validasi) — satu sumber kebenaran, dipakai di form & server
  3. Query function di `lib/db/queries/` (dengan scope filtering built-in — lihat §3)
  4. Server action / API route (dengan `can()` check dari `ARCHITECTURE.md`)
  5. TanStack Query hook (`hooks/queries/` atau `hooks/mutations/`)
  6. Komponen UI (Shadcn)

### 4️⃣ REVIEW (Review)
- Baca ulang kode yang baru ditulis seolah reviewer eksternal: cek scope, validasi, error handling, konsistensi pola dengan file lain.

### 5️⃣ FIX
- Perbaiki temuan review.

### 6️⃣ SEMPURNAKAN
- `tsc --noEmit` bersih.
- `npm run lint` zero error.
- Hapus `console.log` debug.

---

## 2. Prinsip Non-Negotiable

1. **Authorization tidak pernah hanya di UI.** Tombol yang disembunyikan bukan security. Halau di server action/API (via `can()`).
2. **Semua query lewat `lib/db/queries/`.** Tidak ada `db.select()` langsung di komponen, server action, atau route handler.
3. **Query-level scope filtering** untuk data ter-scope (proposal, lpj, divisi, pengurus, program_kerja) — lihat §3.
4. **Setiap transisi status (proposal/LPJ) harus insert `review_logs` dalam transaksi yang sama** — tidak boleh update status tanpa log.
5. **File akses lewat signed URL** — tidak ada path/URL mentah yang bocor ke client bundle.
6. **`can()` helper via `lib/auth/permissions.ts`, jangan hardcode role check** di dalam komponen.

---

## 3. Pola Scope Filtering (Wajib, lihat SCHEMA.md §5)

1. Semua query di `lib/db/queries/` menerima `session` sebagai argumen pertama.
2. `admin_ormawa`: filter `ormawaId` di level query. Reviewer & `super_admin`: tanpa filter ormawaId.
3. Query yang return data ter-scoped: bila user tidak boleh melihatnya, return `null` (treat as not found) — JANGAN bocorkan keberadaan data.
4. Referensi implementasi lengkap: `SCHEMA.md` §5 (kode contoh `getProposals` / `getProposalById`).

---

## 3. Aturan Per-Sesi (Hanya Satu Domain)

Satu sesi agent hanya mengerjakan satu sprint (checklist di `SPRINTS.md`) atau satu domain fitur. Dilarang mencampur domain berbeda dalam satu sesi. Promo per sprint ada di `PROMPTS.md` dengan nomor yang sama.

---

## 5. Konvensi Kode

- Next.js 15 App Router + Server Components (default), `src/` directory, import alias `@/*` → `./src/*`.
- TypeScript strict. Semua fungsi + params bertipe.
- Validasi: Zod di layer paling luar (form server).
- Drizzle untuk semua akses DB (bukan Supabase JS client untuk query).
- State server: TanStack Query. State UI: Zustand (hanya sidebar/modal/filter draft).
- UI: Shadcn UI + Tailwind. Semua interaksi berdasar Radix (accessible by default).
- File & folder: `kebab-case` untuk folder, `PascalCase.tsx` untuk komponen, `camelCase.ts` untuk util/hooks.
- Bahasa permintaan/komentar: Bahasa Indonesia.

---

## 6. Definition of Done (per task / sprint)

1. Backend constraint tervalidasi di server, bukan hanya UI.
2. Scope & authorization sesuai `ARCHITECTURE.md` matrix.
3. Review `permissions` lulus setiap server action.
4. `tsc --noEmit` + `npm run lint` zero error.
5. `next build` sukses.
6. Test manual authz minimal (aksenirasınyan lintas-scope ditolak).
7. Tidak ada `console.log` tersisa.

---

## 7. Kolom Env Wajib (detail di `SCHEMA.md` §7)

`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_STORAGE_BUCKET`.