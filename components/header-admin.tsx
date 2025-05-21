"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import React, { Fragment, useContext } from "react";
import { MenuUserContext } from "@/providers/menuuser-context";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/mode-toggle";

export default function AppHeaderAdmin() {
  const dataMenu = useContext(MenuUserContext);
  const pathname = usePathname();
  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="block md:hidden">
              <BreadcrumbPage>{dataMenu[pathname].title}</BreadcrumbPage>
            </BreadcrumbItem>
            {dataMenu[pathname].items.map((val) =>
              val.ismenu ? (
                <BreadcrumbItem key={`1${val.id}`} className="hidden md:block">
                  <BreadcrumbPage key={`2${val.id}`}>
                    {val.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <Fragment key={`sperator${val.url}`}>
                  <BreadcrumbItem
                    key={`4${val.id}`}
                    className="hidden md:block"
                  >
                    <BreadcrumbLink key={`3${val.id}`} href={val.url}>
                      {val.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator
                    key={`sperator${val.url}`}
                    className="hidden md:block"
                  />
                </Fragment>
              )
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pr-5">
        <ModeToggle />
      </div>
    </header>
  );
}
