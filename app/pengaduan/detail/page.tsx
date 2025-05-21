'use client';
import React, { Fragment, useEffect, useState } from 'react'
import {  useSearchParams } from 'next/navigation'


// const fetcher = onGetNeraca('/neraca',);

import HeaderLap from '@/components/header-lap';
import logo from "@/public/nlogo.svg";

import { Button } from '@/components/ui/button';
import { TimelineLayout } from "@/components/timeline/timeline-layout";

import useFetch from '@/hooks/useFetch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { decrypt } from '@/lib/crypto';
import { buttonVariants } from "@/components/ui/button"

import type { TimelineElement } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

const dataDummy : TimelineElement[] = [
  {
    id: 1,
    date: "2024-11-11",
    title: "First event",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio euismod lacinia at quis risus sed vulputate odio ut. Quam viverra orci sagittis eu volutpat odio facilisis mauris",
    icon : <Printer/>
  },
  {
    id: 2,
    date: "2024-11-12",
    title: "First event",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio euismod lacinia at quis risus sed vulputate odio ut. Quam viverra orci sagittis eu volutpat odio facilisis mauris",
    icon : <Printer/>
  }

]


export default function DetailPengaduan() {
  const searchParams = useSearchParams()
  const paramsIdValue : string = searchParams.get('id') || "";
  const id = decrypt(decodeURIComponent(paramsIdValue))
	const { data: UserData, isLoading: UserLoading, isError: UserError, mutate: UserMutate } = useFetch(`/api/pengaduan/detail/${id}`)
	const { data: ttdLap, isLoading: ttdLoading, isError: ttdError, mutate: ttdMutate } = useFetch('/api/laporan/get-ttd-lap', {kode : "lbad"})
  if (UserError || ttdError) return (
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
	if (UserLoading || ttdLoading ) return (

		<main className="flex flex-col gap-5 justify-center content-center p-5">
		<Card className="w-full">
			<CardHeader>

			</CardHeader>
			<CardContent>
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
		</main>
	)
  if (!UserData || !ttdLap) {
		<main className="flex flex-col gap-5 justify-center content-center p-5">
		<Card className="w-full">
			<CardHeader>

			</CardHeader>
			<CardContent>
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
		</main>
  }
  
  const dataTimeline : TimelineElement[] = UserData.data.tracking.map((val : any )=>{ 
 
    return {
    id: val.id,
    date: val.tanggal,
    title: val.judul,
    description: val.deskripsi
  }})
  console.log(UserData.data.tracking, "from rendered cetak");
  return (
    <Fragment>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full">
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle className='items-center place-content-center text-center'>Detail Aduan</CardTitle>
            <Link href={`/admin/pengaduan/selesai?id=${paramsIdValue}`} className={`${buttonVariants({ variant: "default" })} ${(UserData.data.status.value==="Processed" ) ? "" : "pointer-events-none" } `}>Selesaikan Aduan</Link>
          </div>
          <CardDescription>Detail Aduan</CardDescription>
        </CardHeader>
        <CardContent className="py-0">

          <div className="grid grid-cols-7 grid-rows-2 gap-1">
              
              <div className="col-span-5 row-span-2">
                <div className="grid grid-cols-5 grid-rows-2 gap-4">
                    <div className="col-span-3 row-span-2 flex flex-col w-full justify-start">
                        <h1 className='p-2 underline font-bold text-center'>DETAIL ADUAN</h1>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Nomor</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.nomor}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Status</p>
                          <p>:</p>
                          <p className={`${UserData.data.status.warna} p-1 rounded-md w-36 text-center`}>{UserData.data.status.value}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Tanggal</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.tanggal}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32 '>Sumber Laporan</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.sumber_laporan}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Nama</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.nama}</p>
                        </div>
                        <div className='flex flex-row  w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Alamat</p>
                          <p>:</p>
                          <p className={`p-1  flex-grow`}>{UserData.data.alamat}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>No HP</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.no_hp}</p>
                        </div>
                        <div className='flex flex-row w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Jenis Aduan</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.jenis_aduan}</p>
                        </div>
                        <div className='flex flex-row  w-full justify-start items-center gap-2 py-0 px-2'>
                          <p className='w-32'>Ket Aduan</p>
                          <p>:</p>
                          <p className={`p-1 flex-grow`}>{UserData.data.ket_aduan}</p>
                        </div>
                    </div>
                    <div className="col-span-2 row-span-2 col-start-4 flex flex-col w-full justify-start">
                        <h1 className='p-2 underline font-bold text-center'>FOTO ADUAN</h1>
                        <div className="h-[500px] w-full  overflow-clip rounded-md  shadow-md items-center justify-center">
                          <Image
                              src={UserData.data.foto_aduan}
                              alt={'Foto Aduan'}
                              priority 
                              style={{
                                width: '100%',
                                height: 'auto',
                              }}
                              width={700}
                              height={100}
                              className='h-full w-full object-contain'
                            />

                        </div>
                    </div>
                </div>
              </div>
              
              
              <div className="col-span-2 row-span-2 col-start-6 flex flex-col w-full justify-center items-center">
                  <h1 className='p-2 underline font-bold'>TRACK ADUAN</h1>
                  <div className="items-start">
                      <TimelineLayout items={dataTimeline} size="md" className='items-center' />
                  </div>
        
              </div>


          </div>

        </CardContent>
        <CardFooter></CardFooter>
        </Card>

      </main>
    </Fragment>
  )
}