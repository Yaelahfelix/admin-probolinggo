"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, CircleAlert, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createData, editData } from "@/lib/actions/divisiAction";
import { serialize } from "object-to-formdata";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editCompanyProfile } from "@/lib/actions/appConfigurationAction";

interface Profile {
  judul: string;
  deskripsi: string;
  alamat: string;
  whatsapp: string;
  telp: string;
  email: string;
}
export default function CompanyProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    judul: z.string({
      message: "Judul wajib dimasukkan",
    }),

    deskripsi: z.string({
      message: "Deskripsi wajib dimasukkan",
    }),

    alamat: z.string({
      message: "Alamat perusahaan wajib dimasukkan",
    }),

    whatsapp: z
      .string({
        message: "Nomor whatsapp perusahaan wajib dimasukkan",
      })
      .refine((val) => val.startsWith("08"), {
        message: "Nomor WhatsApp harus diawali dengan 08",
      }),

    telp: z
      .string({
        message: "Nomor Telepon perusahaan wajib dimasukkan",
      })
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),

    email: z
      .string({
        message: "Email perusahaan wajib dimasukkan",
      })
      .email("Format email tidak valid"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
  });

  const [isPending, startTransition] = useTransition();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const data = await editCompanyProfile(values);

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
                <p>Berhasil memperbarui data</p>
              </div>
            </div>
          ),
        });
        router.refresh();
        router.push("/admin/app-configuration");
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
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Masukkan judul..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deskripsi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan deskripsi..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan alamat perusahaan..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan email perusahaan..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Whatsapp</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan nomor whatsapp admin..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Nomor whatsapp harus dimulai dengan 08
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Telp</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan nomor telepon perusahaan..."
                  {...field}
                />
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
  );
}
