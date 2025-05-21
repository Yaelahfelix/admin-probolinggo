import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import bcrypt from "bcrypt";

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
    const search = request.nextUrl?.searchParams.get("search");
    // const limit = request.nextUrl?.searchParams.get('limit')

    // let filter = 'WHERE a.id>0 ';
    // if (periode != null) {
    // 	filter =`${filter} AND DATE_FORMAT(a.tanggal,"%Y%m")=${periode} `;
    // }
    // if (status != null) {

    // 	if (status != "-1"){

    // 		filter =`${filter} AND (a.is_processed+a.is_complete)=${status}`;
    // 	}

    // }

    const [data] = await db.query<RowDataPacket[]>(
      `select no_pelanggan,trim(nama) as nama,trim(alamat)  as alamat from pelanggan where  locate("${search}",CONCAT_WS(' ',no_pelanggan,nama,alamat)) limit 10`,
      []
    );

    let result = [];
    let combo: any = [];
    if (data.length === 0) {
      result.push({
        no_pelanggan: "",
        nama: "",
        alamat: "",
      });

      combo.push({
        value: "",
        label: "None",
      });
    } else {
      result.push(data);
      data.forEach((val) => {
        combo.push({
          value: `${val.no_pelanggan};${val.nama};${val.alamat}`,
          label: `${val.no_pelanggan} - ${val.nama} - ${val.alamat}`,
        });
      });
    }

    // // await db.end();
    // console.log(result);
    return NextResponse.json(combo, { status: 200 });
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

    const { nama, aktif, role, no_telp, divisi_id, username, password } = {
      nama: formData.get("nama") as string,
      role: formData.get("role") as string,
      no_telp: formData.get("no_telp") as string,
      divisi_id: formData.get("divisi_id") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
      aktif: formData.get("aktif") as string,
    };

    const [dataCheck] = await db.query<RowDataPacket[]>(
      "select id,nama as nama,is_active as aktif from petugas where nama=? order by nama asc",
      [nama]
    );
    if (dataCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Petugas Alrerady Exist",
        },
        {
          status: 422,
        }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const [rows] = await db.execute<RowDataPacket[]>(
      "Insert into petugas (nama,role,no_telp,divisi_id,username,password,is_active) values (?,?,?,?,?,?,?)",
      [nama, role, no_telp, divisi_id, username, hashedPassword, aktif]
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
