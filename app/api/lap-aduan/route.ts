import db from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 403 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const isComplete = searchParams.get("isComplete");
    const completedFrom = searchParams.get("completedFrom");
    const completedTo = searchParams.get("completedTo");
    const jenisAduanId = searchParams.get("jenisAduanId");
    const jenisAduanNama = searchParams.get("jenisAduanNama");

    if (!fromDate && !toDate) {
      return NextResponse.json(
        {
          success: false,
          message: "fromDate or toDate query is missing!",
        },
        { status: 400 }
      );
    }

    let query = `
      SELECT a.id, a.tanggal, a.nomor, a.no_pelanggan, a.jenis_aduan_id, ja.nama as jenis_nama, a.nama, a.no_hp, a.alamat, a.is_complete, a.completed_at,
      a.url_foto_aduan, a.url_foto_penyelesaian
      FROM web_aduan a
      LEFT JOIN jenis_aduan ja ON ja.id = a.jenis_aduan_id
      WHERE tanggal >= ? AND tanggal <= ?
    `;

    const queryParams = [fromDate, toDate];

    if (isComplete !== null && isComplete !== undefined) {
      query += ` AND a.is_complete = ?`;
      queryParams.push(isComplete ? "1" : "0");
    }

    if (completedFrom && completedTo) {
      query += ` AND (a.completed_at >= ? AND a.completed_at <= ?)`;
      queryParams.push(completedFrom, completedTo);
    }

    if (jenisAduanId) {
      query += ` AND a.jenis_aduan_id = ?`;
      queryParams.push(jenisAduanId);
    }

    query += `;`;

    let filterDescription = "";

    const dateRangeStr = `${fromDate} s/d ${toDate}`;

    const filterParts = [];

    if (isComplete !== null && isComplete !== undefined) {
      if (completedFrom && completedTo) {
        filterParts.push(`STATUS SELESAI: ${completedFrom} - ${completedTo}`);
      } else {
        filterParts.push("STATUS SELESAI");
      }
    }

    if (jenisAduanId) {
      filterParts.push(
        `JENIS ADUAN: ${jenisAduanNama || `id-${jenisAduanId}`}`
      );
    }

    filterDescription = filterParts.join(" | ");

    const [data] = await db.query<RowDataPacket[]>(query, queryParams);

    return NextResponse.json(
      {
        success: true,
        data: data,
        filter: filterDescription,
        tanggal: dateRangeStr,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
