"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { DocumentHomepageType } from "../type";
import axios from "axios";

const formSchema = z.object({
  value: z.object({
    url: z.string().url("Invalid URL format"),
  }),
});

const DocumentHomepage = ({ data }: { data: DocumentHomepageType }) => {
  const { toast } = useToast();
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: {
        url: data.value.url || "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.put("/api/homepage/document", values);
      if (res.status === 200) {
        toast({
          title: "Berhasil memperbarui data",
        });
        Router.refresh();
      }
    } catch (error) {
      toast({
        title: "Gagal memperbarui data",
        description: "Terjadi kesalah, silahkan coba lagi!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <h3 className="pt-10 px-10 text-xl text-center font-bold">
        Dokumen Hasil Lab
      </h3>
      <Separator className="my-3" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 px-10 pb-10"
        >
          <FormField
            control={form.control}
            name="value"
            render={() => {
              const value = form.getValues("value");

              return (
                <FormItem>
                  <FormLabel>Link Dokumen</FormLabel>
                  <FormControl>
                    <Input
                      value={value?.url || ""}
                      onChange={(e) =>
                        form.setValue("value", { url: e.target.value })
                      }
                      placeholder="Masukkan URL File"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button
            type="submit"
            className="w-full font-bold"
            disabled={isLoading}
          >
            Save
          </Button>
          <p className="italic">
            *pastikan dokumen sudah terupload di{" "}
            <Link
              href="/admin/document-public"
              className="text-blue-500 underline hover:text-blue-600 transition-colors"
            >
              Dokumen Publik
            </Link>
            , lalu salin link dari dokumen tersebut
          </p>
        </form>
      </Form>
    </div>
  );
};

export default DocumentHomepage;
