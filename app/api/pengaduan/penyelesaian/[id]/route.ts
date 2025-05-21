import db from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import  { RowDataPacket } from 'mysql2';
import { put } from '@vercel/blob';
import { getCurrentSession, getSessionOnServerSide } from "@/lib/session";
import moment from "moment";

const {
  BLOB_READ_WRITE_TOKEN
} = process.env;

export async function POST(request : NextRequest,{ params }: { params:  Promise<{ id: string }> }) {
	try {

		const { user } = await getCurrentSession();
		const param =  await params
		const id =  param.id	
    // const cookieStore = await cookies();
    // const token = cookieStore.get("session")?.value;
		if (user === null) {
			return NextResponse.json({
				success : false,
				message : 'Unauthorize'
			}, {status: 403})
		}
		
		const formData = await request.formData();
		const {tanggal,jenis_penyelesaian_id,ket_penyelesaian,foto_aduan} = {
			// tanggal : (formData.get("tanggal") as string).substring(0,10),
			tanggal : moment(formData.get("tanggal") as string).format("yyyy-MM-DD HH:mm:ss"),
			jenis_penyelesaian_id : formData.get("jenis_penyelesaian_id") as string,
			ket_penyelesaian : formData.get("ket_penyelesaian") as string,
			foto_aduan : formData.get("foto_aduan") as File || undefined 
		};


		let imageUrl = null;
		const myFile = foto_aduan

		if (myFile != null){
			const myfillename = id+'_selesai_'+myFile.name.replace(/ /g, "_");
			const blob = await put(myfillename,myFile,{access : 'public', token : BLOB_READ_WRITE_TOKEN})
			imageUrl = blob.url;
		}

		const [rows] = await db.execute<RowDataPacket[]>('update web_aduan set is_complete=1,completed_at=?,jenis_penyelesaian_id=?,ket_penyelesaian=?,url_foto_penyelesaian=?,updated_at=now() where id=?',
			[tanggal,jenis_penyelesaian_id,ket_penyelesaian,imageUrl,id]);


		// const hashedPassword = bcrypt.hashSync(password, 10)
		// const [rows] = await db.execute<RowDataPacket[]>('Insert into petugas (nama,role,no_telp,divisi_id,username,password,is_active) values (?,?,?,?,?,?,?)',
		// 	[nama,role,no_telp,divisi_id,username,hashedPassword,aktif]);

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
			message : "Succes Post Data",
			data : result
		}, {status: 200});			
		// return NextResponse.json({
		// 	success : false,
		// 	message : "No Record Affected"
		// },
		// {
		// 	status: 422
		// })			
	} catch (error) {
		console.log(error);
		return NextResponse.json(error)	
	}




}