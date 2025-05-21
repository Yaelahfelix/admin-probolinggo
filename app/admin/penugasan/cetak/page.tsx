"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// const fetcher = onGetNeraca('/neraca',);
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import HeaderLap from "@/components/header-lap";

import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

import useFetch from "@/hooks/useFetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { decrypt } from "@/lib/crypto";
import FooterLapSpk from "@/components/footer-lap-spk";
import PDFHeader, { HeaderProps } from "@/components/pdf-header";
import axios from "axios";

export default function CetakPenugasan() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const fjudulsd = (val: string): string => {
    if (val === "0") {
      return "Sampai Dengan Bulan Ini";
    } else {
      return "Sampai Dengan Tahun Ini";
    }
  };
  const paramsIdValue: string = searchParams.get("id") || "";
  const id = decrypt(decodeURIComponent(paramsIdValue));
  const {
    data: UserData,
    isLoading: UserLoading,
    isError: UserError,
    mutate: UserMutate,
  } = useFetch(`/api/laporan/spk-satu/${id}`);
  const {
    data: ttdLap,
    isLoading: ttdLoading,
    isError: ttdError,
    mutate: ttdMutate,
  } = useFetch("/api/laporan/get-ttd-lap", { kode: "lspk" });

  const [dekstop, setDekstop] = useState<HeaderProps>();
  useEffect(() => {
    axios.get("/api/dekstop").then((res) => {
      setDekstop(res.data.data);
    });
  }, []);
  if (UserError || ttdError)
    return (
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
              <AlertDescription>{`${UserError}-${ttdError}`}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  if (UserLoading || ttdLoading)
    return (
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
          <CardHeader></CardHeader>
          <CardContent>
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
            <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    );
  if (!UserData || !ttdLap) {
    <main className="flex flex-col gap-5 justify-center content-center p-5">
      <Card className="w-full">
        <CardHeader></CardHeader>
        <CardContent>
          <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
          <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
          <Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>;
  }

  console.log(ttdLap, "from rendered cetak");
  return (
    <Fragment>
      <div className="w-[210mm] mx-auto border-2 shadow-lg">
        <div>
          {/* <ReactToPrint 
          trigger={()=>{ 
            
            return (
            
            <div className='my-2 w-[297mm] flex justify-end'>
              <Button className='mx-[20px] '>Print Laporan</Button>
            </div>
            ) 
          }}
          content={()=> componentRef.current }
        /> */}
          <div className="my-2 w-[210mm] flex justify-end">
            <Button className="mx-[20px] " onClick={() => reactToPrintFn()}>
              Print Bukti Penugasan
            </Button>
          </div>
        </div>
        <div
          ref={contentRef}
          className={`${styles.basereport} overflow-auto border-t-0`}
        >
          {/* <HeaderLap
            periode={searchParams.get("periode") || ""}
            judul="BUKTI PENUGASAN ADUAN"
          /> */}
          <PDFHeader judul="BUKTI PENUGASAN ADUAN" dekstop={dekstop} />
          <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className="w-44">Nomor Penugasan</p>
            <p>:</p>
            <p>{UserData.data.id}</p>
          </div>

          <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className="w-44">Tanggal Penugasan</p>
            <p>:</p>
            <p>{UserData.data.tgl_penugasan}</p>
          </div>

          <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className="w-44">Ditugaskan Ke Divisi</p>
            <p>:</p>
            <p>{UserData.data.divisi}</p>
          </div>

          <Table className="table mt-4">
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[10px] p-1 border border-black  h-6 font-bold text-center text-xs ">
                  No
                </TableHead>
                <TableHead className="w-[90px] p-1  border border-black h-6 font-bold text-center text-xs">
                  Tanggal
                </TableHead>
                <TableHead className="w-[150px] p-1 border border-black h-6 font-bold text-center text-xs">
                  Nomor
                </TableHead>
                <TableHead className="w-[150px] p-1 border border-black h-6 font-bold text-center  text-xs">
                  Nama
                </TableHead>
                <TableHead className="w-[170px] p-1 border border-black h-6 font-bold text-center  text-xs">
                  Alamat
                </TableHead>
                <TableHead className="w-[25px] p-1  border border-black h-6 font-bold text-center  text-xs">
                  No HP
                </TableHead>
                <TableHead className="w-[170px] p-1 border border-black h-6 font-bold text-center  text-xs">
                  Aduan{" "}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {UserData.data.aduan.map((lap: any, row: any) => {
                return (
                  <TableRow key={lap.id}>
                    <TableCell className="p-1 text-center border border-black text-xs">
                      {row + 1}
                    </TableCell>
                    <TableCell className="p-1 border border-black text-xs">
                      {lap.tanggal}
                    </TableCell>
                    <TableCell className="p-1 border border-black text-xs">
                      {lap.nomor}
                    </TableCell>
                    <TableCell className="p-1 border border-black text-xs">
                      {lap.nama}
                    </TableCell>
                    <TableCell className="p-1 border border-black text-xs">
                      {lap.alamat}
                    </TableCell>
                    <TableCell className="w-[25px] p-1 border border-black text-xs">
                      {lap.no_hp}
                    </TableCell>
                    <TableCell className="p-1 border border-black text-xs">
                      {lap.aduan}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <FooterLapSpk
            datattd={ttdLap[0]}
            tanggalreport={UserData.data.tgl_penugasan}
            kota="Kediri"
          />
        </div>
      </div>
    </Fragment>
  );
}
