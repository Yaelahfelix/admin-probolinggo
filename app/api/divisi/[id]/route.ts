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
		const [dataCheck] = await db.query<RowDataPacket[]>('select id,nama from divisi where id=? order by nama asc',[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}		

		const [rows] = await db.execute<RowDataPacket[]>('DELETE from divisi where id=?',[id]);

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
			message : "Succes Delete Divisi",
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
		
		const {nama,aktif} = {
			nama : formData.get("nama") as string,
			aktif : formData.get("aktif") as string
		};
		const [dataCheck] = await db.query<RowDataPacket[]>('select id,nama from divisi where id=? order by nama asc',[id]);

		console.log(nama,aktif);
		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const [rows] = await db.execute<RowDataPacket[]>('UPDATE divisi set nama=?,is_active=? where id=?',[nama,aktif,id]);

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
		const [dataCheck] = await db.query<RowDataPacket[]>('select id,nama as nama,is_active as aktif from divisi where id=? order by nama asc',[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const result = {
			id : dataCheck[0].id,
			nama : dataCheck[0].nama,
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
