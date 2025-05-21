import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';

import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import bcrypt from 'bcrypt';


export async function GET(request : Request) {
	try {
		const { user } = await getCurrentSession();
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
		const [data] = await db.query<RowDataPacket[]>('select a.id,a.nama,a.role,a.no_telp,a.divisi_id,b.nama as divisi,a.username,a.password,a.is_active as aktif from petugas a inner join divisi b on a.divisi_id=b.id order by nama asc',[]);
		
		// // await db.end();
		// console.log(data);
		return NextResponse.json( {
			success : true, 
			data : data
		},{status : 200})	
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}

export async function POST(request : NextRequest) {
	try {

		const { user } = await getCurrentSession();

    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
		const formData = await request.formData();
		
		const {nama,aktif,role,no_telp,divisi_id,username,password} = {
			nama : formData.get("nama") as string,
			role : formData.get("role") as string,
			no_telp : formData.get("no_telp") as string,
			divisi_id : formData.get("divisi_id") as string,
			password : formData.get("password") as string,
			username : formData.get("username") as string,
			aktif : formData.get("aktif") as string
		};

		const [dataCheck] = await db.query<RowDataPacket[]>('select id,nama as nama,is_active as aktif from petugas where nama=? order by nama asc',[nama]);
		if (dataCheck.length > 0 ) {
			return NextResponse.json({
				success : false,
				message : "Petugas Alrerady Exist"
			},
			{
				status: 422
			})	
		}

		const hashedPassword = bcrypt.hashSync(password, 10)
		const [rows] = await db.execute<RowDataPacket[]>('Insert into petugas (nama,role,no_telp,divisi_id,username,password,is_active) values (?,?,?,?,?,?,?)',
			[nama,role,no_telp,divisi_id,username,hashedPassword,aktif]);

		const result : any = rows;
		if (result.affectedRows === 0) {
			return NextResponse.json({
				success : false,
				message : "No Record Affected"
			},
			{
				status: 422
			})				
		}

		return NextResponse.json({
			success : true,
			message : "Succes Create Data",
			data : result
		}, {status: 200});				
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}




}


