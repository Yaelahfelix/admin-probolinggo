import axios from "axios";
import React from "react";
import DetailDSB from "./dashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl = process.env.BASE_URL;

const getData = async (id: string) => {
  const cookieStore = await cookies();

  console.log(id);
  const res = await axios.get(backendUrl + "/api/pasangbaru/" + id, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data.data[0];
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
async function DetailPSB({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  if (!params.id) {
    return redirect("/admin/pasangbaru");
  }
  const data = await getData(params.id as string);

  return (
    <main>
      <DetailDSB data={data} />
    </main>
  );
}

export default DetailPSB;
