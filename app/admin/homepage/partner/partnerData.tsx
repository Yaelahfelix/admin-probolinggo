"use client";
import { urlFor } from "@/lib/sanity-utils";
import Image from "next/image";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Partner } from "./type";

type Props = { partners: Partner[] };

const PartnerData = ({ partners }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const deleteHandler = async (id: string) => {
    try {
      const res = await axios.delete("/api/homepage/partner?id=" + id);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Logo Partner berhasil dihapus",
        });
        router.refresh();
      }
    } catch (err) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Terjadi kesalahan saat menghapus logo partner.",
      });
    }
  };
  return (
    <div className="flex gap-5 flex-wrap">
      {partners.map((partner) => (
        <AlertDialog key={partner._id}>
          <AlertDialogTrigger>
            <div className="bg-white p-5 shadow rounded-lg text-center hover:brightness-75 transition-all">
              <Image
                src={urlFor(partner.image).url()}
                alt={partner.alt}
                width={100}
                height={70}
              />
              <p>{partner.alt}</p>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin ingin menghapus logo partner ini?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Logo partner ini ini akan dihapus secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteHandler(partner._id)}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
};

export default PartnerData;
