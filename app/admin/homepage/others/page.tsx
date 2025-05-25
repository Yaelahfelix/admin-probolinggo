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
import DocumentHomepage from "./document";
import {
  DocumentHomepageType,
  WhatsappAdminType,
  YoutubeURLType,
} from "../type";
import YoutubeUrlForm from "./youtube";
import WhatsappAdminForm from "./whatsapp";

// export const metadata: Metadata = {
//   title: "Users",
// }
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function JenisPenyelesaian() {
  const {
    data: document,
    error: errorDocument,
    isLoading: isLoadingDocument,
  } = useSWR("/api/homepage/document", fetcher);

  const {
    data: whatsappAdmin,
    error: errorWhatsappAdmin,
    isLoading: isLoadingWhatsappAdmin,
  } = useSWR("/api/homepage/whatsapp_admin", fetcher);

  const {
    data: youtubeUrl,
    error: errorYoutubeUrl,
    isLoading: isLoadingYoutubeUrl,
  } = useSWR("/api/homepage/youtube_url", fetcher);

  if (errorDocument || errorWhatsappAdmin || errorYoutubeUrl)
    return (
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Document Public</CardTitle>
            <CardDescription>Document Public</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>
                {errorDocument || errorWhatsappAdmin || errorYoutubeUrl}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  if (isLoadingDocument || isLoadingWhatsappAdmin || isLoadingYoutubeUrl)
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
        <CardHeader className="py-4"></CardHeader>
        <CardContent>
          <DocumentHomepage data={document.data as DocumentHomepageType} />
          <YoutubeUrlForm data={youtubeUrl.data as YoutubeURLType} />
          <WhatsappAdminForm data={whatsappAdmin.data as WhatsappAdminType} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
