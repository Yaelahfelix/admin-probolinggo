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
    const filterBy = searchParams.get("filterBy");
    let jenis;
    let query;
    const dateRangeStr = `${fromDate} s/d ${toDate}`;

    if (filterBy === "jenisAduan") {
      query = `
        select COUNT(a.id) as jml, ja.nama, SUM(if(a.is_complete, 0, 1)) as belum_selesai,
SUM(is_complete) as sudah_selesai from web_aduan a
left join jenis_aduan ja on ja.id = a.jenis_aduan_id
WHERE tanggal >= ? AND tanggal <= ? group by a.jenis_aduan_id  
            `;
      jenis = "Jenis Aduan";
    } else {
      query = `
    select COUNT(a.id) as jml, ja.nama_penyelesaian, SUM(if(a.is_complete, 0, 1)) as belum_selesai,
SUM(is_complete) as sudah_selesai from web_aduan a
left join jenis_penyelesaian ja on ja.id = a.id
WHERE tanggal >= ? AND tanggal <= ? group by jenis_penyelesaian_id
`;
      jenis = "Jenis Penyelesaian";
    }
    const [data] = await db.query<RowDataPacket[]>(query, [fromDate, toDate]);

    // // await db.end();
    // console.log(data);
    return NextResponse.json(
      {
        success: true,
        data: data,
        tanggal: dateRangeStr,
        jenis,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
