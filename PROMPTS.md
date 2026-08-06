# PROMPTS.md — Prompt Siap Pakai per Sprint (OpenCode)

Cara pakai: copy-paste satu blok prompt ke OpenCode di awal sesi sprint terkait. Jangan gabung 2 prompt sprint berbeda dalam satu sesi (lihat `AGENTS.md` §4). Setiap prompt sudah include instruksi baca dokumen wajib — agent tidak boleh mulai coding sebelum tahap READ selesai.

---

## Prompt 0 — Bootstrapping & Fondasi

```
Kamu akan membangun project "SIM ORMAWA" (Next.js edition) dari nol.

WAJIB dibaca dulu, urutan ini, sebelum menulis kode apa pun:
1. AGENTS.md — ini kontrak kerja kamu. Habit R-T-B-R-F-S wajib diikuti di SETIAP unit kerja, tanpa kecuali.
2. PRD.md — pahami domain, role, flow, dan state machine proposal/LPJ di §4.
3. SCHEMA.md — skema Drizzle lengkap, jadikan acuan (dengan 1 perubahan wajib, lihat task di bawah).
4. SPRINTS.md — kerjakan HANYA task di bawah "Sprint 0", jangan lompat ke sprint lain.

Sebelum mulai: baca "Catatan Keputusan Default" di bagian atas SPRINTS.md — ada 3 keputusan default yang harus kamu terapkan konsisten mulai sprint ini, terutama soal rename kolom *Url -> *Path.

Kerjakan checklist Sprint 0 di SPRINTS.md satu per satu. Setelah setiap task selesai, jalankan tahap REVIEW (baca ulang kode seolah reviewer eksternal) sebelum lanjut ke task berikutnya — jangan tunggu sampai akhir sprint baru direview.

Output yang WAJIB ada di akhir sesi ini:
- Project Next.js 15 + TypeScript strict yang bisa `next build` tanpa error
- Migration Drizzle pertama sudah sukses jalan ke Supabase
- File ARCHITECTURE.md baru (belum ada sebelumnya) berisi permission matrix lengkap can() per role x resource x action, dan diagram middleware -> permission -> query scope
- .env.local.example lengkap

Setelah selesai, update SPRINTS.md: centang semua task Sprint 0, dan laporkan ringkas apa saja yang kamu putuskan sendiri (kalau ada ambiguitas kecil yang kamu selesaikan dengan asumsi).
```

---

## Prompt 1 — Auth & RBAC Core

```
Lanjutkan project SIM ORMAWA. Sprint 0 sudah selesai (cek SPRINTS.md untuk konfirmasi).

Baca dulu sebelum mulai:
1. AGENTS.md §2 — terutama Prinsip #1 (authorization tidak pernah hanya di UI) dan #6 (jangan hardcode role check)
2. ARCHITECTURE.md yang kamu buat di Sprint 0 — ini acuan permission matrix
3. PRD.md §3 — tabel role & scope, baca baik-baik perbedaan bem_koordinator vs admin_ormawa
4. SPRINTS.md bagian "Sprint 1" — kerjakan checklist di sana

Perhatian khusus: bem_koordinator punya scope campuran (read lintas-ORMAWA, write hanya ke ORMAWA BEM miliknya sendiri). Ini beda dari role reviewer (kemahasiswaan/lkpka/mpm) yang read-only lintas-ORMAWA, dan beda dari admin_ormawa yang read+write hanya scoped ke ormawaId sendiri. Implementasikan can() dengan 3 pola berbeda ini secara eksplisit, jangan disamakan.

Setelah lib/auth/permissions.ts dan middleware.ts jadi, WAJIB test manual dengan 6 akun demo (seed di Sprint 0) — coba akses endpoint yang bukan haknya lewat manipulasi URL langsung, bukan cuma lewat UI. Laporkan hasil test ini di akhir sesi.

Ikuti R-T-B-R-F-S penuh. Update SPRINTS.md setelah selesai.
```

---

## Prompt 2 — Identitas & Struktur ORMAWA

```
Lanjutkan project SIM ORMAWA. Sprint 1 (Auth & RBAC) sudah selesai dan lolos test scope.

Baca dulu:
1. SCHEMA.md §2 (domain identitas) dan §5 (pola scope filtering) — pola ini WAJIB diikuti persis, jangan reinvent
2. AGENTS.md §1.3 poin BUILD — urutan wajib: Drizzle schema -> Zod -> query function -> server action -> TanStack Query hook -> komponen UI
3. PRD.md §6.2 dan §6.4 — fitur yang harus ada untuk admin_ormawa dan super_admin
4. SPRINTS.md bagian "Sprint 2"

Kerjakan CRUD ormawa, divisi, pengurus, program_unggulan sesuai checklist. Semua query WAJIB lewat lib/db/queries/, tidak ada db.select() langsung di komponen atau route handler (AGENTS.md §2 Prinsip #2).

Test manual scope sebelum menganggap sprint selesai: login sebagai admin_ormawa ORMAWA A, coba akses/edit data pengurus milik ORMAWA B lewat API call langsung (contoh: curl atau devtools network tab), pastikan ditolak di level server bukan cuma UI yang menyembunyikan tombol.

Update SPRINTS.md setelah semua task tercentang dan lolos Definition of Done di AGENTS.md §6.
```

