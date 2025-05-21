"use server"

import axios from "axios"
import { axiosErrorHandler } from "@/lib/errorHandler"
import { cookies } from "next/headers"

const backendUrl = process.env.BASE_URL

export const getData = async () => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/petugas`,{
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
		console.log(error)
    return axiosErrorHandler(error)
  }
}

export const createData = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    // cookieStore.set("session", token || "" , {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   path: "***/***"
    // });
    const response = await axios.post(`${backendUrl}/api/petugas`, formData , {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const getDataSatu = async (id: string | null) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/petugas/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const editData = async (id: number, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.put(`${backendUrl}/api/petugas/${id}`, formData, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const deleteData = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.delete(`${backendUrl}/api/petugas/${id}`, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}