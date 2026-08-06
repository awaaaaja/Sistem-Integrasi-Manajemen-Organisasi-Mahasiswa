CREATE TYPE "public"."aspirasi_status" AS ENUM('baru', 'ditindaklanjuti');--> statement-breakpoint
CREATE TYPE "public"."ormawa_jenis" AS ENUM('bem', 'mpm', 'hima', 'ukm');--> statement-breakpoint
CREATE TYPE "public"."ormawa_status" AS ENUM('aktif', 'nonaktif');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('draft', 'diajukan', 'revisi', 'disetujui', 'ditolak');--> statement-breakpoint
CREATE TYPE "public"."reviewable_type" AS ENUM('proposal', 'lpj');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('super_admin', 'kemahasiswaan', 'lkpka', 'mpm', 'bem_koordinator', 'admin_ormawa');--> statement-breakpoint
CREATE TABLE "berita" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"slug" text NOT NULL,
	"konten" text NOT NULL,
	"thumbnail_path" text,
	"author_id" uuid NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "berita_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "divisi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ormawa_id" uuid NOT NULL,
	"nama" text NOT NULL,
	"deskripsi" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galeri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"foto_path" text NOT NULL,
	"kategori" text,
	"ormawa_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lpj" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" uuid NOT NULL,
	"judul" text NOT NULL,
	"file_lpj_path" text NOT NULL,
	"file_bukti_pengeluaran_path" text NOT NULL,
	"status" "proposal_status" DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ormawa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"slug" text NOT NULL,
	"jenis" "ormawa_jenis" NOT NULL,
	"deskripsi" text,
	"visi" text,
	"misi" text,
	"logo_path" text,
	"banner_path" text,
	"status" "ormawa_status" DEFAULT 'aktif' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ormawa_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pengurus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ormawa_id" uuid NOT NULL,
	"divisi_id" uuid,
	"nama" text NOT NULL,
	"jabatan" text NOT NULL,
	"foto_path" text,
	"periode_mulai" timestamp NOT NULL,
	"periode_selesai" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ormawa_id" uuid NOT NULL,
	"judul" text NOT NULL,
	"deskripsi" text,
	"target_waktu" timestamp,
	"status" text DEFAULT 'berjalan' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_unggulan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ormawa_id" uuid NOT NULL,
	"judul" text NOT NULL,
	"deskripsi" text,
	"tahun" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_kerja_id" uuid NOT NULL,
	"ormawa_id" uuid NOT NULL,
	"judul" text NOT NULL,
	"file_proposal_path" text NOT NULL,
	"file_rab_path" text,
	"status" "proposal_status" DEFAULT 'draft' NOT NULL,
	"submitted_by" uuid NOT NULL,
	"submitted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reviewable_type" "reviewable_type" NOT NULL,
	"reviewable_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"action" text NOT NULL,
	"catatan" text,
	"status_sebelum" "proposal_status",
	"status_sesudah" "proposal_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" NOT NULL,
	"ormawa_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "arsip" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"file_path" text NOT NULL,
	"kategori" text,
	"tahun" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aspirasi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_pengirim" text NOT NULL,
	"email" text NOT NULL,
	"pesan" text NOT NULL,
	"status" "aspirasi_status" DEFAULT 'baru' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kalender" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" text NOT NULL,
	"deskripsi" text,
	"tanggal_mulai" timestamp NOT NULL,
	"tanggal_selesai" timestamp,
	"kategori" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "berita" ADD CONSTRAINT "berita_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "divisi" ADD CONSTRAINT "divisi_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "galeri" ADD CONSTRAINT "galeri_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lpj" ADD CONSTRAINT "lpj_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengurus" ADD CONSTRAINT "pengurus_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pengurus" ADD CONSTRAINT "pengurus_divisi_id_divisi_id_fk" FOREIGN KEY ("divisi_id") REFERENCES "public"."divisi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_kerja" ADD CONSTRAINT "program_kerja_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_unggulan" ADD CONSTRAINT "program_unggulan_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_program_kerja_id_program_kerja_id_fk" FOREIGN KEY ("program_kerja_id") REFERENCES "public"."program_kerja"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_ormawa_id_ormawa_id_fk" FOREIGN KEY ("ormawa_id") REFERENCES "public"."ormawa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "berita_slug_idx" ON "berita" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "divisi_ormawa_id_idx" ON "divisi" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "galeri_ormawa_id_idx" ON "galeri" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "lpj_proposal_id_idx" ON "lpj" USING btree ("proposal_id");--> statement-breakpoint
CREATE INDEX "lpj_status_idx" ON "lpj" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "ormawa_slug_idx" ON "ormawa" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "pengurus_ormawa_id_idx" ON "pengurus" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "program_kerja_ormawa_id_idx" ON "program_kerja" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "program_unggulan_ormawa_id_idx" ON "program_unggulan" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "proposals_ormawa_id_idx" ON "proposals" USING btree ("ormawa_id");--> statement-breakpoint
CREATE INDEX "proposals_program_kerja_id_idx" ON "proposals" USING btree ("program_kerja_id");--> statement-breakpoint
CREATE INDEX "proposals_status_idx" ON "proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_logs_reviewer_id_idx" ON "review_logs" USING btree ("reviewer_id");--> statement-breakpoint
CREATE INDEX "review_logs_reviewable_idx" ON "review_logs" USING btree ("reviewable_type","reviewable_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_ormawa_id_idx" ON "users" USING btree ("ormawa_id");