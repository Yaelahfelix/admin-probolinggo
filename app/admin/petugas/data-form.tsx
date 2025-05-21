"use client"

import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect, Fragment } from "react"
import { useForm } from "react-hook-form"
import { AlertCircle, Check, ChevronsUpDown, CircleAlert, Eye, EyeOff } from "lucide-react"
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
import { createData, editData } from "@/lib/actions/petugasAction"
import { getData } from "@/lib/actions/divisiAction"
import { serialize } from "object-to-formdata"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
const fetcher  = (url : any) => axios.get(url).then(res => res.data)
type divisi = {
  id: string,
  nama: string,
  aktif : string,
}
export default function PetugasForm({ petugas }: { petugas?: any }) {
	const { data, error , isLoading } = useSWR('/api/divisi', fetcher)
  const [showPassword, setShowPassword] = useState(false)
  // const [divisi, setDivisi] = useState<divisi[]>([])
  const [openDivisi, setOpenDivisi] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const formSchema = z
    .object({
			nama: z.string().min(3, "Name is required"),
      role : z.string().min(1, "Role is required"),
      no_telp : z.string().min(5, "No Telp is required"),
      divisi_id : z.coerce.string().min(1, "Divisi is required"),
      username : z.string().min(3, "Username is required"),
      password: petugas ? z.string().min(6).or(z.literal("")) : z.string().min(6),
  		aktif : z.string().min(1, "status Reqruied"),
    })

    // useEffect(() => {
    //   const fetchData = async () => {
    //     const divisi = await getData()
    //     setDivisi(divisi.data)
    //   }
  
    //   fetchData()
    // }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: petugas
      ? {
					nama: petugas.nama ?? "",
          role: petugas.role ?? "",
          no_telp : petugas.no_telp ?? "",
          divisi_id : petugas.divisi_id ?? "",
          username : petugas.username ?? "",
          password: petugas.password ?? "",
					aktif: petugas.aktif ?? "",
        }
      : {
          nama: "",
          role: "Anggota",
          no_telp : "",
          divisi_id :"",
          username : "",
          password:"",
          aktif:  "1",
        },
  })

  const [isPending, startTransition] = useTransition()


  if (error) return (
		<main className="flex flex-col gap-5 justify-center content-center p-5">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Petugas</CardTitle>
					<CardDescription>Petugas</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert variant="destructive" className="mb-5">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error Fetching Data</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</main>
	);
	if (isLoading) return (

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
  if (!data) {
    return null
  }
  
  const divisi : divisi[] = data.data;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = serialize(values)
      const data = petugas
        ? await editData(petugas.id, formData)
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
        router.push("/admin/petugas")
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
          name="no_telp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Telp</FormLabel>
              <FormControl>
                <Input type="number" placeholder="no_telp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-start gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <div className="relative">
                    {/* <Input
                      type={showPasswordConfirmation ? "text" : "password"}
                      placeholder="Password Confirmation"
                      {...field}
                    /> */}

                    <Select  onValueChange={field.onChange} defaultValue={field.value} >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value="Anggota">Anggota</SelectItem>
                          <SelectItem value="Kepala">Kepala</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>


                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="divisi_id"
            render={({ field }) => (
              <FormItem className="flex flex-col grow">
                <FormLabel>Divisi</FormLabel>
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
                          ? divisi.find(
                              (divisi) => divisi.id === field.value
                            )?.nama
                          : "Select Divisi"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-1">
                    <Command>
                      <CommandInput placeholder="Search divisi..." />
                      <CommandList>
                        <CommandEmpty>No Divisi Found.</CommandEmpty>
                        <CommandGroup>
                          {divisi.map((divisi) => (
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
        </div>


        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />       

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  {showPassword ? (
                    <Eye
                      className="absolute right-2.5 top-2.5 h-5 w-5"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-2.5 top-2.5 h-5 w-5"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )}
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...field}
                  />
                </div>
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