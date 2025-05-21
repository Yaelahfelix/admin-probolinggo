"use client";

import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataForm from "./proses_form";
import { useRouter, useSearchParams } from "next/navigation";

export default function create() {
  const params = useSearchParams();
  const id = params.get("id");
  const Router = useRouter();
  if (!id) {
    return Router.back();
  }
  return (
    <Fragment>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Proses Pendaftaran Pasang Baru</CardTitle>
            <CardDescription>Proses pendaftaran pasang baru</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <DataForm id={id} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </Fragment>
  );
}
