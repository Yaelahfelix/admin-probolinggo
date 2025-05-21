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

// export const metadata: Metadata = {
//   title: "Users",
// }
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function Users() {
  const [tgl, setTgl] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [tglSelesai, setTglSelesai] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const {
    data: dataJenis,
    error: errorJenis,
    isLoading: isLoadingJenis,
  } = useSWR("/api/jenis-aduan", fetcher);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<LapAduan[] | null>(null);
  const [error, setError] = useState(null);
  const [dataPDF, setDataPDF] = useState({ tgl: "", filter: "" });
  const [selectedJenisAduan, setSelectedJenisAduan] = useState<{
    nama?: string;
    id?: number;
  }>({
    nama: undefined,
    id: undefined,
  });
  const [filterIsComplete, setFilterIsComplete] = useState(false);

  const searchingHandler = async () => {
    setIsLoading(true);
    setError(null);

    if (!tgl.from || !tgl.to) {
      return toast({ title: "Tanggal wajib diisi", variant: "destructive" });
    }
    try {
      let url = `/api/lap-aduan?fromDate=${format(tgl.from, "yyyy-MM-dd")}&toDate=${format(tgl.to, "yyyy-MM-dd")}`;

      if (selectedJenisAduan && selectedJenisAduan.id) {
        url += `&jenisAduanId=${selectedJenisAduan.id}`;

        if (selectedJenisAduan.nama) {
          url += `&jenisAduanNama=${selectedJenisAduan.nama}`;
        }
      }

      if (filterIsComplete) {
        url += `&isComplete=${filterIsComplete}`;
      }
      if (tglSelesai.from) {
        url += `&completedFrom=${format(tglSelesai.from, "yyyy-MM-dd")}`;
      }

      if (tglSelesai.to) {
        url += `&completedTo=${format(tglSelesai.to, "yyyy-MM-dd")}`;
      }

      const res = await fetch(url);

      if (!res.ok) throw new Error("Gagal mengambil data");

      const result = await res.json();
      setData(result.data);
      setDataPDF({
        filter: result.filter,
        tgl: result.tanggal,
      });
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
          <Button onClick={searchingHandler}>Cari Aduan</Button>
        </div>

        <div className="flex gap-5">
          <Popover>
            <PopoverTrigger disabled={isLoadingJenis}>
              <Button color="primary">Filter</Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-5 w-[350px]">
              <div>
                <label>Jenis Aduan</label>
                <Select
                  value={String(selectedJenisAduan.id)}
                  onValueChange={(val) => {
                    const selectedData = dataJenis.data.find(
                      (data: any) => data.id === parseInt(val)
                    );

                    setSelectedJenisAduan({
                      id: selectedData.id,
                      nama: selectedData.nama,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dataJenis?.data.map(
                        (data: { nama: string; id: number }) => (
                          <SelectItem value={String(data.id)}>
                            {data.nama}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_complete"
                  checked={filterIsComplete}
                  onCheckedChange={(value) =>
                    setFilterIsComplete(value as boolean)
                  }
                />
                <label
                  htmlFor="is_complete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Filter Selesai
                </label>
              </div>
              {filterIsComplete && (
                <div>
                  <label>Tanggal Selesai</label>
                  <DatePickerWithRange
                    date={tglSelesai}
                    setDate={setTglSelesai}
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {data && (
            <PDFReport
              data={data}
              isLoading={false}
              tanggal={dataPDF.tgl}
              filter={dataPDF.filter}
            />
          )}
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
            <DataTable columns={columns} data={data ?? []} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ) : (
        <></>
      )}
    </main>
  );
}