---

## Prompt 3 — Program Kerja & Proposal

```
Lanjutkan project SIM ORMAWA. Sprint 2 selesai.

Baca dulu:
1. PRD.md §4.2 (state machine) dan §4.3 (sequence diagram pengajuan proposal) — pahami persis kapan status boleh berubah dan ke mana
2. SCHEMA.md §3 (workflow) dan §6 (pola transaksi review_logs) — transisi status dan insert log WAJIB dalam satu db.transaction()
3. PRD.md §7 poin 5 — validasi file: whitelist mime-type (pdf/jpg/png), max 5MB
4. SPRINTS.md bagian "Sprint 3"

Ingat Catatan Keputusan Default di SPRINTS.md: RAB tetap file-only untuk MVP (fileRabPath, bukan tabel item terstruktur).

Poin kritis: implementasikan validasi state machine di SERVER ACTION, bukan cuma disable tombol di UI. Kalau ada percobaan submit proposal dengan status awal yang tidak valid (misal langsung ke "disetujui" tanpa lewat reviewer), server action harus menolak dengan error jelas, bukan diam-diam berhasil.

Setelah build, tulis 1 test manual: coba manipulasi request untuk skip state machine (misal PATCH langsung status ke "disetujui" tanpa lewat endpoint review), pastikan gagal.

Update SPRINTS.md setelah selesai.
```

---

## Prompt 4 — Dashboard Reviewer & Review Proposal

```
Lanjutkan project SIM ORMAWA. Sprint 3 selesai — proposal sudah bisa diajukan admin_ormawa.

Baca dulu:
1. PRD.md §4.2, §4.3, §6.3
2. SCHEMA.md §6 — pola transaksi reviewProposal() sudah dicontohkan, ikuti persis strukturnya (bukan cuma logikanya)
3. SPRINTS.md bagian "Sprint 4"

Perhatian: antrian proposal untuk reviewer TIDAK di-scope by ormawaId (lihat SCHEMA.md §5, reviewer lihat semua). Ini beda dengan sprint sebelumnya, jangan salah copy pola scope filtering admin_ormawa ke sini.

Race condition guard wajib: saat reviewer submit keputusan, cek ulang status proposal SAAT ITU JUGA di dalam transaksi (bukan status yang di-fetch sebelumnya di client), supaya kalau proposal sudah direview reviewer lain duluan, request kedua ditolak dengan pesan jelas bukan overwrite diam-diam.

Catatan wajib diisi untuk keputusan revisi/tolak — validasi Zod, jangan hanya required di HTML form.

Update SPRINTS.md setelah selesai dan lolos Definition of Done.
```

---

## Prompt 5 — LPJ

```
Lanjutkan project SIM ORMAWA. Sprint 4 selesai — workflow review proposal sudah jalan penuh.

Baca dulu:
1. PRD.md §4.2 (note khusus: LPJ pakai state machine yang sama seperti proposal)
2. SCHEMA.md §3 (tabel lpj)
3. SPRINTS.md bagian "Sprint 5"

Ini sprint reuse pola — jangan tulis ulang logic dari nol kalau sudah ada di Sprint 3 & 4 (submit + review), extend saja untuk reviewableType "lpj". Kalau ada duplikasi kode signifikan antara handler proposal dan LPJ, pertimbangkan ekstrak fungsi shared (tapi tetap jaga type-safety per domain, jangan generic berlebihan yang bikin Zod schema ambigu).

Gate penting yang harus divalidasi di server action: LPJ HANYA bisa diajukan kalau proposal terkait berstatus "disetujui". Test manual: coba ajukan LPJ untuk proposal berstatus draft/diajukan/ditolak, harus ditolak.

Update SPRINTS.md setelah selesai.
```

---

## Prompt 6 — Konten Publik (CMS Internal)

```
Lanjutkan project SIM ORMAWA. Sprint 5 selesai — seluruh alur proposal-LPJ sudah jalan.

Baca dulu:
1. PRD.md §6.4 dan §7 poin 4 (rate limiting form publik)
2. SCHEMA.md §4 (domain konten)
3. SPRINTS.md bagian "Sprint 6"

Sprint ini bisa dikerjakan cukup independen dari Sprint 3-5 (domain beda). Kerjakan CRUD berita/kalender/galeri/arsip untuk super_admin, plus inbox aspirasi.

Untuk form aspirasi publik: pakai Upstash Redis untuk rate limiting (keputusan final, bukan lagi Vercel Edge Config — lihat SPRINTS.md task terkait). Tambahkan honeypot field sederhana sebagai lapisan anti-bot tambahan di luar rate limit.

Update SPRINTS.md setelah selesai.
```

