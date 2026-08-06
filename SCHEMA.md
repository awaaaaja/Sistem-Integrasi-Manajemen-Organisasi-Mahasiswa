# SCHEMA.md — Skema Database (Drizzle ORM)

Referensi lengkap untuk semua tabel. File aktual harus dipecah per-domain di `lib/db/schema/`:
`identitas.ts`, `workflow.ts`, `konten.ts`, `index.ts` (re-export semua + relations).

---

## 1. Enum

```ts
// lib/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "super_admin",
  "kemahasiswaan",
  "lkpka",
  "mpm",
  "bem_koordinator",
  "admin_ormawa",
]);

export const ormawaJenisEnum = pgEnum("ormawa_jenis", ["bem", "mpm", "hima", "ukm"]);

export const ormawaStatusEnum = pgEnum("ormawa_status", ["aktif", "nonaktif"]);

export const proposalStatusEnum = pgEnum("proposal_status", [
  "draft",
  "diajukan",
  "revisi",
  "disetujui",
  "ditolak",
]);

export const aspirasiStatusEnum = pgEnum("aspirasi_status", ["baru", "ditindaklanjuti"]);
```

---

## 2. Domain: Identitas & Struktur

```ts
// lib/db/schema/identitas.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { roleEnum, ormawaJenisEnum, ormawaStatusEnum } from "./enums";

export const ormawa = pgTable("ormawa", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: text("nama").notNull(),
  slug: text("slug").notNull().unique(),
  jenis: ormawaJenisEnum("jenis").notNull(),
  deskripsi: text("deskripsi"),
  visi: text("visi"),
  misi: text("misi"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  status: ormawaStatusEnum("status").default("aktif").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id), // wajib diisi jika role = admin_ormawa
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const divisi = pgTable("divisi", {
  id: uuid("id").defaultRandom().primaryKey(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
  nama: text("nama").notNull(),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pengurus = pgTable("pengurus", {
  id: uuid("id").defaultRandom().primaryKey(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
  divisiId: uuid("divisi_id").references(() => divisi.id), // nullable
  nama: text("nama").notNull(),
  jabatan: text("jabatan").notNull(),
  fotoUrl: text("foto_url"),
  periodeMulai: timestamp("periode_mulai").notNull(),
  periodeSelesai: timestamp("periode_selesai"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const programUnggulan = pgTable("program_unggulan", {
  id: uuid("id").defaultRandom().primaryKey(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  tahun: text("tahun").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 3. Domain: Workflow Program & Anggaran

```ts
// lib/db/schema/workflow.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { proposalStatusEnum } from "./enums";
import { ormawa, users } from "./identitas";

