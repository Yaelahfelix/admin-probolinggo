"use client"
import { Metadata } from "next"
import Link from "next/link"
import { AlertCircle, Plus } from "lucide-react"
// import DashboardLayout from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import useSWR from 'swr' 
import axios from 'axios'
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import useFetch from "@/hooks/useFetch"
import moment from 'moment';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
// export const metadata: Metadata = {
//   title: "Users",
// }
// const fetcher  = (url : any) => axios.get(url).then(res => res.data)


const periodeFilter = () => {

	let periodefilter = []
	for(let i = 0; i < 10; i++){
		const format = moment().add(i*-1, "month").format('MMMM yyyy');
		const formatvalue = moment().add(i*-1, "month").format('yyyyMM');
		const valPush = {
			val : formatvalue,
			text : format,
		}

		periodefilter.push(valPush)
	}
	return periodefilter;
} 

export default function Pengaduan() {
	const [periode , setPeriode]  = useState(moment().format('yyyyMM'));
	const [status , setStatus]  = useState('-1');
  const [ pengaduanFilter, setPengaduanFilter ] = useState({ status:  status , periode : periode });
  const { data: UserData, isLoading: UserLoading, isError: UserError, mutate: UserMutate } = useFetch('/api/pengaduan', pengaduanFilter)
  console.log(periodeFilter(), 'pengaduan render')
	if (UserError) return (
		<main className="flex flex-col gap-5 justify-center content-center p-5">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Pengaduan</CardTitle>
					<CardDescription>Pengaduan</CardDescription>
				</CardHeader>
				<CardContent>
						<Alert variant="destructive" className="mb-5">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error Fetching Data</AlertTitle>
							<AlertDescription>{UserError}</AlertDescription>
						</Alert>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</main>
	);
	if (UserLoading) return (
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
	)
  return (
		

		// <ResizablePanel defaultSize={25}>
		// 	<div className="flex h-full items-center justify-center p-6">
		// 		<span className="font-semibold">Sidebar</span>
		// 	</div>
		// </ResizablePanel>
		// <ResizableHandle withHandle />
		// <ResizablePanel defaultSize={75}>
		// 	<div className="flex h-full items-center justify-center p-6">
		// 		<span className="font-semibold">Content</span>
		// 	</div>
		// </ResizablePanel>

      <main className="flex flex-col gap-5 justify-center content-center p-5">
				<Card className="w-full">
				<ResizablePanelGroup
						direction="horizontal"
						className="w-full"
						// className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
					>
				<ResizablePanel defaultSize={75}>
				
						<CardHeader className="py-4">
						<div className="flex justify-between">
							<div className="items-start">
						
							</div>
							<Link href="/admin/pengaduan/create" className="flex justify-end">
									<Button variant="default" className="w-32">
										<Plus className="w-4 h-4 mr-1" /> Create
									</Button>
							</Link>
						</div>
				
						</CardHeader>
						<CardContent>
							<DataTable columns={columns} data={UserData.data ?? []} />
						</CardContent>
						<CardFooter></CardFooter>
		
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={25}>
					<Card className="w-full h-full">
						<CardHeader>
							<CardTitle>Filter & Pencarian Data</CardTitle>
							<CardDescription>Data Pengaduan</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col p-6 gap-4">
							<div className="flex w-full justify-start gap-4">
										<Label className="flex place-items-center w-20">Periode</Label>
										{/* <div className="relative w-55"> */}
                      <Select  onValueChange={(e) => { setPeriode(e.valueOf()) 
																					setPengaduanFilter({...pengaduanFilter,periode : e.valueOf()})
											}} value={periode} defaultValue={periode} >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={moment().format('MMMM yyyy')} />
                      </SelectTrigger>
                      <SelectContent>
												{
													periodeFilter().map((item)=>(
														<SelectItem key={item.val} value={item.val}>{item.text}</SelectItem>
													))
												}
                      </SelectContent>
                    </Select>
                  {/* </div> */}
							</div>
							<div className="flex w-full justify-start gap-4">
										<Label className="flex place-items-center w-20">Status</Label>
										<div className="relative">
                      <Select  onValueChange={(e) => { setStatus(e.valueOf())
												setPengaduanFilter({...pengaduanFilter,status : e.valueOf()})

											}} defaultValue={status} >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={"0"} />
                      </SelectTrigger>
                      <SelectContent>
													<SelectItem value="-1">All</SelectItem>
                          <SelectItem value="0">Unprosses</SelectItem>
                          <SelectItem value="1">Processed</SelectItem>
                          <SelectItem value="2">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
							</div>
						</CardContent>
						<CardFooter></CardFooter>
					</Card>
					</ResizablePanel>
				</ResizablePanelGroup>
				</Card>
      </main>
  )
}