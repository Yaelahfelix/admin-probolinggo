"use server";

import axios from "axios";
import { axiosErrorHandler } from "@/lib/errorHandler";
import { cookies } from "next/headers";

const backendUrl = process.env.BASE_URL;

export const getProfile = async () => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/app-config/profile`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return axiosErrorHandler(error);
  }
};

export const editCompanyProfile = async (data: any) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.put(
      `${backendUrl}/api/app-config/profile`,
      data,
      {
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return axiosErrorHandler(error);
  }
};
