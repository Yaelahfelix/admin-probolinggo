"use client";

import React from "react";
import { WebUserDaftarPSB } from "../columns";
import MapComponent from "@/components/locationMaps";

type Props = { data: WebUserDaftarPSB };

function DetailDSB({ data }: Props) {
  return (
    <div className="p-5">
      <div className="flex gap-5">
        <div className="w-8/12 border border-slate-300 dark:border-slate-700 p-5 rounded-lg">
          <h1 className="text-center font-bold text-lg mb-5">
            Detail Pendaftaran Pasang Baru
          </h1>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Nama</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>{data.nama}</p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">No HP</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>{data.no_hp}</p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Alamat</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>{data.alamat}</p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Status Hubungi</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>
              {data.flaghub ? "Sudah dihubungi" : "Belum dihubungi"}
            </p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Dihubungi pada</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>{data.hub_at ? data.hub_at : "-"}</p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Dihubungi oleh</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>{data.hub_by ? data.hub_by : "-"}</p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Status Proses</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>
              {data.flaghub ? "Sudah Proses" : "Belum diproses"}
            </p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Diproses pada</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>
              {data.proses_at ? data.proses_at : "-"}
            </p>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-2 py-0 px-2">
            <p className="w-32">Diproses oleh</p>
            <p>:</p>
            <p className={`p-1 flex-grow`}>
              {data.proses_by ? data.proses_by : "-"}
            </p>
          </div>
        </div>
        <div className="w-4/12">
          {data.latitude && data.longitude ? (
            <MapComponent
              latitude={Number(data.latitude)}
              longitude={Number(data.longitude)}
            />
          ) : (
            <div className="w-full h-full grid place-content-center">
              Tidak ada data map
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailDSB;
