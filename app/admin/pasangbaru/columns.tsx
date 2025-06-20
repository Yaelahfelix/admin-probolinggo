"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable-header-column";
import Actions from "./actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// define data
export type WebUserDaftarPSB = {
  id: string;
  user_id: number;
  nama: string;
  alamat: string;
  no_hp: string;
  foto_tempat_url: string | null;
  latitude: number | null;
  longitude: number | null;
  flaghub: boolean;
  hub_at: string | null;
  hub_by: string | null;
  flagproses: boolean;
  proses_at: string | null;
  proses_by: string | null;
  created_at: string;
  updated_at: string;
  is_canceled: boolean;
  cancel_reason: string | null;
};

export const columns: ColumnDef<WebUserDaftarPSB>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
    accessorKey: "no_hp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor HP" />
    ),
  },
  {
    accessorKey: "hub_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dihubungi pada" />
    ),
    cell: ({ row }) =>
      row.original.hub_at
        ? format(new Date(row.original.hub_at), "d MMMM yyyy HH:mm:ss", {
            locale: id,
          })
        : "-",
  },
  {
    accessorKey: "hub_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dihubungi oleh" />
    ),
    cell: ({ row }) => row.original.hub_by || "-",
  },

  {
    accessorKey: "proses_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diproses pada" />
    ),
    cell: ({ row }) =>
      row.original.proses_at
        ? format(new Date(row.original.proses_at), "d MMMM yyyy HH:mm:ss", {
            locale: id,
          })
        : "-",
  },
  {
    accessorKey: "proses_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diproses oleh" />
    ),
    cell: ({ row }) => row.original.hub_by || "-",
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <Actions
          id={row.original.id}
          flaghub={row.original.flaghub}
          flagproses={row.original.flagproses}
        />
      </div>
    ),
  },
];
