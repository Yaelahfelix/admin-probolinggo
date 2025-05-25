"use client";

import * as React from "react";
import {
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AudioWaveform,
  BookmarkCheck,
  BookOpen,
  Bot,
  Building2,
  Command,
  FolderCog,
  Frame,
  GalleryVerticalEnd,
  Map,
  NotebookTabs,
  NotepadText,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavMasterdata } from "@/components/nav-masterdata";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLaporan } from "./nav-laporan";
import { NavLainnya } from "./nav-lainnya";
import useAdminRole from "@/store/role";
import Image from "next/image";
import { NavWebKonfigurasi } from "./nav-webkonfigurasi";

const data = {
  teams: [
    {
      name: "Admin PDAM Probolinggo",
      Logo: (
        <Image src="/pudam-bayuangga.png" alt="logo" width={50} height={50} />
      ),
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      role: ["super_admin", "admin", "pegawai"],
    },
    {
      title: "Pengaduan",
      url: "/admin/pengaduan",
      icon: User,
      role: ["super_admin", "admin"],
    },
    {
      title: "Penugasan Aduan",
      url: "/admin/penugasan",
      icon: BookmarkCheck,
      role: ["super_admin", "admin"],
    },
    {
      title: "Pasang Baru",
      url: "/admin/pasangbaru",
      icon: BookmarkCheck,
      role: ["super_admin", "admin"],
    },
  ],

  masterdata: [
    {
      title: "Jenis Aduan",
      url: "/admin/jenis-aduan",
      icon: AlignEndVertical,
      role: ["super_admin", "admin"],
    },
    {
      title: "Jenis Penyelesaian",
      url: "/admin/jenis-penyelesaian",
      icon: AlignHorizontalDistributeCenter,
      role: ["super_admin", "admin"],
    },
    {
      title: "Divisi",
      url: "/admin/divisi",
      icon: UsersRound,
      role: ["super_admin", "admin"],
    },
    {
      title: "Petugas",
      url: "/admin/petugas",
      icon: UsersRound,
      role: ["super_admin", "admin"],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: User,
      role: ["super_admin", "admin"],
    },
  ],

  laporan: [
    {
      title: "Laporan Aduan",
      url: "/admin/lap-aduan",
      icon: NotepadText,
      role: ["super_admin", "admin", "pegawai"],
    },
    {
      title: "Rekapitulasi Aduan",
      url: "/admin/rekap-aduan",
      icon: NotebookTabs,
      role: ["super_admin", "admin", "pegawai"],
    },
  ],
  konfigurasiWeb: [
    {
      title: "Dokumen Publik",
      url: "/admin/document-public",
      icon: NotepadText,
      role: ["super_admin", "admin"],
    },
    {
      title: "Homepage - Partner",
      url: "/admin/homepage/partner",
      icon: Building2,
      role: ["super_admin", "admin"],
    },
    {
      title: "Homepage - Statistik",
      url: "/admin/homepage/statistic",
      icon: Settings2,
      role: ["super_admin", "admin"],
    },
    {
      title: "Homepage - Lainnya",
      url: "/admin/homepage/others",
      icon: FolderCog,
      role: ["super_admin", "admin"],
    },
  ],
  lainnya: [
    // {
    //   title: "Konfigurasi Tidham",
    //   url: "/admin/app-configuration",
    //   icon: SquareTerminal,
    // },
    {
      title: "Dashboard Blog & Informasi",
      url: "/studio",
      icon: SquareTerminal,
      role: ["super_admin", "admin"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAdminRole();
  console.log("terdeteksi role: ", role);
  console.log(data.navMain.filter((item) => item.role.includes(role)));
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.filter((item) => item.role.includes(role))}
        />
        <NavMasterdata
          items={data.masterdata.filter((item) => item.role.includes(role))}
        />
        <NavLaporan
          items={data.laporan.filter((item) => item.role.includes(role))}
        />
        <NavWebKonfigurasi
          items={data.konfigurasiWeb.filter((item) => item.role.includes(role))}
        />
        <NavLainnya
          items={data.lainnya.filter((item) => item.role.includes(role))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
