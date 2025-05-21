import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import { cookies } from "next/headers";

interface User {
	// 
	id : number,
	email : string,
	nama : string | null,
	image : string | null,
	status : boolean
}

export async function DELETE(request : NextRequest,{ params }: { params:  Promise<{ id: string }> }) {
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
		const [dataCheck] = await db.query<RowDataPacket[]>('select a.id,a.nama,a.role,a.no_telp,a.divisi_id,a.is_active as aktif from petugas a where a.id=? order by nama asc',[id]);
		// const [dataCheck] = await db.query<RowDataPacket[]>('select a.id,a.nama,a.role,a.no_telp,a.divisi_id,b.nama as divisi,a.username,a.password,a.is_active as aktif from petugas a where id=? order by nama_penyelesaian asc',[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}		

		const [rows] = await db.execute<RowDataPacket[]>('DELETE from petugas where id=?',[id]);

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
			message : "Succes Delete Jenis Penyelesaian",
			data : result
		}, {status: 200});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)
	}
}


export async function PUT(request : NextRequest,{ params }: { params:  Promise<{ id: string }> }) {
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

		const formData = await request.formData();
		
		const {nama,aktif,role,no_telp,divisi_id,username} = {
			nama : formData.get("nama") as string,
			role : formData.get("role") as string,
			no_telp : formData.get("nama") as string,
			divisi_id : formData.get("divisi_id") as string,
			username : formData.get("username") as string,
			aktif : formData.get("aktif") as string
		};
		const [dataCheck] = await db.query<RowDataPacket[]>('select id,nama from petugas where id=? order by nama asc',[id]);

		console.log(nama,aktif);
		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const [rows] = await db.execute<RowDataPacket[]>('UPDATE petugas set nama=?,role=?,no_telp=?,divisi_id=?,username=?,is_active=? where id=?',[nama,role,no_telp,divisi_id,username,aktif,id]);

		// const result : any = rows;
		// if (result.affectedRows === 0) {
		// 	return NextResponse.json({
		// 		success : false,
		// 		message : "No Record Affected"
		// 	},
		// 	{
		// 		status: 422
		// 	})				
		// }


		return NextResponse.json({
			success : true,
			message : "Succes Edit Data", 
			data : rows
		}, {status: 200});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)
	}
}

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
		const [dataCheck] = await db.query<RowDataPacket[]>('select a.id,a.nama,a.role,a.no_telp,a.divisi_id,b.nama as divisi,a.username,a.password,a.is_active as aktif from petugas a inner join divisi b on a.divisi_id=b.id where a.id=? order by nama asc',[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const result = {
			id : dataCheck[0].id,
			nama : dataCheck[0].nama,
			role : dataCheck[0].role,
			no_telp : dataCheck[0].no_telp,
			divisi_id : dataCheck[0].divisi_id,
			divisi : dataCheck[0].divisi,
			username : dataCheck[0].username,
			password : dataCheck[0].password,
			aktif : dataCheck[0].aktif.toString()
		}
		return NextResponse.json( {
			success : true, 
			data : result
		},{status : 200})	
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}
}
