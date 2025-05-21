"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/datatable-header-column"
import Actions from "./actions"

import Image from 'next/image'
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import ZoomableImage from "@/hooks/zoomable-image"
import { ScanEye } from "lucide-react"
import moment from "moment"
// import { convertStatusAduan,converUrlFotoAduan } from "@/lib/utils";

// define data
export type Pengaduan = {
  id: string,
  tanggal : Date,
  nomor : string,
	nama: string,
  alamat : string,
  no_pelanggan : string | null,
  jenis_aduan_id : string,
  jenis_aduan : string,
  ket_aduan : string,
  url_foto_aduan : string | null,
  no_hp : string,
	status_aduan : string,
}

export const convertStatusAduan = (sts : string) => {
  console.log(sts)
  if (sts == '1') {
    return {
      warna : 'bg-amber-500',
      value : 'Processed'
    }
  } else if (sts == '2') {
    return {
      warna : 'bg-green-500',
      value : 'Completed'
    }
  } else {
    return {
      warna : 'bg-red-500',
      value : 'Unprosses'
    }
  }
}
const urlDefaultImage : string  = process.env.NEXT_PUBLIC_URL_NO_IMAGE || "#";

export const converUrlFotoAduan = (url : string | null) => {
  if (url == null){
    return urlDefaultImage
  }
  return url
} 



export const columns: ColumnDef<Pengaduan>[] = [
  {
    id: "index",
    size : 45,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "status_aduan",
    size : 50,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className={`flex w-20 text-center justify-center place-items-center rounded-lg h-6 ${convertStatusAduan(row.original.status_aduan).warna}`}>
        {convertStatusAduan(row.original.status_aduan).value}
      </div>
    ),
  },
  {
    accessorKey: "tanggal",
    size : 75,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => <div className="text-start">{moment(row.original.tanggal).format('YYYY-MM-DD')}</div>,
  },
  {
    accessorKey: "nomor",
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Aduan"  className="justify-start text-start"/>
    ),
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => <div className="text-start">{`${row.original.no_pelanggan || "NON PEL"} - ${row.original.nama}`}</div>,
  },
  {
    accessorKey: "alamat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="alamat" />
    ),
  },
  {
    accessorKey: "jenis_aduan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Aduan" />
    ),
  },
  {
    accessorKey: "url_foto_aduan",
    size : 25,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Foto" className="px-0"/>
    ),
    cell : ({ row })=> (
      <div className="w-[25px] h-[10px]">
      <AspectRatio ratio={16 / 10}>
        <ZoomableImage src={converUrlFotoAduan(row.original.url_foto_aduan)} alt="Foto Aduan" className="cursor-pointer" /> 
      </AspectRatio>
    </div>
    )
  },

  {
    id: "action",
    size : 75,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      
      // <div className="text-center flex flex-row m-auto ">
      //   {/* <ScanEye size={20} className="w-8 mt-1 p-0 cursor-pointer"/> */}
        <Actions id={row.original.id} disable={row.original.status_aduan != "0" ? true : false} />
      // </div>
    ),
  },
]