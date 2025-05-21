import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { getCurrentSession } from "@/lib/session";
import { convertStatusAduan, converUrlFotoAduan } from "@/lib/utils";
import { encrypt } from "@/lib/crypto";

const baseUrl: string = process.env.BASE_URL || "http://localhost:3000";
export async function GET(
  request: Request,
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
        { status: 403 }
      );
    }

    const param = await params;
    const id = param.id;
    const [dataCheck] = await db.query<RowDataPacket[]>(
      `SELECT
			a.id,
			DATE_FORMAT(a.tanggal,"%d-%m-%Y") as tanggal,
			a.nomor,
			a.no_pelanggan,
			a.jenis_aduan_id,
			b.nama as jenis_aduan,
			a.nama,
			a.no_hp,
			a.alamat,
			a.ket_aduan,
			a.url_foto_aduan,
			a.sumber_laporan,
			a.is_processed,
			DATE_FORMAT(a.processed_at,"%d-%m-%Y") as processed_at, 
			a.processed_by_id,
			f.nama as nama_memproses,
			a.processed_number,
			a.processed_to_divisi_id,
			d.nama as nama_divisi,
			a.processed_to_petugas_id,
			e.nama as nama_petugas,
			a.is_complete, 
			DATE_FORMAT(a.completed_at,"%d-%m-%Y") as completed_at, 
			a.jenis_penyelesaian_id,
			g.nama_penyelesaian,
			a.ket_penyelesaian,
			a.url_foto_penyelesaian,
			a.is_canceled, 
			a.cancel_reason,
			DATE_FORMAT(a.updated_at,"%d-%m-%Y") as updated_at,
			a.is_processed+a.is_complete status_aduan FROM web_aduan a 
			LEFT JOIN jenis_aduan as b ON a.jenis_aduan_id=b.id
			LEFT JOIN divisi as d ON a.processed_to_divisi_id=d.id
			LEFT JOIN petugas as e ON a.processed_to_petugas_id=e.id
			LEFT JOIN web_admin_user as f ON a.processed_by_id=f.id
			LEFT JOIN jenis_penyelesaian as g ON a.jenis_penyelesaian_id=g.id
			WHERE a.id=?`,
      [id]
    );

    if (dataCheck.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "dataNotexist",
        },
        { status: 422 }
      );
    }

    let namaJoin = dataCheck[0].nama;
    if (dataCheck[0].no_pelanggan != null) {
      namaJoin = `${dataCheck[0].no_pelanggan} - ${dataCheck[0].nama}`;
    }

    const tracking_aduan = dataCheck.map((val) => {
      let tracking = [];
      const dataMasuk = {
        id: 1,
        judul: `DATA MASUK NOMOR : ${val.nomor}`,
        tanggal: val.tanggal,
        deskripsi: `Data aduan masuk ke server di input oleh ${user.nama}`,
      };
      tracking.push(dataMasuk);

      if (val.is_processed) {
        const dataDitugasi = {
          id: 2,
          judul: `ADUAN DI PROSES NOMOR: ${val.processed_number}`,
          tanggal: val.processed_at,
          deskripsi: `aduan telah diteruskan kepada Divisi : ${val.nama_divisi} , Oleh ${val.nama_memproses}`,
        };
        tracking.push(dataDitugasi);
      }

      if (val.processed_to_petugas_id != null) {
        const dataDitugasi2 = {
          id: 3,
          judul: `ADUAN DI PROSES NOMOR: ${val.processed_number}`,
          tanggal: val.updated_at,
          deskripsi: `aduan telah diteruskan kepada Petugas : ${val.nama_petugas}`,
        };
        tracking.push(dataDitugasi2);
      }

      if (val.is_complete) {
        const dataComplet = {
          id: 4,
          judul: `ADUAN SELESAI`,
          tanggal: val.completed_at,
          deskripsi: `aduan telah diselesaikan oleh Petugas : ${val.nama_petugas || ""} ket : ${val.nama_penyelesaian} , ${val.ket_penyelesaian}  `,
        };
        tracking.push(dataComplet);
      }

      if (val.is_canceled) {
        const iscancel = {
          id: 5,
          judul: `ADUAN CANCEL`,
          tanggal: val.updated_at,
          deskripsi: `aduan telah di cancel dengan alasan : ${val.cancel_reason} `,
        };
        tracking.push(iscancel);
      }

      return tracking;
    });
    tracking_aduan[0].reverse();
    const idEncrypt = encodeURIComponent(encrypt(dataCheck[0].id));
    const result = {
      id: dataCheck[0].id,
      nama: namaJoin,
      tanggal: dataCheck[0].tanggal,
      sumber_laporan: dataCheck[0].sumber_laporan,
      no_pelanggan: dataCheck[0].no_pelanggan,
      jenis_aduan_id: dataCheck[0].jenis_aduan_id,
      nomor: dataCheck[0].nomor,
      no_hp: dataCheck[0].no_hp,
      alamat: dataCheck[0].alamat,
      jenis_aduan: dataCheck[0].jenis_aduan,
      ket_aduan: dataCheck[0].ket_aduan,
      status: convertStatusAduan(dataCheck[0].status_aduan),
      foto_aduan: converUrlFotoAduan(dataCheck[0].url_foto_aduan),
      url_qrcode: `${baseUrl}/pub/aduan/detail?id=${idEncrypt}`,
      user_buat: user.nama,
      tracking: tracking_aduan[0],
    };

    // console.log(result)
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
