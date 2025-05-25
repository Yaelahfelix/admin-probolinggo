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
import axios from "axios";
import { WhatsappAdminType } from "../type";

const formSchema = z.object({
  value: z.array(
    z.object({
      nama: z.string().min(1, "Name cannot be empty"),
      number: z.string().min(1, "Number cannot be empty"),
    })
  ),
});

const WhatsappAdminForm = ({ data }: { data: WhatsappAdminType }) => {
  const { toast } = useToast();
  const Router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: data.value,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.put("/api/homepage/whatsapp_admin", values);
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
      <h3 className="pt-10 px-10 text-xl font-bold text-center">
        Kontak Whatsapp
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
              const contacts = form.getValues("value");

              return (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {contacts.map((contact, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="w-6/12">
                            <FormLabel>Nama Admin {index + 1}</FormLabel>
                            <Input
                              value={contact.nama}
                              onChange={(e) => {
                                const updatedContacts = [...contacts];
                                updatedContacts[index] = {
                                  ...updatedContacts[index],
                                  nama: e.target.value,
                                };
                                form.setValue("value", updatedContacts);
                              }}
                              placeholder={`Admin ${index + 1} Name`}
                            />
                          </div>

                          <div className="w-6/12">
                            <FormLabel>Nomor Admin {index + 1}</FormLabel>
                            <Input
                              value={contact.number}
                              onChange={(e) => {
                                const updatedContacts = [...contacts];
                                updatedContacts[index] = {
                                  ...updatedContacts[index],
                                  number: e.target.value,
                                };
                                form.setValue("value", updatedContacts);
                              }}
                              placeholder={`Admin ${index + 1} Number`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
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
        </form>
      </Form>
    </div>
  );
};

export default WhatsappAdminForm;
