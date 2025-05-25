"use client";

import {
  type LucideIcon,
  SquareTerminal,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  User,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  TableColumnsSplit,
} from "lucide-react";
import React, { createContext, useContext } from "react";

// import { getUser } from "./auth-actions";

interface objMenu {
  title: string;
  icon?: LucideIcon;
  items: Tbreadcrumb[];
}

interface Tbreadcrumb {
  title: string;
  url: string;
  ismenu: boolean;
  id: number;
}

const pageNames: { [key: string]: objMenu } = {
  "/admin": {
    title: "Dashboard",
    icon: SquareTerminal,
    items: [{ title: "Dashboard", url: "/admin", ismenu: true, id: 4 }],
  },
  "/admin/users": {
    title: "Users",
    icon: User,
    items: [{ title: "Users", url: "/admin/users", ismenu: true, id: 3 }],
  },
  "/admin/users/create": {
    title: "Create Users",
    items: [
      { title: "Users", url: "/admin/users", ismenu: false, id: 1 },
      { title: "create", url: "/admin/users/create", ismenu: true, id: 2 },
    ],
  },
  "/admin/users/edit": {
    title: "Edit Users",
    items: [
      { title: "Users", url: "/admin/users", ismenu: false, id: 1 },
      { title: "Edit", url: "/admin/users/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/jenis-aduan": {
    title: "Jenis Aduan",
    icon: AlignEndVertical,
    items: [
      { title: "Jenis Aduan", url: "/admin/jenis-aduan", ismenu: true, id: 3 },
    ],
  },
  "/admin/jenis-aduan/create": {
    title: "Create Jenis Aduan",
    items: [
      { title: "Jenis Aduan", url: "/admin/jenis-aduan", ismenu: false, id: 1 },
      {
        title: "create",
        url: "/admin/jenis-aduan/create",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/jenis-aduan/edit": {
    title: "Edit jenis-aduan",
    items: [
      { title: "Jenis Aduan", url: "/admin/jenis-aduan", ismenu: false, id: 1 },
      { title: "Edit", url: "/admin/jenis-aduan/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/jenis-penyelesaian": {
    title: "Jenis Penyelesaian",
    icon: AlignHorizontalDistributeCenter,
    items: [
      {
        title: "Jenis Penyelesaian",
        url: "/admin/jenis-penyelesaian",
        ismenu: true,
        id: 3,
      },
    ],
  },
  "/admin/jenis-penyelesaian/create": {
    title: "Create Jenis Penyelesaian",
    items: [
      {
        title: "Jenis Penyelesaian",
        url: "/admin/jenis-penyelesaian",
        ismenu: false,
        id: 1,
      },
      {
        title: "create",
        url: "/admin/jenis-penyelesaian/create",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/jenis-penyelesaian/edit": {
    title: "Edit jenis-Penyelesaian",
    items: [
      {
        title: "Jenis Penyelesaian",
        url: "/admin/jenis-penyelesaian",
        ismenu: false,
        id: 1,
      },
      {
        title: "Edit",
        url: "/admin/jenis-penyelesaian/edit",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/divisi": {
    title: "Divisi",
    icon: TableColumnsSplit,
    items: [{ title: "Divisi", url: "/admin/divisi", ismenu: true, id: 3 }],
  },
  "/admin/divisi/create": {
    title: "Create Divisi",
    items: [
      { title: "Divisi", url: "/admin/divisi", ismenu: false, id: 1 },
      { title: "Create", url: "/admin/divisi/create", ismenu: true, id: 2 },
    ],
  },
  "/admin/divisi/edit": {
    title: "Edit Divisi",
    items: [
      { title: "Divisi", url: "/admin/divisi", ismenu: false, id: 1 },
      { title: "Edit", url: "/admin/divisi/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/petugas": {
    title: "Petugas",
    icon: AlignHorizontalDistributeCenter,
    items: [{ title: "Petugas", url: "/admin/petugas", ismenu: true, id: 3 }],
  },
  "/admin/petugas/create": {
    title: "Create Petugas",
    items: [
      { title: "Petugas", url: "/admin/petugas", ismenu: false, id: 1 },
      { title: "Create", url: "/admin/petugas/create", ismenu: true, id: 2 },
    ],
  },
  "/admin/petugas/edit": {
    title: "Edit Petugas",
    items: [
      { title: "Petugas", url: "/admin/petugas", ismenu: false, id: 1 },
      { title: "Edit", url: "/admin/petugas/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/pengaduan": {
    title: "Pengaduan",
    icon: AlignHorizontalDistributeCenter,
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: true, id: 3 },
    ],
  },
  "/admin/pengaduan/create": {
    title: "Create Pengaduan",
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: false, id: 1 },
      { title: "Create", url: "/admin/pengaduan/create", ismenu: true, id: 2 },
    ],
  },
  "/admin/pengaduan/edit": {
    title: "Edit Pengaduan",
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: false, id: 1 },
      { title: "Edit", url: "/admin/pengaduan/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/pengaduan/cetak": {
    title: "Cetak Pengaduan",
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: false, id: 1 },
      { title: "cetak", url: "/admin/pengaduan/cetak", ismenu: true, id: 2 },
    ],
  },
  "/admin/pengaduan/detail": {
    title: "Detail Pengaduan",
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: false, id: 1 },
      { title: "Detail", url: "/admin/pengaduan/detail", ismenu: true, id: 2 },
    ],
  },
  "/admin/pengaduan/selesai": {
    title: "Selesaikan Pengaduan",
    items: [
      { title: "Pengaduan", url: "/admin/pengaduan", ismenu: false, id: 1 },
      {
        title: "Selesaikan",
        url: "/admin/pengaduan/selesai",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/penugasan": {
    title: "Penugasan Aduan",
    icon: AlignHorizontalDistributeCenter,
    items: [
      {
        title: "Penugasan Aduan",
        url: "/admin/penugasan",
        ismenu: true,
        id: 3,
      },
    ],
  },
  "/admin/penugasan/create": {
    title: "Create Penugasan Aduan",
    items: [
      {
        title: "Penugasan Aduan",
        url: "/admin/penugasan",
        ismenu: false,
        id: 1,
      },
      { title: "Create", url: "/admin/penugasan/create", ismenu: true, id: 2 },
    ],
  },
  "/admin/penugasan/edit": {
    title: "Edit Penugasan Aduan",
    items: [
      {
        title: "Penugasan Aduan",
        url: "/admin/penugasan",
        ismenu: false,
        id: 1,
      },
      { title: "Edit", url: "/admin/penugasan/edit", ismenu: true, id: 2 },
    ],
  },
  "/admin/penugasan/cetak": {
    title: "Cetak Penugasan Aduan",
    items: [
      {
        title: "Penugasan Aduan",
        url: "/admin/penugasan",
        ismenu: false,
        id: 1,
      },
      { title: "Cetak", url: "/admin/penugasan/cetak", ismenu: true, id: 2 },
    ],
  },
  "/admin/pasangbaru": {
    title: "Pasang Baru",
    items: [
      {
        title: "Pasang Baru",
        url: "/admin/pasangbaru",
        ismenu: true,
        id: 1,
      },
    ],
  },
  "/admin/pasangbaru/detail": {
    title: "Detail Pasang Baru",
    items: [
      {
        title: "Pasang Baru",
        url: "/admin/pasangbaru",
        ismenu: false,
        id: 1,
      },
      {
        title: "Detail",
        url: "/admin/pasangbaru/detail",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/pasangbaru/proses": {
    title: "Proses Pasang Baru",
    items: [
      {
        title: "Pasang Baru",
        url: "/admin/pasangbaru",
        ismenu: false,
        id: 1,
      },
      {
        title: "Proses Pasang Baru",
        url: "/admin/pasangbaru/proses",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/pasangbaru/hubungi": {
    title: "Hubungi Pasang Baru",
    items: [
      {
        title: "Pasang Baru",
        url: "/admin/pasangbaru",
        ismenu: false,
        id: 1,
      },
      {
        title: "Hubungi Pasang Baru",
        url: "/admin/pasangbaru/proses",
        ismenu: true,
        id: 2,
      },
    ],
  },
  "/admin/app-configuration": {
    title: "Konfigurasi Aplikasi",
    items: [
      {
        title: "Konfigurasi Aplikasi",
        url: "/admin/app-configutration",
        ismenu: true,
        id: 1,
      },
    ],
  },
  "/admin/app-configuration/profile": {
    title: "Edit Profile Perusahaan",
    items: [
      {
        title: "Konfigurasi Aplikasi",
        url: "/admin/app-configutration",
        ismenu: false,
        id: 1,
      },
      {
        title: "Edit Profile Perusahaan",
        url: "/admin/app-configutration/profile",
        ismenu: true,
        id: 1,
      },
    ],
  },
  "/admin/lap-aduan": {
    title: "Laporan Pengaduan",
    items: [
      {
        title: "Lap Aduan",
        url: "/admin/lap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },
  "/admin/rekap-aduan": {
    title: "Rekapitulasi Aduan",
    items: [
      {
        title: "Rekapitulasi Aduan",
        url: "/admin/rekap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },

  "/admin/document-public": {
    title: "Dokumen Publik",
    items: [
      {
        title: "Dokumen Publik",
        url: "/admin/rekap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },

  "/admin/homepage/statistic": {
    title: "Homepage - Statistik",
    items: [
      {
        title: "Statistik",
        url: "/admin/rekap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },

  "/admin/homepage/partner": {
    title: "Homepage - Partner",
    items: [
      {
        title: "Partner",
        url: "/admin/rekap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },

  "/admin/homepage/others": {
    title: "Lainnya",
    items: [
      {
        title: "Lainnya",
        url: "/admin/rekap-aduan",
        ismenu: true,
        id: 1,
      },
    ],
  },
};
export const MenuUserContext = createContext(pageNames);

export function MenuUserProvider({ children }: { children: React.ReactNode }) {
  return (
    <MenuUserContext.Provider value={pageNames}>
      {children}
    </MenuUserContext.Provider>
  );
}
