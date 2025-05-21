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
import logo from "@/public/nlogo.svg";

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
import { useQRCode } from "next-qrcode";
import PDFHeader, { HeaderProps } from "@/components/pdf-header";
import axios from "axios";

export default function CetakPengaduan() {
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { Canvas } = useQRCode();

  const paramsIdValue: string = searchParams.get("id") || "";
  const id = decrypt(decodeURIComponent(paramsIdValue));
  const {
    data: UserData,
    isLoading: UserLoading,
    isError: UserError,
    mutate: UserMutate,
  } = useFetch(`/api/laporan/adu-satu/${id}`);
  const {
    data: ttdLap,
    isLoading: ttdLoading,
    isError: ttdError,
    mutate: ttdMutate,
  } = useFetch("/api/laporan/get-ttd-lap", { kode: "lbad" });

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
  if (UserLoading || ttdLoading || !dekstop)
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
              Print Bukti Aduan
            </Button>
          </div>
        </div>
        <div
          ref={contentRef}
          className={`${styles.basereport} overflow-auto border-t-0`}
        >
          {/* <HeaderLap periode={searchParams.get('periode') || ""} judul='BUKTI PENUGASAN ADUAN'/> */}
          <PDFHeader judul="BUKTI PENGADUAN" dekstop={dekstop} />

          <div className="grid grid-cols-3 grid-rows-1 gap-1 text-xs">
            <div className="col-span-2 border">
              <div className="grid grid-cols-2 grid-rows-8 gap-0">
                <div className="flex flex-row w-full justify-center col-span-2">
                  <h1 className="p-2 underline font-bold">KETERANGAN</h1>
                </div>
                <div className="flex flex-row row-start-2 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Nomor</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.nomor}</p>
                </div>
                <div className="flex flex-row row-start-2 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-24">Status</p>
                  <p>:</p>
                  <p
                    className={`${UserData.data.status.warna} p-1 rounded-md flex-grow text-center`}
                  >
                    {UserData.data.status.value}
                  </p>
                </div>
                <div className="flex flex-row row-start-3 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Tanggal</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.tanggal}</p>
                </div>
                <div className="flex flex-row row-start-3 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-24 ">Sumber Laporan</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>
                    {UserData.data.sumber_laporan}
                  </p>
                </div>
                <div className="flex flex-row col-span-2 col-start-1 row-start-4 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Nama</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.nama}</p>
                </div>
                <div className="flex flex-row col-span-2 col-start-1 row-start-5 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Alamat</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.alamat}</p>
                </div>
                <div className="flex flex-row col-span-2 col-start-1 row-start-6 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">No HP</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.no_hp}</p>
                </div>
                <div className="flex flex-row col-span-2 col-start-1 row-start-7 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Jenis Aduan</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.jenis_aduan}</p>
                </div>
                <div className="flex flex-row col-span-2 col-start-1 row-start-8 w-full justify-start items-center gap-2 py-0 px-2">
                  <p className="w-20">Ket Aduan</p>
                  <p>:</p>
                  <p className={`p-1 flex-grow`}>{UserData.data.ket_aduan}</p>
                </div>
              </div>
            </div>
            <div className="col-start-3 border">
              <div className="grid grid-cols-1 grid-rows-1 gap-0">
                <div className="flex flex-row w-full justify-center">
                  <h1 className="p-2 underline font-bold">
                    SCAN FOR TRACKING ADUAN
                  </h1>
                </div>
                <div className="flex flex-row w-full justify-center">
                  <Canvas
                    text={UserData.data.url_qrcode}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 200,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs font-bold m-2">Note :</p>
          <p className="text-xs italic ml-3">
            Bukti ini di buat oleh petugas :{" "}
            <span className="font-semibold">{UserData.data.user_buat}</span>,
            dan dibuat secara elektronik, tidak dibuahi tanda tangan
          </p>
          <p className="text-xs italic ml-3"></p>

          {/* <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className='w-44'>Nomor Penugasan</p>
            <p>:</p>
            <p>{UserData.data.id}</p>
        </div>

        <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className='w-44'>Tanggal Penugasan</p>
            <p>:</p>
            <p>{UserData.data.tgl_penugasan}</p>
        </div>

        <div className="pl-3 flex flex-row w-full gap-5 text-xs mt-1">
            <p className='w-44'>Ditugaskan Ke Divisi</p>
            <p>:</p>
            <p>{UserData.data.divisi}</p>
        </div> */}

          {/* <Table className='table mt-4'>
          <TableHeader>
            <TableRow  className="">
              <TableHead className="w-[10px] p-1 border border-black  h-6 font-bold text-center text-xs " >No</TableHead>
              <TableHead className="w-[90px] p-1  border border-black h-6 font-bold text-center text-xs" >Tanggal</TableHead>
              <TableHead className="w-[150px] p-1 border border-black h-6 font-bold text-center text-xs" >Nomor</TableHead>
              <TableHead className="w-[150px] p-1 border border-black h-6 font-bold text-center  text-xs" >Nama</TableHead>
              <TableHead className='w-[170px] p-1 border border-black h-6 font-bold text-center  text-xs' >Alamat</TableHead>
              <TableHead className="w-[25px] p-1  border border-black h-6 font-bold text-center  text-xs" >No HP</TableHead>
              <TableHead className="w-[170px] p-1 border border-black h-6 font-bold text-center  text-xs" >Aduan </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>


            {UserData.data.aduan.map((lap : any,row : any) => {
                return (
                    <TableRow key={lap.id}>
                            <TableCell className='p-1 text-center border border-black text-xs'>{row + 1}</TableCell>
                            <TableCell className='p-1 border border-black text-xs'>{lap.tanggal}</TableCell>
                            <TableCell className='p-1 border border-black text-xs'>{lap.nomor}</TableCell>
                            <TableCell className='p-1 border border-black text-xs'>{lap.nama}</TableCell>
                            <TableCell className='p-1 border border-black text-xs'>{lap.alamat}</TableCell>
                            <TableCell className='w-[25px] p-1 border border-black text-xs'>{lap.no_hp}</TableCell>
                            <TableCell className='p-1 border border-black text-xs'>{lap.aduan }</TableCell>

                    </TableRow>
                )
              })

              }
          </TableBody>
        </Table> */}
          {/* <FooterLapSpk datattd={ttdLap[0]} tanggalreport={UserData.data.tgl_penugasan} kota='Kediri'/> */}
        </div>
      </div>
    </Fragment>
  );
}
