"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable-header-column";
import Actions from "./actions";
import { LapAduan } from "@/types/lap-aduan";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { format } from "date-fns";

export const columns: ColumnDef<LapAduan>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "nomor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No Aduan" />
    ),
  },
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tgl Aduan" />
    ),
    cell: ({ row }) => format(new Date(row.original.tanggal), "dd MMM yyyy"),
  },
  {
    accessorKey: "jenis_nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Aduan" />
    ),
  },
  {
    accessorKey: "no_pelanggan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No Pelanggan" />
    ),
    cell: ({ row }) =>
      row.original.no_pelanggan ? row.original.no_pelanggan : "NON PELANGGAN",
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
  },
  {
    accessorKey: "alamat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),
  },
  {
    accessorKey: "is_complete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div
        className={clsx(
          "border px-3 py-1.5 text-center text-xs rounded-lg shadow font-bold",
          row.original.is_complete
            ? "bg-green-300 border-green-900 text-green-900"
            : "bg-red-300 border-red-900 text-red-900"
        )}
      >
        {row.original.is_complete ? "Sudah Selesai" : "Belum Selesai"}
      </div>
    ),
  },
  {
    accessorKey: "completed_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tgl Penyelesaian" />
    ),
    cell: ({ row }) =>
      row.original.completed_at
        ? format(new Date(row.original.completed_at), "dd MMM yyyy")
        : "-",
  },
];
