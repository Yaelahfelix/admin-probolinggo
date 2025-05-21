"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable-header-column";
import Actions from "./actions";

// define data
export type AppConfig = {
  id: string;
  name: string;
};

export const columns: ColumnDef<AppConfig>[] = [
  {
    id: "index",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No." />
    ),
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) =>
      row.original.name === "profile"
        ? "Profile Perusahaan"
        : row.original.name,
  },
];
