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
import { getUsers } from "@/lib/actions/usersAction";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import useSWR, { Fetcher } from "swr";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { DatePickerWithRange } from "@/components/daterange-picker";
import { format } from "date-fns";
import { LapAduan } from "@/types/lap-aduan";
import PDFReport from "./pdfPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StringComponents } from "sanity";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import { FormLabel } from "@/components/ui/form";
import { RekapAduan } from "@/types/rekap-aduan";

// export const metadata: Metadata = {
//   title: "Users",
// }
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function Users() {
  const [tgl, setTgl] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RekapAduan[] | null>(null);
  const [error, setError] = useState(null);
  const [dataPDF, setDataPDF] = useState({ tgl: "", jenis: "" });
  const [filter, setFilter] = useState("");

  const searchingHandler = async () => {
    if (!tgl.from || !tgl.to) {
      return toast({ title: "Tanggal wajib diisi", variant: "destructive" });
    }

    if (!filter || filter === "") {
      return toast({
        title: "Jenis rekapitulasi wajib diisi",
        variant: "destructive",
      });
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/rekapitulasi-aduan?fromDate=${format(tgl.from, "yyyy-MM-dd")}&toDate=${format(tgl.to, "yyyy-MM-dd")}&filterBy=${filter}`
      );

      if (!res.ok) throw new Error("Gagal mengambil data");

      const result = await res.json();
      console.log(result);
      setData(result.data);
      setDataPDF({ tgl: result.tanggal, jenis: result.jenis });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (error)
    return (
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lap Aduan</CardTitle>
            <CardDescription>Lap Aduan Management</CardDescription>
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
  return (
    <main className="flex flex-col gap-5 justify-center content-center p-5">
      <div className="flex justify-between">
        <div className="flex gap-5 ">
          <DatePickerWithRange date={tgl} setDate={setTgl} />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Jenis Rekapitulasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"jenisAduan"}>Jenis Aduan</SelectItem>
                <SelectItem value={"jenisPenyelesaian"}>
                  Jenis Penyelesaian
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={searchingHandler}>Cari Aduan</Button>
        </div>
      </div>
      {isLoading ? (
        <main className="flex flex-col gap-5 justify-center content-center p-5">
          <Card className="w-full">
            <CardContent>
              <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
              <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
              <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </main>
      ) : data ? (
        <Card className="w-full">
          <CardHeader className="py-4"></CardHeader>
          <CardContent>
            {data && (
              <PDFReport
                data={data}
                isLoading={isLoading}
                tanggal={dataPDF.tgl}
                jenis={dataPDF.jenis}
              />
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ) : (
        <></>
      )}
    </main>
  );
}
