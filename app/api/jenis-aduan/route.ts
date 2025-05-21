import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";

interface User {
  //
  id: number;
  email: string;
  nama: string | null;
  image: string | null;
  status: boolean;
}

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
    const [data] = await db.query<RowDataPacket[]>(
      "select id,nama,is_active as aktif from jenis_aduan order by nama asc",
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

    const { nama, aktif } = {
      nama: formData.get("nama") as string,
      aktif: formData.get("aktif") as string,
    };

    const [dataCheck] = await db.query<RowDataPacket[]>(
      "select id,nama from jenis_aduan where nama=? order by nama asc",
      [nama]
    );
    console.log(dataCheck);
    if (dataCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis Aduan Alrerady Exist",
        },
        {
          status: 422,
        }
      );
    }
    const [rows] = await db.execute<RowDataPacket[]>(
      "Insert into jenis_aduan (nama,is_active) values (?,?)",
      [nama, aktif]
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
        message: "Succes Create Data",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
