"use server"

// import { auth } from "@/auth"
import axios from "axios"
import { axiosErrorHandler } from "@/lib/errorHandler"
import { getCurrentSession, setSessionTokenCookie } from "../session"
import { cookies } from "next/headers"

const backendUrl = process.env.BASE_URL

export const getUsers = async () => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/users`,{
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
		console.log(error)
    return axiosErrorHandler(error)
  }
}

export const createUser = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.post(`${backendUrl}/api/users`, formData , {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const getUser = async (id: string | null) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.get(`${backendUrl}/api/users/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const editUser = async (id: number, formData: FormData) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.put(`${backendUrl}/api/users/${id}`, formData, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}

export const deleteUser = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const response = await axios.delete(`${backendUrl}/api/users/${id}`, {
      headers : { Cookie: cookieStore.toString() }
    })
    return response.data
  } catch (error) {
    return axiosErrorHandler(error)
  }
}