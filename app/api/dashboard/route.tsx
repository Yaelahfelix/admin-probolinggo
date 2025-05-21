import db from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { format } from "date-fns";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    const periodeSkrg = format(new Date(), "yyyyMM");
    const [dataPengaduan] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM web_aduan where date_format(tanggal, "%Y%m") = ?;`,
      [periodeSkrg]
    );

    const [dataPengaduanBlmSelesai] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM web_aduan where is_complete = 0;`,
      [periodeSkrg]
    );

    const [dataPsb] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM web_user_daftarpsb where date_format(created_at, "%Y%m") = ?;`,
      [periodeSkrg]
    );

    const [chartTotalPengaduan] = await db.query<RowDataPacket[]>(
      `
 SELECT 
    DATE_FORMAT(STR_TO_DATE(CONCAT(periods.bulan, '-01'), '%Y-%m-%d'), '%b %Y') AS bulan,
    COUNT(w.id) AS total_pengaduan,
    SUM(CASE WHEN w.completed_at IS NOT NULL THEN 1 ELSE 0 END) AS total_selesai
FROM 
    (
        SELECT DATE_FORMAT(DATE_ADD(DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR), INTERVAL n MONTH), '%Y-%m') AS bulan
        FROM 
            (
                SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
                UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
            ) AS numbers
        WHERE 
            DATE_ADD(DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR), INTERVAL n MONTH) <= CURRENT_DATE()
    ) AS periods
LEFT JOIN 
    web_aduan w ON DATE_FORMAT(w.tanggal, '%Y-%m') = periods.bulan
    AND w.tanggal >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
GROUP BY 
    periods.bulan
ORDER BY 
    STR_TO_DATE(CONCAT(periods.bulan, '-01'), '%Y-%m-%d') ASC;
      `
    );

    // // await db.end();
    // console.log(data);
    return NextResponse.json(
      {
        success: true,
        dataPengaduan,
        dataPengaduanBlmSelesai,
        dataPsb,
        chartTotalPengaduan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