---

## Prompt 7 — Website Publik

```
Lanjutkan project SIM ORMAWA. Sprint 6 selesai (konten publik sudah bisa dikelola admin).

Baca dulu:
1. PRD.md §6.1 dan §8 (non-functional requirements — TTFB, SEO, responsive)
2. SPRINTS.md bagian "Sprint 7"

Fokus sprint ini: halaman publik yang read-only dari data yang sudah ada. Gunakan SSG/ISR (bukan full SSR) untuk halaman yang datanya jarang berubah (direktori ORMAWA, detail ORMAWA, arsip) supaya TTFB < 500ms tercapai sesuai PRD.md §8.

Setiap halaman butuh generateMetadata dinamis. Jangan lupa sitemap.xml di akhir.

Update SPRINTS.md setelah selesai, sertakan catatan singkat hasil cek Lighthouse/SEO kalau sempat dijalankan.
```

---

## Prompt 8 — Export PDF & Excel

```
Lanjutkan project SIM ORMAWA. Sprint 7 selesai.

Baca dulu:
1. PRD.md §2 dan §6.4
2. SPRINTS.md bagian "Sprint 8"

Ingat: sesuai Catatan Keputusan Default di SPRINTS.md, export ini metadata-level (list proposal/LPJ + status + tanggal), BUKAN breakdown item RAB per angka — karena RAB masih file-only di MVP ini. Jangan coba parse isi file RAB untuk direkap otomatis, itu di luar scope sprint ini.

Karena perlu return file binary, pakai API route (bukan server action). can() check tetap wajib dipanggil di awal handler, persis seperti server action lain — jangan anggap API route boleh skip authorization karena beda mekanisme.

Update SPRINTS.md setelah selesai.
```

---

## Prompt 9 — Polish, Security Hardening, Deploy

```
Lanjutkan project SIM ORMAWA. Ini sprint terakhir sebelum production. Sprint 0-8 semua sudah selesai.

Baca dulu:
1. PRD.md §7 (keamanan) dan §8 (non-functional) — audit ulang semua poin di sini satu per satu
2. AGENTS.md §6 (Definition of Done) — pastikan SEMUA fitur dari sprint sebelumnya masih memenuhi ini, bukan cuma fitur baru
3. SPRINTS.md bagian "Sprint 9"

Jalankan audit keamanan eksplisit:
- Grep seluruh codebase untuk memastikan tidak ada public URL storage yang bocor ke client bundle (semua akses file harus lewat signed URL yang digenerate on-demand setelah can() check)
- Pastikan tidak ada db.select() langsung di luar lib/db/queries/ (grep untuk verifikasi, bukan cuma ingat-ingat)
- Cek tidak ada console.log tersisa

Jalankan smoke test end-to-end 1 siklus penuh (login admin_ormawa -> buat proposal -> login reviewer -> setujui -> login admin_ormawa -> ajukan LPJ -> login reviewer -> setujui LPJ) dan laporkan hasilnya.

Setup Vercel deployment dengan environment variables production. Catat di SPRINTS.md kalau ada known limitation yang sengaja belum dikerjakan (misal forgot-password flow), jangan diam-diam di-skip tanpa dokumentasi.

Update SPRINTS.md — ini sprint terakhir, tandai project siap production setelah semua tercentang.
```

---

## Prompt Ad-Hoc — Dipakai Kapan Saja

### Untuk debugging/fix bug spesifik di luar alur sprint
```
Ada bug di [deskripsikan gejala]. Sebelum fix, baca ulang AGENTS.md §1 (habit R-T-B-R-F-S) — jangan langsung tempel patch.

READ: baca kode yang relevan dulu, cek apakah bug ini melanggar salah satu Prinsip Non-Negotiable di AGENTS.md §2 (kemungkinan besar authorization atau scope filtering kalau bug-nya soal data bocor antar ORMAWA).

THINKING: jelaskan dulu root cause sebelum nulis fix.

BUILD: fix minimal, jangan sekalian refactor besar kalau tidak diminta.

REVIEW-FIX-SEMPURNAKAN: seperti biasa.

Laporkan root cause dan fix secara ringkas di akhir.
```

### Untuk menambah fitur baru di luar SPRINTS.md yang sudah ada
```
Ada kebutuhan fitur baru: [deskripsikan]. Ini di luar SPRINTS.md yang sudah ada.

Sebelum implementasi: cek apakah fitur ini menyentuh domain yang sudah ada scope filtering-nya (proposal/lpj/divisi/pengurus/program_kerja). Kalau ya, WAJIB reuse pola dari lib/db/queries/ yang sudah ada, jangan bikin pola scope baru.

Setelah selesai, tambahkan entri baru di SPRINTS.md di sprint yang paling relevan (atau bikin "Sprint 10+" kalau memang fitur besar terpisah), supaya dokumentasi tetap sinkron dengan kode.
```
