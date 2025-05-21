"use client";

import * as React from "react";
import {
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AudioWaveform,
  BookmarkCheck,
  BookOpen,
  Bot,
  Command,
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
    },
    {
      title: "Jenis Penyelesaian",
      url: "/admin/jenis-penyelesaian",
      icon: AlignHorizontalDistributeCenter,
    },
    {
      title: "Divisi",
      url: "/admin/divisi",
      icon: UsersRound,
    },
    {
      title: "Petugas",
      url: "/admin/petugas",
      icon: UsersRound,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: User,
    },
  ],

  laporan: [
    {
      title: "Laporan Aduan",
      url: "/admin/lap-aduan",
      icon: NotepadText,
    },
    {
      title: "Rekapitulasi Aduan",
      url: "/admin/rekap-aduan",
      icon: NotebookTabs,
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
        <NavMasterdata items={data.masterdata} />
        <NavLaporan items={data.laporan} />
        <NavLainnya items={data.lainnya} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
