import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { put } from "@vercel/blob";
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import bcrypt from "bcrypt";
const { BLOB_READ_WRITE_TOKEN } = process.env;

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
    const status = request.nextUrl?.searchParams.get("status");
    const periode = request.nextUrl?.searchParams.get("periode");

    let filter = "where a.is_processed=1 ";
    if (periode != null) {
      filter = `${filter} AND DATE_FORMAT(a.processed_at,"%Y%m")=${periode} `;
    }

    const [data] = await db.query<RowDataPacket[]>(
      `
			select a.processed_number AS id,a.processed_number AS nomor,a.processed_at AS tgl_penugasan,group_concat(a.nomor) as nomor_aduan,GROUP_CONCAT(a.nama) as nama,a.processed_to_divisi_id as divisiid,d.nama as divisi
			,sum(a.is_complete) as iscomplete from web_aduan a left join divisi d on a.processed_to_divisi_id=d.id ${filter} group by a.processed_number order by a.processed_at desc`,
      []
    );

    // // await db.end();
    // console.log(data);
    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
    if (user === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorize",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const { aduan_id, divisi_id } = {
      divisi_id: formData.get("divisi_id") as string,
      aduan_id: formData.getAll("aduan_id[]"),
    };

    const [rowNomor] = await db.query<RowDataPacket[]>(
      "select noautopenugasan(CURRENT_DATE) as nomor",
      []
    );
    const nomor = rowNomor[0].nomor;

    const [rows] = await db.execute<RowDataPacket[]>(
      `UPDATE web_aduan a SET is_processed=1,processed_at=NOW(), processed_by_id=?,processed_number=?,processed_to_divisi_id=? WHERE a.id IN (${aduan_id.toString()}) `,
      [user.id, nomor, divisi_id]
    );

    const result: any = rows;
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No Record Affected",
        },
        {
          status: 422,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Succes Create Penugasan",
        data: result,
      },
      { status: 200 }
    );
    // return NextResponse.json({
    // 	success : false,
    // 	message : "No Record Affected"
    // },
    // {
    // 	status: 422
    // })
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