export const programKerja = pgTable("program_kerja", {
  id: uuid("id").defaultRandom().primaryKey(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  targetWaktu: timestamp("target_waktu"),
  status: text("status").default("berjalan").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proposals = pgTable("proposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  programKerjaId: uuid("program_kerja_id").references(() => programKerja.id).notNull(),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id).notNull(),
  judul: text("judul").notNull(),
  fileProposalUrl: text("file_proposal_url").notNull(),
  fileRabUrl: text("file_rab_url"), // RAB sebagai 1 dokumen upload
  status: proposalStatusEnum("status").default("draft").notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id).notNull(),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lpj = pgTable("lpj", {
  id: uuid("id").defaultRandom().primaryKey(),
  proposalId: uuid("proposal_id").references(() => proposals.id).notNull(),
  judul: text("judul").notNull(),
  fileLpjUrl: text("file_lpj_url").notNull(),
  fileBuktiPengeluaranUrl: text("file_bukti_pengeluaran_url").notNull(), // digabung, 1 dokumen
  status: proposalStatusEnum("status").default("draft").notNull(),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewLogs = pgTable("review_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewableType: text("reviewable_type").notNull(), // "proposal" | "lpj"
  reviewableId: uuid("reviewable_id").notNull(),
  reviewerId: uuid("reviewer_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // "diajukan" | "revisi" | "disetujui" | "ditolak"
  catatan: text("catatan"),
  statusSebelum: proposalStatusEnum("status_sebelum"),
  statusSesudah: proposalStatusEnum("status_sesudah").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 4. Domain: Konten Publik

```ts
// lib/db/schema/konten.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { aspirasiStatusEnum } from "./enums";
import { users, ormawa } from "./identitas";

export const berita = pgTable("berita", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  slug: text("slug").notNull().unique(),
  konten: text("konten").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kalender = pgTable("kalender", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  tanggalMulai: timestamp("tanggal_mulai").notNull(),
  tanggalSelesai: timestamp("tanggal_selesai"),
  kategori: text("kategori"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aspirasi = pgTable("aspirasi", {
  id: uuid("id").defaultRandom().primaryKey(),
  namaPengirim: text("nama_pengirim").notNull(),
  email: text("email").notNull(),
  pesan: text("pesan").notNull(),
  status: aspirasiStatusEnum("status").default("baru").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galeri = pgTable("galeri", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  fotoUrl: text("foto_url").notNull(),
  kategori: text("kategori"),
  ormawaId: uuid("ormawa_id").references(() => ormawa.id), // nullable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const arsip = pgTable("arsip", {
  id: uuid("id").defaultRandom().primaryKey(),
  judul: text("judul").notNull(),
  fileUrl: text("file_url").notNull(),
  kategori: text("kategori"),
  tahun: text("tahun").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 5. Query Pattern Wajib (Scope Filtering)

Semua query yang menyentuh data ter-scope (`proposal`, `lpj`, `program_kerja`, `divisi`, `pengurus`) **wajib** lewat fungsi di `lib/db/queries/`, tidak query langsung di komponen/route. Contoh pola:

```ts
// lib/db/queries/proposal.ts
import { db } from "@/lib/db";
import { proposals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";

export async function getProposals(session: Session) {
  const base = db.select().from(proposals);
  if (session.user.role === "admin_ormawa") {
    return base.where(eq(proposals.ormawaId, session.user.ormawaId!));
  }
  return base; // reviewer & super_admin: semua data (sesuai kewenangan)
}

export async function getProposalById(session: Session, id: string) {
  const [row] = await db.select().from(proposals).where(eq(proposals.id, id));
  if (!row) return null;
  if (session.user.role === "admin_ormawa" && row.ormawaId !== session.user.ormawaId) {
    return null; // scope violation — treat sebagai not found, jangan bocorkan keberadaan data
  }
  return row;
}
```

---

## 6. Transaksi Wajib untuk Perubahan Status

```ts
// lib/db/queries/review.ts
export async function reviewProposal(
  session: Session,
  proposalId: string,
  action: "disetujui" | "ditolak" | "revisi",
  catatan: string
) {
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(proposals).where(eq(proposals.id, proposalId));
    if (!current) throw new Error("Proposal tidak ditemukan");

    const statusBaru = action; // map action -> status baru
    await tx.update(proposals).set({ status: statusBaru, updatedAt: new Date() }).where(eq(proposals.id, proposalId));

    await tx.insert(reviewLogs).values({
      reviewableType: "proposal",
      reviewableId: proposalId,
      reviewerId: session.user.id,
      action,
      catatan,
      statusSebelum: current.status,
      statusSesudah: statusBaru,
    });
  });
}
```

---

## 7. Migration Workflow (Drizzle Kit)

```bash
npx drizzle-kit generate   # generate migration dari perubahan schema
npx drizzle-kit migrate    # jalankan migration ke Supabase Postgres
npx drizzle-kit studio     # GUI untuk inspect data lokal
```

Environment yang dibutuhkan (`.env.local`):
```
DATABASE_URL=postgresql://...supabase...
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # hanya dipakai server-side untuk signed URL generation
```
