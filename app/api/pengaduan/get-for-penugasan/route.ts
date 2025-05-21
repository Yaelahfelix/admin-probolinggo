import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import { put } from '@vercel/blob';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import bcrypt from 'bcrypt';
const {
  BLOB_READ_WRITE_TOKEN
} = process.env;


export async function GET(request : NextRequest) {
	try {
		const { user } = await getCurrentSession();
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
		
		const tugas_id = request.nextUrl?.searchParams.get('tugas_id')
		
	

		const [data] = await db.query<RowDataPacket[]>(`select a.id, a.nomor,a.nama,a.alamat,a.id as val,concat(a.nomor,"-",a.nama) as label from web_aduan a where is_processed = 0 and is_canceled=0 order by tanggal desc`,[]);
		
		
		
		let result = []
		let combo : any = []
		if (data.length === 0) {
			result.push({
				no_pelanggan : "",
				nama : "",
				alamat : "",
			})

			combo.push(
				{
					value : "",
					label : "None",
				}
			)
		} else {
			result.push(data)
			data.forEach((val)=> {
				combo.push({
					value : `${val.id}`,
					label : `${val.nomor} - ${val.nama}` 
				})
			})
		}

		if (tugas_id != "-1"){
			const [data2] = await db.query<RowDataPacket[]>(`select a.id, a.nomor,a.nama,a.alamat,a.id as val,concat(a.nomor,"-",a.nama) as label from web_aduan a where processed_number=?`,[tugas_id]);
			if (data2.length != 0) {
				data2.forEach((val)=> {
					combo.push({
						value : `${val.id}`,
						label : `${val.nomor} - ${val.nama}` 
					})
				})
			}
		}
		

		return NextResponse.json(
			combo
		,{status : 200})	

	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}




