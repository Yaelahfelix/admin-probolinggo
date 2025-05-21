"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, CircleAlert } from "lucide-react";
import { updateProsesPSB } from "@/lib/actions/pasangbaruAction";

export default function ProsesForm({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    proses_by: z.string({
      message: "Diproses oleh wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { proses_by: "" },
  });

  const [isPending, startTransition] = useTransition();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateProsesPSB(id, values);
      toast({
        variant: "default",
        description: (
          <div className="flex gap-2 items-start">
            <div className="flex flex-col justify-start ">
              <Check className="w-10 h-10" />
            </div>
            <div>
              <p className="font-bold text-lg">Success</p>
              <p>Sukses memperbarui proses</p>
            </div>
          </div>
        ),
      });
      router.refresh();
      router.push("/admin/pasangbaru");
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: (
          <div className="flex gap-2 items-start">
            <div className="flex flex-col justify-start ">
              <CircleAlert className="w-10 h-10" />
            </div>
            <div>
              <p className="font-bold text-lg">{err.message}</p>
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="proses_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diproses oleh</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan nama pegawai..."
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
