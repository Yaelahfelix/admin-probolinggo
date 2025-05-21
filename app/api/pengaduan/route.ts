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

    let filter = "WHERE a.id>0 ";
    if (periode != null) {
      filter = `${filter} AND DATE_FORMAT(a.tanggal,"%Y%m")=${periode} `;
    }
    if (status != null) {
      if (status != "-1") {
        filter = `${filter} AND (a.is_processed+a.is_complete)=${status}`;
      }
    }

    const [data] = await db.query<RowDataPacket[]>(
      `select a.id,a.nomor,
			a.no_pelanggan,a.jenis_aduan_id,b.nama as jenis_aduan,a.tanggal,
			a.nama,a.no_hp,a.alamat,a.ket_aduan,a.url_foto_aduan,a.is_processed+a.is_complete status_aduan from web_aduan a inner join jenis_aduan b on a.jenis_aduan_id=b.id ${filter} order by tanggal desc,id desc`,
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
    const {
      tanggal,
      sumber_laporan,
      no_pelanggan,
      nama,
      alamat,
      no_hp,
      jenis_aduan_id,
      ket_aduan,
      foto_aduan,
    } = {
      tanggal: (formData.get("tanggal") as string).substring(0, 10),
      nama: formData.get("nama") as string,
      alamat: formData.get("alamat") as string,
      no_pelanggan: (formData.get("no_pelanggan") as string) || undefined,
      jenis_aduan_id: formData.get("jenis_aduan_id") as string,
      sumber_laporan: formData.get("sumber_laporan") as string,
      no_hp: formData.get("no_hp") as string,
      ket_aduan: formData.get("ket_aduan") as string,
      foto_aduan: (formData.get("foto_aduan") as File) || undefined,
    };

    let imageUrl = null;
    const myFile = foto_aduan;
    let no_pelIns = null;
    if (no_pelanggan != null) {
      no_pelIns = no_pelanggan;
    }
    const [nomor] = await db.query<RowDataPacket[]>(
      "select noautoaduan() as nomor"
    );
    if (myFile != null) {
      const myfillename = nomor[0].nomor + "_" + myFile.name.replace(/ /g, "_");
      const blob = await put(myfillename, myFile, {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      });
      imageUrl = blob.url;
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      "Insert into web_aduan (tanggal,user_admin_id,nomor,no_pelanggan,jenis_aduan_id,nama,alamat,no_hp,ket_aduan,url_foto_aduan,sumber_laporan) values (?,?,?,?,?,?,?,?,?,?,?)",
      [
        tanggal,
        user.id,
        nomor[0].nomor,
        no_pelIns,
        jenis_aduan_id,
        nama,
        alamat,
        no_hp,
        ket_aduan,
        imageUrl,
        sumber_laporan,
      ]
    );

    // const hashedPassword = bcrypt.hashSync(password, 10)
    // const [rows] = await db.execute<RowDataPacket[]>('Insert into petugas (nama,role,no_telp,divisi_id,username,password,is_active) values (?,?,?,?,?,?,?)',
    // 	[nama,role,no_telp,divisi_id,username,hashedPassword,aktif]);

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
