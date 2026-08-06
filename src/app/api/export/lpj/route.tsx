import { NextResponse } from "next/server";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { can } from "@/lib/auth/permissions";
import { getLpjExportByOrmawa } from "@/lib/db/queries/export";
import { formatTanggal } from "@/lib/format";

export async function GET(request: Request) {
  const session = await auth();
  if (!can(session, "export", "lpj")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const ormawaId = url.searchParams.get("ormawaId");
  if (!ormawaId) return NextResponse.json({ error: "ormawaId wajib" }, { status: 400 });

  const data = await getLpjExportByOrmawa(ormawaId);
  if (!data) return NextResponse.json({ error: "ORMAWA tidak ditemukan" }, { status: 404 });

  const styles = StyleSheet.create({
    page: { padding: 32, fontFamily: "Helvetica", fontSize: 10 },
    title: { fontSize: 16, marginBottom: 4 },
    subtitle: { color: "#555", marginBottom: 16 },
    headerRow: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#999", paddingVertical: 6, fontWeight: "bold" },
    row: { flexDirection: "row", borderBottom: 1, borderBottomColor: "#ddd", paddingVertical: 6 },
    colNo: { width: "6%" },
    colJudul: { width: "44%" },
    colProposal: { width: "26%" },
    colStatus: { width: "12%" },
    colTgl: { width: "12%" },
    empty: { marginTop: 12, color: "#888" },
  });

  const Row = ({ children, header }: { children: React.ReactNode; header?: boolean }) => (
    <View style={header ? styles.headerRow : styles.row}>{children}</View>
  );

  const buffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Ringkasan LPJ — {data.ormawaNama}</Text>
        <Text style={styles.subtitle}>
          KM Universitas Adzkia · Export {new Date().toLocaleDateString("id-ID")}
        </Text>
        {data.rows.length === 0 && <Text style={styles.empty}>Belum ada LPJ untuk ORMAWA ini.</Text>}
        {data.rows.length > 0 && (
          <View>
            <Row header>
              <Text style={styles.colNo}>No</Text>
              <Text style={styles.colJudul}>Judul LPJ</Text>
              <Text style={styles.colProposal}>Proposal Terkait</Text>
              <Text style={styles.colStatus}>Status</Text>
              <Text style={styles.colTgl}>Diajukan</Text>
            </Row>
            {data.rows.map((r, i) => (
              <Row key={`${r.judul}-${i}`}>
                <Text style={styles.colNo}>{i + 1}</Text>
                <Text style={styles.colJudul}>{r.judul}</Text>
                <Text style={styles.colProposal}>{r.proposalJudul}</Text>
                <Text style={styles.colStatus}>{r.status}</Text>
                <Text style={styles.colTgl}>{formatTanggal(r.submittedAt)}</Text>
              </Row>
            ))}
          </View>
        )}
      </Page>
    </Document>,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="rekap-lpj.pdf"',
    },
  });
}