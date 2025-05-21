import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import DataForm from "./data-form";
import { Fragment } from "react";
import { getProfile } from "@/lib/actions/appConfigurationAction";

export const metadata: Metadata = {
  title: "Edit Profile Perusahaan",
};

export default async function edit({}: {}) {
  const data = await getProfile();

  console.log(data);
  if (data && !data.success) {
    notFound();
  }

  return (
    <Fragment>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Profile Perusahaan</CardTitle>
            <CardDescription>
              Edit Profile Perusahaan untuk Aplikasi Tidham yang akan di
              tampilakan di menu Profile pada aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <DataForm profile={data.data[0].data} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </Fragment>
  );
}
