import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { auth } from "@/auth";
import { can } from "@/lib/auth/permissions";
import { getProposalExport } from "@/lib/db/queries/export";
import { formatTanggal } from "@/lib/format";

export async function GET(request: Request) {
  const session = await auth();
  if (!can(session, "export", "proposal")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const ormawaId = url.searchParams.get("ormawaId") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const from = url.searchParams.get("from") ? new Date(url.searchParams.get("from")!) : undefined;
  const to = url.searchParams.get("to") ? new Date(url.searchParams.get("to")!) : undefined;

  const rows = await getProposalExport({ ormawaId, status, from, to });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Rekap Proposal");
  sheet.columns = [
    { header: "No", key: "no", width: 6 },
    { header: "Judul Proposal", key: "judul", width: 40 },
    { header: "ORMAWA", key: "ormawa", width: 25 },
    { header: "Status", key: "status", width: 18 },
    { header: "Tanggal Diajukan", key: "submittedAt", width: 20 },
    { header: "Dibuat", key: "createdAt", width: 20 },
  ];
  rows.forEach((r, i) =>
    sheet.addRow({
      no: i + 1,
      judul: r.judul,
      ormawa: r.ormawaNama,
      status: r.status,
      submittedAt: formatTanggal(r.submittedAt),
      createdAt: formatTanggal(r.createdAt),
    }),
  );
  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rekap-proposal.xlsx"',
    },
  });
}