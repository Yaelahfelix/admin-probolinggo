"use client";

import React, { ReactNode, useEffect } from "react";
import { Fragment } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppHeaderAdmin from "@/components/header-admin";
import { usePathname } from "next/navigation";
import { User } from "@/lib/session";
import useAdminRole from "@/store/role";

type Props = { children: ReactNode; user: User };

function AdminLayout({ children, user }: Props) {
  const pathname = usePathname();
  const { setRole } = useAdminRole();

  useEffect(() => {
    setRole(user.role);
  }, []);
  return (
    <Fragment>
      {/* <MenuUserProvider> */}
      {}
      {!pathname.startsWith("/admin/blog") ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeaderAdmin />
            {children}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        children
      )}
      {/* </MenuUserProvider>     */}
    </Fragment>
  );
}

export default AdminLayout;
