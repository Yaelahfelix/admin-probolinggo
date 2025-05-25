// app/detail-pengaduan/components/DetailPengaduanClient.tsx
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimelineLayout } from "@/components/timeline/timeline-layout";

interface TimelineElement {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface UserData {
  nomor: string;
  status: {
    value: string;
    warna: string;
  };
  tanggal: string;
  sumber_laporan: string;
  nama: string;
  alamat: string;
  no_hp: string;
  jenis_aduan: string;
  ket_aduan: string;
  foto_aduan: string;
}

interface DetailPengaduanClientProps {
  userData: UserData;
  dataTimeline: TimelineElement[];
}

export default function DetailPengaduanClient({
  userData,
  dataTimeline,
}: DetailPengaduanClientProps) {
  return (
    <section className="min-h-screen bg-slate-100">
      <nav className="w-full bg-white flex justify-center gap-5 items-center py-5 shadow sticky top-0 font-sans">
        <Image src="/pudam-bayuangga.png" alt="" width={50} height={50} />
        <div>
          <h3 className="font-bold">Admin PDAM Probolinggo</h3>
          <p className="text-xs text-slate-700 ">
            Semua data dihalaman ini bersifat publik
          </p>
        </div>
      </nav>
      <main className="flex flex-col gap-5 justify-center content-center p-5">
        <Card className="w-full bg-white">
          <CardHeader>
            <div className="flex justify-center">
              <CardTitle className="items-center place-content-center text-center">
                Detail Aduan
              </CardTitle>
            </div>
            <CardDescription className="text-center flex justify-center">
              Detail Aduan
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <div className="lg:grid lg:grid-cols-7 grid-rows-2 gap-1">
              <div className="lg:col-span-5 row-span-2">
                <div className="flex flex-col gap-10 lg:grid grid-cols-5 grid-rows-2 lg:gap-4">
                  <div className="col-span-3 row-span-2 flex flex-col w-full justify-start">
                    <h1 className="p-2 underline font-bold text-center">
                      DETAIL ADUAN
                    </h1>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Nomor</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.nomor}</p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Status</p>
                      <p>:</p>
                      <p
                        className={`${userData.status.warna} p-1 rounded-md w-36 text-center`}
                      >
                        {userData.status.value}
                      </p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Tanggal</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.tanggal}</p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32 ">Sumber Laporan</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.sumber_laporan}</p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Nama</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.nama}</p>
                    </div>
                    <div className="flex flex-row  w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Alamat</p>
                      <p>:</p>
                      <p className="p-1  flex-grow">{userData.alamat}</p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">No HP</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.no_hp}</p>
                    </div>
                    <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Jenis Aduan</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.jenis_aduan}</p>
                    </div>
                    <div className="flex flex-row  w-full justify-start items-center gap-2 py-0 px-2">
                      <p className="w-32">Ket Aduan</p>
                      <p>:</p>
                      <p className="p-1 flex-grow">{userData.ket_aduan}</p>
                    </div>
                  </div>
                  <div className="col-span-2 row-span-2 col-start-4 flex flex-col w-full justify-start">
                    <h1 className="p-2 underline font-bold text-center">
                      FOTO ADUAN
                    </h1>
                    <div className="h-[500px] w-full  overflow-clip rounded-md  shadow-md items-center justify-center">
                      <Image
                        src={userData.foto_aduan}
                        alt="Foto Aduan"
                        priority
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                        width={700}
                        height={100}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 lg:pt-0 lg:col-span-2 row-span-2 col-start-6 flex flex-col w-full justify-center items-center">
                <h1 className="p-2 underline font-bold">TRACK ADUAN</h1>
                <div className="items-start">
                  <TimelineLayout
                    items={dataTimeline as any}
                    size="md"
                    className="items-center"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </section>
  );
}
