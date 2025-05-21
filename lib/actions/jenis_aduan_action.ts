"use server"

import axios from "axios"
import { axiosErrorHandler } from "@/lib/errorHandler"
import { cookies } from "next/headers"

const backendUrl = process.env.BASE_URL

export const getJenisAduan = async () => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/jenis-aduan`,{
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
		console.log(error)
    return axiosErrorHandler(error)
  }
}

export const createJenisAduan = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    // cookieStore.set("session", token || "" , {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    //   path: "***/***"
    // });
    const response = await axios.post(`${backendUrl}/api/jenis-aduan`, formData , {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const getJenisAduanSatu = async (id: string | null) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/jenis-aduan/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const editJenisAduan = async (id: number, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.put(`${backendUrl}/api/jenis-aduan/${id}`, formData, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const deleteJenisAduan = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.delete(`${backendUrl}/api/jenis-aduan/${id}`, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}