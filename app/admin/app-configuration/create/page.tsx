import { Metadata } from "next";

import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataForm from "../profile/data-form";

export const metadata: Metadata = {
  title: "Create Divisi",
};

export default async function create() {
  return (
    <Fragment>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Divisi</CardTitle>
            <CardDescription>Create Divisi</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <DataForm />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </Fragment>
  );
}
