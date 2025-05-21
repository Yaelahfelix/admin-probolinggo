import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import { cookies } from "next/headers";
const {
  BLOB_READ_WRITE_TOKEN
} = process.env;
import { put, del } from '@vercel/blob';
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
		const [dataCheck] = await db.query<RowDataPacket[]>(`select a.id,a.nomor,a.tanggal,a.sumber_laporan,
			a.no_pelanggan,a.jenis_aduan_id,b.nama as jenis_aduan,
			a.nama,a.no_hp,a.alamat,a.ket_aduan,a.url_foto_aduan,a.is_processed+a.is_complete status_aduan from web_aduan a inner join jenis_aduan b on a.jenis_aduan_id=b.id where a.id=? order by tanggal desc,id desc`,[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		if(dataCheck[0].url_foto_aduan != null){
			await del(dataCheck[0].url_foto_aduan,{token : BLOB_READ_WRITE_TOKEN})
		}

		const [rows] = await db.execute<RowDataPacket[]>('DELETE from web_aduan where id=?',[id]);

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
			message : "Succes Delete Pengaduan",
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
		console.log(formData)
		const {tanggal,sumber_laporan,no_pelanggan,nama,alamat,no_hp,jenis_aduan_id,ket_aduan,foto_aduan,nomor} = {
			// tanggal :  (formData.get("tanggal") as string).substring(0,10),
			tanggal : moment(formData.get("tanggal") as string).format("YYYY-MM-DD"),
			nama : formData.get("nama") as string,
			alamat : formData.get("alamat") as string,
			no_pelanggan : formData.get("no_pelanggan") as string || undefined,
			jenis_aduan_id : formData.get("jenis_aduan_id") as string,
			sumber_laporan : formData.get("sumber_laporan") as string,
			no_hp : formData.get("no_hp") as string,
			ket_aduan : formData.get("ket_aduan") as string,
			foto_aduan : formData.get("foto_aduan") as File || undefined,
			nomor : formData.get("nomor") as string,
		};

		console.log({tanggal,sumber_laporan,no_pelanggan,nama,alamat,no_hp,jenis_aduan_id,ket_aduan,foto_aduan})

		const [dataCheck] = await db.query<RowDataPacket[]>(`select a.id,a.nomor,a.tanggal,a.sumber_laporan,
			a.no_pelanggan,a.jenis_aduan_id,b.nama as jenis_aduan,
			a.nama,a.no_hp,a.alamat,a.ket_aduan,a.url_foto_aduan,a.is_processed+a.is_complete status_aduan from web_aduan a inner join jenis_aduan b on a.jenis_aduan_id=b.id where a.id=? order by tanggal desc,id desc`,[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		let imageUrl = null;
		const myFile = foto_aduan
		let no_pelIns = null
		if (no_pelanggan != null) {
			no_pelIns = no_pelanggan;
		}


		if (myFile != null){
			const myfillename = dataCheck[0].nomor+'_'+myFile.name.replace(/ /g, "_");
			if(dataCheck[0].url_foto_aduan != null){
				await del(dataCheck[0].url_foto_aduan,{token : BLOB_READ_WRITE_TOKEN})
			}
			const blob = await put(myfillename,myFile,{access : 'public', token : BLOB_READ_WRITE_TOKEN})
			imageUrl = blob.url;
		}

		const [rows] = await db.execute<RowDataPacket[]>('update web_aduan set tanggal=?,user_admin_id=?,no_pelanggan=?,jenis_aduan_id=?,nama=?,alamat=?,no_hp=?,ket_aduan=?,url_foto_aduan=?,sumber_laporan=? where id=?',
			[tanggal,user.id,no_pelIns,jenis_aduan_id,nama,alamat,no_hp,ket_aduan,imageUrl,sumber_laporan,id]);


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
		const [dataCheck] = await db.query<RowDataPacket[]>(`select a.id,a.nomor,a.tanggal,a.sumber_laporan,
			a.no_pelanggan,a.jenis_aduan_id,b.nama as jenis_aduan,
			a.nama,a.no_hp,a.alamat,a.ket_aduan,a.url_foto_aduan,a.is_processed+a.is_complete status_aduan from web_aduan a inner join jenis_aduan b on a.jenis_aduan_id=b.id where a.id=? order by tanggal desc,id desc`,[id]);

		if (dataCheck.length === 0 ) {
			return NextResponse.json({
				success : false,
				message : "dataNotexist"
			},{status: 422})	
		}

		const result = {
			id : dataCheck[0].id,
			nama : dataCheck[0].nama,
			tanggal : dataCheck[0].tanggal,
			sumber_laporan : dataCheck[0].sumber_laporan,
			no_pelanggan : dataCheck[0].no_pelanggan,
			jenis_aduan_id : dataCheck[0].jenis_aduan_id,
			nomor : dataCheck[0].nomor,
			no_hp : dataCheck[0].no_hp,
			alamat : dataCheck[0].alamat,
			ket_aduan : dataCheck[0].ket_aduan
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
