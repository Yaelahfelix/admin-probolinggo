import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getCurrentSession } from "@/lib/session";
import { format } from "date-fns";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getCurrentSession();
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 401 }
      );
    }
    const param = await params;
    const id = param.id;
    const body = await request.json();
    const [dataCheck] = await db.query<RowDataPacket[]>(
      "select nama from pdamkota_loket.web_user_daftarpsb WHERE id = ? and flaghub = 0;",
      [id]
    );

    if (dataCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "tidak bisa memproses pendaftaran yang belum dihubungi",
        },
        { status: 403 }
      );
    }
    const prosesAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const [rows] = await db.execute<RowDataPacket[]>(
      "UPDATE web_user_daftarpsb set proses_at=?, proses_by=?, flagproses=1 WHERE id = ?;",
      [prosesAt, body.proses_by, id]
    );
    return NextResponse.json(
      {
        success: true,
        message: "Succes update proses pendaftaran",
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
