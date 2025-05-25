"use client";
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
import { FaRegFilePdf } from "react-icons/fa6";
import { TiDocument } from "react-icons/ti";
import { FiExternalLink } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PublicDocument } from "./type";
import axios from "axios";
import Link from "next/link";

type Props = {
  document: PublicDocument;
};

const DocumentCard = ({ document }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const deleteHandler = async () => {
    try {
      const res = await axios.delete("/api/document-public?id=" + document._id);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Dokumen berhasil dihapus",
        });
        router.refresh();
      }
    } catch (err) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Terjadi kesalahan saat menghapus dokumen.",
      });
    }
  };

  return (
    <div
      className={clsx(
        "px-8 py-4 rounded-[100px] border w-full transition-colors flex items-center justify-between",
        document.file.type === "pdf" &&
          "border-red-500 font-semibold hover:bg-red-500 hover:text-white group"
      )}
    >
      <span className="flex items-center gap-3">
        {document.file.type === "pdf" ? (
          <FaRegFilePdf className="text-lg" />
        ) : (
          <TiDocument />
        )}
        {document.title}.{document.file.type}
      </span>
      <div className="flex gap-3">
        {/* open document */}
        <Link
          href={document.file.url}
          target="_blank"
          className="group-hover:bg-white p-1 rounded-lg"
        >
          <FiExternalLink className="cursor-pointer text-blue-500 rounded-lg text-lg" />
        </Link>
        {/* delete alert */}
        <AlertDialog>
          <AlertDialogTrigger>
            <div className="group-hover:bg-white p-1 rounded-lg">
              <FaRegTrashAlt className="cursor-pointer text-red-500 rounded-lg text-lg" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah kamu yakin ingin menghapus dokumen ini?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Dokumen ini akan dihapus secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={deleteHandler}>
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DocumentCard;
