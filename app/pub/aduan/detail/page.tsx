import { decrypt } from "@/lib/crypto";
import { notFound } from "next/navigation";
import DetailPengaduanClient from "./view";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

async function fetchPengaduanData(id: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/pengaduan/detail/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pengaduan data:", error);
    return null;
  }
}

export default async function DetailPengaduanPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paramsIdValue = params.id || "";

  if (!paramsIdValue) {
    notFound();
  }

  const id = decrypt(decodeURIComponent(paramsIdValue));
  const userData = await fetchPengaduanData(id!);

  if (!userData || !userData.data) {
    notFound();
  }

  // Transform data untuk timeline
  const dataTimeline =
    userData.data.tracking?.map((val: any) => ({
      id: val.id,
      date: val.tanggal,
      title: val.judul,
      description: val.deskripsi,
    })) || [];

  return (
    <DetailPengaduanClient
      userData={userData.data}
      dataTimeline={dataTimeline}
    />
  );
}
