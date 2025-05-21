"use client";

import AppHeaderAdmin from "@/components/header-admin";
import axios from "axios";
import { Fragment } from "react";
import useSWR from "swr";
import { DashboardChart } from "./bar-chart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CountUp from "react-countup";
import { Droplet, FileInput, ListTodo } from "lucide-react";

const fetcher = (url: any) => axios.get(url).then((res) => res.data);

interface Dashboard {
  success: boolean;
  dataPengaduan: DataPengaduan[];
  dataPengaduanBlmSelesai: DataPengaduan[];
  dataPsb: DataPengaduan[];
  chartTotalPengaduan: ChartTotalPengaduan[];
}

interface ChartTotalPengaduan {
  bulan: string;
  total_pengaduan: number;
  total_selesai: string;
}

interface DataPengaduan {
  total: number;
}

export default function Page() {
  const { data, error, isLoading } = useSWR<Dashboard>(
    "/api/dashboard",
    fetcher
  );

  console.log(data);

  return (
    <Fragment>
      {isLoading && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      )}
      <div className="p-10 flex gap-5 items-stretch">
        {data && (
          <>
            <div className="w-8/12 h-full">
              <DashboardChart
                chartData={data.chartTotalPengaduan.map((data) => ({
                  month: data.bulan,
                  total_pengaduan: data.total_pengaduan,
                  total_selesai: parseInt(data.total_selesai),
                }))}
              />
            </div>

            <div className="w-4/12 h-full flex flex-col justify-between gap-5">
              <Card className="h-full">
                <CardHeader className="flex flex-row justify-between items-center">
                  Total Pengaduan Bulan Ini
                  <FileInput />
                </CardHeader>
                <CardContent>
                  <CountUp
                    className="text-4xl font-bold"
                    end={data.dataPengaduan[0].total}
                    duration={3}
                  />
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <p className="text-sm flex items-center gap-1 mb-0.5">
                    Dari data pengaduan yang masuk di bulan ini
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Berdasarkan data bulan ini
                  </p>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader className="flex flex-row justify-between items-center">
                  Total Pengaduan Belum Selesai
                  <ListTodo />
                </CardHeader>
                <CardContent>
                  <CountUp
                    className="text-4xl font-bold"
                    end={data.dataPengaduanBlmSelesai[0].total}
                    duration={3}
                  />
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <p className="text-sm flex items-center gap-1 mb-0.5">
                    Dari seluruh pengaduan yang belum diselesaikan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Berdasarkan semua data pengaduan
                  </p>
                </CardFooter>
              </Card>
              <Card className="h-full">
                <CardHeader className="flex flex-row justify-between items-center">
                  Total Pasang Baru Bulan Ini
                  <Droplet className="" />
                </CardHeader>
                <CardContent>
                  <CountUp
                    className="text-4xl font-bold"
                    end={data.dataPsb[0].total}
                    duration={3}
                  />
                </CardContent>
                <CardFooter className="flex-col items-start">
                  <p className="text-sm flex items-center gap-1 mb-0.5">
                    Pendaftaran Pasang Baru
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Berdasarkan data bulan ini
                  </p>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}
