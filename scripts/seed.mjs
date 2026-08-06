/**
 * Seed Sprint 1: 6 akun demo (1 per role) + 2 ORMAWA test.
 * Jalankan: node scripts/seed.mjs  (baca .env.local sendiri)
 * Password semua akun: password123
 */
import { config as loadEnv } from "dotenv";
import postgres from "postgres";
import bcrypt from "bcryptjs";

loadEnv({ path: "./.env.local" });

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const PASSWORD = "password123";

const users = [
  { name: "Super Admin", email: "superadmin@simormawa.test", role: "super_admin", ormawaId: null },
  { name: "Kemahasiswaan", email: "kemahasiswaan@simormawa.test", role: "kemahasiswaan", ormawaId: null },
  { name: "LKPKA", email: "lkpka@simormawa.test", role: "lkpka", ormawaId: null },
  { name: "MPM", email: "mpm@simormawa.test", role: "mpm", ormawaId: null },
  { name: "BEM Koordinator", email: "bemkoord@simormawa.test", role: "bem_koordinator", ormawaId: "BEM" },
  { name: "Admin HIMA Informatika", email: "adminhima@simormawa.test", role: "admin_ormawa", ormawaId: "HIMA" },
];

async function main() {
  const [bem] = await sql`
    insert into ormawa (nama, slug, jenis) values ('BEM KM Universitas Adzkia', 'bem-km', 'bem')
    on conflict (slug) do nothing returning id`;
  const [hima] = await sql`
    insert into ormawa (nama, slug, jenis) values ('HIMA Informatika', 'hima-informatika', 'hima')
    on conflict (slug) do nothing returning id`;

  const bemId = bem?.id ?? (await sql`select id from ormawa where slug='bem-km'`)[0].id;
  const himaId = hima?.id ?? (await sql`select id from ormawa where slug='hima-informatika'`)[0].id;

  const hash = await bcrypt.hash(PASSWORD, 10);

  for (const u of users) {
    const ormawaId = u.ormawaId === "BEM" ? bemId : u.ormawaId === "HIMA" ? himaId : null;
    await sql`
      insert into users (name, email, password_hash, role, ormawa_id)
      values (${u.name}, ${u.email}, ${hash}, ${u.role}, ${ormawaId})
      on conflict (email) do nothing`;
  }

  console.log("Seed selesai. Akun:");
  for (const u of users) console.log(`  ${u.email}  (${u.role})  password: ${PASSWORD}`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});