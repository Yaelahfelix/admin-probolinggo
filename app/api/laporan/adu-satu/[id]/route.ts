import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import { getCurrentSession } from "@/lib/session";
import { convertStatusAduan,converUrlFotoAduan } from "@/lib/utils";
import { encrypt } from "@/lib/crypto";


const baseUrl : string  = process.env.BASE_URL || "http://localhost:3000";
export async function GET(request: Request,{ params }: { params:  Promise<{ id: string }> }) {
	try {
		const { user } = await getCurrentSession();
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
	
		const param =  await params
		const id =  param.id
		const [dataCheck] = await db.query<RowDataPacket[]>(`select a.id,a.nomor,DATE_FORMAT(a.tanggal,"%d-%m-%Y") as tanggal,a.sumber_laporan,
			a.no_pelanggan,a.jenis_aduan_id,b.nama as jenis_aduan,
			a.nama,a.no_hp,a.alamat,a.ket_aduan,a.url_foto_aduan,a.is_processed+a.is_complete status_aduan from web_aduan a inner join jenis_aduan b on a.jenis_aduan_id=b.id where a.id=? order by tanggal desc,id desc`,[id]);
	
		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}
	
		let namaJoin = dataCheck[0].nama;
		if (dataCheck[0].no_pelanggan != null){
			namaJoin = `${dataCheck[0].no_pelanggan} - ${dataCheck[0].nama}`
		}

		const idEncrypt = encodeURIComponent(encrypt(dataCheck[0].id));
		const result = {
			id : dataCheck[0].id,
			nama : namaJoin,
			tanggal : dataCheck[0].tanggal,
			sumber_laporan : dataCheck[0].sumber_laporan,
			no_pelanggan : dataCheck[0].no_pelanggan,
			jenis_aduan_id : dataCheck[0].jenis_aduan_id,
			nomor : dataCheck[0].nomor,
			no_hp : dataCheck[0].no_hp,
			alamat : dataCheck[0].alamat,
			jenis_aduan : dataCheck[0].jenis_aduan,
			ket_aduan : dataCheck[0].ket_aduan,
			status : convertStatusAduan(dataCheck[0].status_aduan),
			foto_aduan : converUrlFotoAduan(dataCheck[0].url_foto_aduan),
			url_qrcode : `${baseUrl}/pub/aduan/detail?id=${idEncrypt}`,
			user_buat : user.nama,
		}
		
		// console.log(result)
		return NextResponse.json( {
			success : true, 
			data : result
		},{status : 200})	
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}
