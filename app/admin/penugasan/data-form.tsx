"use client"

import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect, Fragment } from "react"
import { useForm } from "react-hook-form"
import { AlertCircle, CalendarIcon, Check, ChevronsUpDown, CircleAlert, Eye, EyeOff } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { createData, editData } from "@/lib/actions/penugasanAction"

import { serialize } from "object-to-formdata"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import useFetch from "@/hooks/useFetch"
// import { Calendar } from "@/components/ui/Calendar"
import { MultiSelect } from "@/components/multi-select"

type Divisi = {
  id: string,
  nama: string,
  aktif : string,
}
type ComboAduan = {
  value: string,
  label: string,
}

export default function PenugasanForm({ penugasan }: { penugasan?: any }) {
  const { data: divisi, isLoading: divisiLoading, isError: divisiError} = useFetch('/api/divisi')
  const { data: aduanRes, isLoading: aduanLoading, isError: aduanError} = useFetch('/api/pengaduan/get-for-penugasan',{tugas_id : penugasan?.id || "-1"})
  const [openDivisi, setOpenDivisi] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const formSchema = z
    .object({
      aduan_id : z.string().array().min(1, "Aduan at Least 1"),
      divisi_id : z.coerce.string().min(1, "Divisi Id required"),
    })


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: penugasan
      ? {
          aduan_id : penugasan.aduan_id ??[],
          divisi_id : penugasan.divisi_id ?? ""
        }
      : {
          aduan_id : [],
          divisi_id :  "",
        },
  })

  const [isPending, startTransition] = useTransition()


  if (divisiError || aduanError) return (
		<main className="flex flex-col gap-5 justify-center content-center p-5">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Pengaduan</CardTitle>
					<CardDescription>Pengaduan</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert variant="destructive" className="mb-5">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error Fetching Data</AlertTitle>
							<AlertDescription>{divisiError}</AlertDescription>
						</Alert>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</main>
	);
	if (divisiLoading || aduanLoading ) return (

		<main className="flex flex-col gap-5 justify-center content-center p-5">
		<Card className="w-full">
			<CardHeader>

			</CardHeader>
			<CardContent>
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
		</main>
	)
  if (!divisi || !aduanRes) {
		<main className="flex flex-col gap-5 justify-center content-center p-5">
		<Card className="w-full">
			<CardHeader>

			</CardHeader>
			<CardContent>
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
				<Skeleton className="flex w-full m-1 h-[20px] rounded-full" />
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
		</main>
  }
  
  const divisiData : Divisi[] = divisi.data;
  const aduan : ComboAduan[]= aduanRes;
    

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = serialize(values)
      const data = penugasan
        ? await editData(penugasan.id, formData)
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
        router.push("/admin/penugasan")
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
  
  console.log(form.getValues("aduan_id") , "from formdata");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex w-full justify-start gap-4">
          <FormField
              control={form.control}
              name="aduan_id"
              render={({ field }) => (
                <FormItem className="flex flex-col grow">
                  <FormLabel>Tanggal Aduan</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={aduan}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select Aduan"
                      variant="inverted"
                      animation={2}
                      maxCount={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
          />
        </div> 
        <FormField
            control={form.control}
            name="divisi_id"
            render={({ field }) => (
              <FormItem className="flex flex-col grow">
                <FormLabel>Select Divisi</FormLabel>
                <Popover open={openDivisi} onOpenChange={setOpenDivisi}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? divisiData.find(
                              (divisi) => divisi.id === field.value
                            )?.nama
                          : "Select Divisi"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-1">
                    <Command >
                      <CommandInput placeholder="Search Jenis Aduan..." />
                      <CommandList>
                        <CommandEmpty>No Divisi Found.</CommandEmpty>
                        <CommandGroup>
                          {divisiData.map((divisi) => (
                            <CommandItem
                              value={divisi.nama}
                              key={divisi.id.toString()}
                              onSelect={() => {
                                form.setValue("divisi_id", divisi.id)
                                form.trigger("divisi_id")
                                setOpenDivisi(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  divisi.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {divisi.nama}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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