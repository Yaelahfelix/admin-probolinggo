import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";

interface  DataTtd   {
  header1 : string,
  header2 : string,
  header3 : string,
  header4  : string,
  nama1 : string,
  jab1 : string,
  nik1 : string,
  nama2 : string,
  jab2 : string,
  nik2 : string,
  nama3 : string,
  jab3 : string,
  nik3 : string,
  nama4 : string,
  jab4 : string,
  nik4 : string,
}

const defaultDataTtd : DataTtd = {
  header1 : "",
  header2 : "",
  header3 : "",
  header4  : "",
  nama1 : "",
  jab1 : "",
  nik1 : "",
  nama2 : "",
  jab2 : "",
  nik2 : "",
  nama3 : "",
  jab3 : "",
  nik3 : "",
  nama4 : "",
  jab4 : "",
  nik4 : "",
};


export async function GET(request : NextRequest) {
	try {
		const { user } = await getCurrentSession();
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
		
		const kode = request.nextUrl?.searchParams.get('kode')
		
		if (kode == null){
				return NextResponse.json({
					success : false,
					message : "dataNotexist"
				},{status: 422})	

		}


		const [data] = await db.query<RowDataPacket[]>(`
																											SELECT 
																											t.header1,
																											t.header2,
																											t.header3,
																											t.header4,
																											a.nama AS nama1,
																											a.jabatan AS jab1,
																											a.nik AS nik1,
																											b.nama AS nama2,
																											b.jabatan AS jab2,
																											b.nik AS nik2,
																											c.nama AS nama3,
																											c.jabatan AS jab3,
																											c.nik AS nik3,
																											d.nama AS nama4,
																											d.jabatan AS jab4,
																											d.nik AS nik4
																											FROM ttdlap t
																											LEFT JOIN userparaf a ON t.id1=a.id
																											LEFT JOIN userparaf b ON t.id2=b.id
																											LEFT JOIN userparaf c ON t.id3=c.id
																											LEFT JOIN userparaf d ON t.id4=d.id
																											WHERE t.kode=?
																											`,[kode]);
		
		
		
		let result : DataTtd[] = []

		if (data.length === 0) {
			result.push(defaultDataTtd)

		} else {
			data.forEach((val)=> {
				result.push(val as DataTtd)
			})
		}



		return NextResponse.json(
			result
		,{status : 200})	

	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}




