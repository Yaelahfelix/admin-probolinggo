import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";

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
		console.log(id)
		const [divisi] = await db.query<RowDataPacket[]>(`select a.processed_to_divisi_id as divisiid,a.processed_number as nomor_tugas,b.nama as divisi,DATE_FORMAT(a.processed_at,"%d-%m-%Y") as tgl_penugasan
																											from web_aduan a left join divisi b on a.processed_to_divisi_id=b.id where a.processed_number=?`,[id]);

		if (divisi.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const [aduanId] = await db.query<RowDataPacket[]>(`select a.id,DATE_FORMAT(a.tanggal,"%d-%m-%Y") as tanggal,a.nomor,a.no_pelanggan,a.nama,a.alamat,a.no_hp,b.nama as jenisaduan 
			,a.ket_aduan from web_aduan a left join jenis_aduan b on a.jenis_aduan_id=b.id where a.processed_number=?`,[id]);

		if (aduanId.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataAduanNotexist"
			},{status: 422})	
		}

		const aduanIdresult = aduanId.map((val)=>{
			let namaJoin  = ""
			if (val.no_pelanggan != null) {
				namaJoin = `${val.no_pelanggan} - ${val.nama}`
			} else {
				namaJoin = val.nama
			}
			const res = {
				id : val.id,
				tanggal : val.tanggal,
				nomor : val.nomor,
				nama : namaJoin,
				alamat : val.alamat,
				no_hp : val.no_hp,
				aduan : `${val.jenisaduan} - ${val.ket_aduan}`
			}
			return res
		})

		const result = {
			id : id,
			divisi : divisi[0].divisi,
			tgl_penugasan : divisi[0].tgl_penugasan,
			aduan : aduanIdresult
		}
		console.log(result)
		return NextResponse.json( {
			success : true, 
			data : result
		},{status : 200})	
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}
