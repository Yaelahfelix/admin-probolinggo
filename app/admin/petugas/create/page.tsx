import { Metadata } from "next"

import { Fragment } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DataForm from "../data-form"

export const metadata: Metadata = {
  title: "Create Petugas",
}

export default async function create() {
  return (
		<Fragment>

      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Petugas</CardTitle>
            <CardDescription>Create Petugas</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <DataForm />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </Fragment>
  )
}


