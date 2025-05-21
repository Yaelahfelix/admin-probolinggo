"use client"

import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Check, ChevronsUpDown, CircleAlert, Eye, EyeOff } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { createData, editData } from "@/lib/actions/divisiAction"
import { serialize } from "object-to-formdata"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function DivisiForm({ divisi }: { divisi?: any }) {
  const router = useRouter()
  const { toast } = useToast()


  const formSchema = z
    .object({
			nama: z.string().min(3, "Name is required"),
  		aktif : z.string().min(1, "status Reqruied"),
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: divisi
      ? {
					nama: divisi.nama ?? "",
					aktif: divisi.aktif ?? "",

        }
      : {
          nama: "",
					aktif: "1",
        },
  })

  const [isPending, startTransition] = useTransition()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = serialize(values)
      const data = divisi
        ? await editData(divisi.id, formData)
        : await createData(formData)

      if (data.success) {
        toast({
          variant: "default",
          description: (
            <div className="flex gap-2 items-start">
              <div className="flex flex-col justify-start ">
                <Check className="w-10 h-10" />
              </div>
              <div>
                <p className="font-bold text-lg">Success</p>
                <p>{data.message}</p>
              </div>
            </div>
          ),
        })
        router.refresh()
        router.push("/admin/divisi")
      } else {
        toast({
          variant: "destructive",
          description: (
            <div className="flex gap-2 items-start">
              <div className="flex flex-col justify-start ">
                <CircleAlert className="w-10 h-10" />
              </div>
              <div>
                <p className="font-bold text-lg">{data.message}</p>
                {/* <ul className="list-disc pl-5">
                  {data.data.map((val: any, key: number) => (
                    <li key={key}>{val.message}</li>
                  ))}
                </ul> */}
              </div>
            </div>
          ),
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nama" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

			<FormField
          control={form.control}
          name="aktif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <div className="relative">
                  {/* <Input
                    type={showPasswordConfirmation ? "text" : "password"}
                    placeholder="Password Confirmation"
                    {...field}
                  /> */}

									<Select  onValueChange={field.onChange} defaultValue={field.value} >
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select a Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Status</SelectLabel>
												<SelectItem value="1">Aktif</SelectItem>
												<SelectItem value="0">Nonaktif</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
                </div>


              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}