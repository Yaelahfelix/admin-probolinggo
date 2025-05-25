"use client";
import { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Plus } from "lucide-react";
// import DashboardLayout from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import useSWR from "swr";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePartnerModal from "./modal";
import PartnerData from "./partnerData";

// export const metadata: Metadata = {
//   title: "Users",
// }
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function JenisPenyelesaian() {
  const { data, error, isLoading } = useSWR("/api/homepage/partner", fetcher);
  if (error)
    return (
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Homepage/Partner</CardTitle>
            <CardDescription>Homepage/Partner</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  if (isLoading)
    return (
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            {/* <CardTitle>Users</CardTitle>
				<CardDescription>Users Management</CardDescription> */}
          </CardHeader>
          <CardContent>
            {/* {!data.success && (
					<Alert variant="destructive" className="mb-5">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error Fetching Data</AlertTitle>
						<AlertDescription>{data.message}</AlertDescription>
					</Alert>
				)} */}
            {/* <Link href="/users/create" className="flex justify-end">
					<Button variant="default">
						<Plus className="w-4 h-4 mr-1" /> Create
					</Button>
				</Link> */}
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  return (
    <main className="flex flex-col gap-5 justify-center content-center p-5">
      <Card className="w-full">
        <CardHeader className="py-4 flex flex-row justify-between items-center">
          <h1 className="text-xl font-bold">Partner PDAM</h1>
          <CreatePartnerModal />
        </CardHeader>
        <CardContent>
          <PartnerData partners={data.data} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
