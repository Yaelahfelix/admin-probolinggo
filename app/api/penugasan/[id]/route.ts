import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import { getCurrentSession } from "@/lib/session";

import moment from "moment";

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

		const [aduanCekRes] = await db.query<RowDataPacket[]>(`select a.id as aduanid,a.processed_number,a.processed_at from web_aduan a where a.processed_number=?`,[id]);
		if (aduanCekRes.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataAduanNotexist"
			},{status: 422})	
		}

		const [rows] = await db.execute<RowDataPacket[]>(`UPDATE web_aduan a SET is_processed=0,processed_at=NULL, processed_by_id=NULL,processed_number=NULL,processed_to_divisi_id=NULL WHERE a.processed_number=? `,
			[id]);

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
			message : "Succes Delete Penugasan",
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

    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
	
		const param =  await params
		const id =  param.id	
		console.log(id);
		const formData = await request.formData();

		const {aduan_id,divisi_id} = {
			divisi_id : formData.get("divisi_id") as string,
			aduan_id : formData.getAll("aduan_id[]")
		};



		const [aduanCekRes] = await db.query<RowDataPacket[]>(`select a.id as aduanid,a.processed_number,a.processed_at from web_aduan a where a.processed_number=?`,[id]);
		if (aduanCekRes.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataAduanNotexist"
			},{status: 422})	
		}

		const tanggaledit = moment(aduanCekRes[0].processed_at).format("YYYY-MM-DD HH:mm:ss");
		// console.log(tanggaledit)
		// 	return NextResponse.json({
		// 	success : false,
		// 	message : "No Record Affected"
		// },
		// {
		// 	status: 422
		// })	


		const [rows] = await db.execute<RowDataPacket[]>(`UPDATE web_aduan a SET is_processed=0,processed_at=NULL, processed_by_id=NULL,processed_number=NULL,processed_to_divisi_id=NULL WHERE a.processed_number=? `,
			[id]);


		const result : any = rows;
		console.log(result)
		if (result.affectedRows === 0) {
			return NextResponse.json({
				success : false,
				message : "No Record Affected"
			},
			{
				status: 422
			})				
		} else {
			const [rows1] = await db.execute<RowDataPacket[]>(`UPDATE web_aduan a SET is_processed=1,processed_at=?, processed_by_id=?,processed_number=?,processed_to_divisi_id=? WHERE a.id IN (${aduan_id.toString()}) `,
				[tanggaledit,user.id,id,divisi_id]);
				const result1 : any = rows1;
				console.log(result1)
				if (result1.affectedRows === 0) {
					return NextResponse.json({
						success : false,
						message : "No Record Affected On Update Last"
					},
					{
						status: 422
					})	
			}
		}

		return NextResponse.json({
			success : true,
			message : "Succes Edit Penugasan",
			data : result
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
		const [divisi] = await db.query<RowDataPacket[]>(`select a.processed_to_divisi_id as divisiid from web_aduan a where a.processed_number=?`,[id]);

		if (divisi.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const [aduanId] = await db.query<RowDataPacket[]>(`select a.id as aduanid from web_aduan a where a.processed_number=?`,[id]);

		if (aduanId.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataAduanNotexist"
			},{status: 422})	
		}

		const aduanIdresult = aduanId.map((val)=>{
			return val.aduanid.toString()
		})

		const result = {
			id : id,
			divisi_id : divisi[0].divisiid,
			aduan_id : aduanIdresult
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
