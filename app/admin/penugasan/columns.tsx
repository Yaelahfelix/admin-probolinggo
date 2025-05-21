"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/datatable-header-column"
import Actions from "./actions"


import moment from "moment"

export type Penugasan = {
  id: string,
  tgl_penugasan : Date,
  nomor : string,
  nomor_aduan : string,
	nama: string,
  divisi_id : string,
  divisi : string,
  iscomplete : string,
}

const convertStatusAduan = (sts : string) => {
  console.log(sts)
  if (sts != '0') {
    return {
      warna : 'bg-green-500',
      value : 'Processed'
    }
  } else {
    return {
      warna : 'bg-red-500',
      value : 'Unprosses'
    }
  }
}

export const columns: ColumnDef<Penugasan>[] = [
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
    accessorKey: "iscomplete",
    size : 50,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className={`flex w-20 text-center justify-center place-items-center rounded-lg h-6 ${convertStatusAduan(row.original.iscomplete).warna}`}>
        {convertStatusAduan(row.original.iscomplete).value}
      </div>
    ),
  },
  {
    accessorKey: "tgl_penugasan",
    size : 75,
    enableResizing : false,
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => <div className="text-start">{moment(row.original.tgl_penugasan).format('YYYY-MM-DD')}</div>,
  },
  {
    accessorKey: "nomor",
    enableSorting : false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Penugasan"  className="justify-start text-start"/>
    ),
  },
  {
    accessorKey: "nomor_aduan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor Aduan" />
    ),
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Pengadu" />
    ),
  },
  {
    accessorKey: "divisi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ditugaskan Ke" />
    ),
  },
  {
    id: "action",
    size : 75,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      
      // <div className="text-center flex flex-row m-auto justify-center place-content-center">
        <Actions id={row.original.id} disable={row.original.iscomplete != "0" ? true : false} />
      // </div>
    ),
  },
]