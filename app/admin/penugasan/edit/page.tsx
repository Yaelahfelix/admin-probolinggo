import { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDataSatu } from "@/lib/actions/penugasanAction"
import { notFound } from "next/navigation"
import { decrypt } from "@/lib/crypto"
import DataForm from "../data-form"
import { Fragment } from "react"

export const metadata: Metadata = {
  title: "Edit Jenis Aduan",
}

export default async function edit({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  
	const paramsId = await searchParams;
	const paramsIdValue = paramsId.id as string || "" 
	const id = decrypt(decodeURIComponent(paramsIdValue))
  const data = await getDataSatu(id)

	// console.log(data);
  if (data && !data.success) {
    notFound()
  }

  return (
    <Fragment>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Penugasan</CardTitle>
            <CardDescription>Edit Penugasan</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <DataForm penugasan={data.data} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </Fragment>
  )
}