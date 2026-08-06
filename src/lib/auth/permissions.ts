export type Resource =
  | "ormawa"
  | "divisi"
  | "pengurus"
  | "program_unggulan"
  | "program_kerja"
  | "proposal"
  | "lpj"
  | "review_logs"
  | "berita"
  | "kalender"
  | "galeri"
  | "arsip"
  | "aspirasi";

export type Action = "create" | "read" | "update" | "delete" | "review";

type SessionLike = {
  user: {
    id: string;
    role?: string | null;
    ormawaId?: string | null;
  };
};

const REVIEWER_ROLES = new Set(["kemahasiswaan", "lkpka", "mpm"]);

const CONTENT_RESOURCES: Resource[] = ["berita", "kalender", "galeri", "arsip", "aspirasi"];

/** Keputusan default bem_koordinator (SPRINTS.md): read lintas-ORMAWA, write hanya ormawa miliknya. */
function isOwnOrNil(session: SessionLike, resourceOwnerId?: string | null): boolean {
  if (resourceOwnerId == null) return true;
  return resourceOwnerId === session.user.ormawaId;
}

/**
 * Satu-satunya gerbang authorization (AGENTS.md §2 #1 & #6).
 * Wajib dipanggil di awal server action / API route.
 */
export function can(
  session: SessionLike | null,
  action: Action,
  resource: Resource,
  resourceOwnerId?: string | null,
): boolean {
  if (!session?.user?.id) return false;
  const role = session.user.role ?? "";

  if (role === "super_admin") return true;

  // Reviewer: read + review proposal/lpj, read review_logs. Tidak sentuh struktur ORMAWA.
  if (REVIEWER_ROLES.has(role)) {
    if (action === "review") return resource === "proposal" || resource === "lpj";
    if (action === "read") return resource === "review_logs";
    return false;
  }

  if (role === "bem_koordinator") {
    if (action === "read") {
      return true; // monitoring lintas-ORMAWA
    }
    return isOwnOrNil(session, resourceOwnerId); // write hanya ORMAWA sendiri
  }

  if (role === "admin_ormawa") {
    if (CONTENT_RESOURCES.includes(resource)) return false; // konten publik = ranah super_admin
    if (action === "read") return true; // scope filtering di level query (SCHEMA.md §5)
    return isOwnOrNil(session, resourceOwnerId); // create/update/delete hanya ORMAWA sendiri
  }

  return false;
}

/** Redirect target dashboard per role (PRD §4.1). */
export function dashboardForRole(role?: string | null): string {
  switch (role) {
    case "super_admin":
      return "/dashboard/super-admin";
    case "kemahasiswaan":
    case "lkpka":
    case "mpm":
      return "/dashboard/reviewer";
    case "bem_koordinator":
      return "/dashboard/koordinator";
    case "admin_ormawa":
      return "/dashboard/ormawa";
    default:
      return "/dashboard";
  }
}