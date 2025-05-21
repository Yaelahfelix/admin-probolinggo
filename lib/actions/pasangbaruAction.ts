"use server";

import axios from "axios";
import { cookies } from "next/headers";

const backendUrl = process.env.BASE_URL;
export const updateProsesPSB = async (id: string, body: any) => {
  const cookieStore = await cookies();
  try {
    const res = await axios.put(
      `${backendUrl}/api/pasangbaru/proses/${id}`,
      body,
      {
        headers: { Cookie: cookieStore.toString() },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateHubungiPSB = async (id: string, body: any) => {
  const cookieStore = await cookies();
  try {
    const res = await axios.put(
      `${backendUrl}/api/pasangbaru/hubungi/${id}`,
      body,
      {
        headers: { Cookie: cookieStore.toString() },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
