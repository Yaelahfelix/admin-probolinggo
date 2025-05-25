"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Zod schema untuk validasi
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf", // PDF
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "application/vnd.ms-powerpoint", // PPT
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters"),
  file: z
    .instanceof(File, {
      message: "File is required",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .pdf, .doc, .docx, .xls, .xlsx, .ppt, and .pptx files are accepted"
    )
    .refine((file) => file !== null, "File is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DocumentPublicForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const Router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const fileValue = watch("file");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setValue("file", acceptedFiles[0], { shouldValidate: true });
      }
    },
    accept: ACCEPTED_FILE_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const onSubmitForm = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", data.title);

      if (data.file) {
        formData.append("file", data.file);
      }

      await axios.post("/api/document-public", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // setValue("title", "");

      setSuccess(true);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Dokumen berhasil dibuat",
      });

      Router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* File Upload Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">File</label>
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 ${
            isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
          }`}
        >
          <div className="space-y-1 text-center">
            <input {...getInputProps()} />
            <div className="flex text-sm text-gray-600">
              <div className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                {isDragActive ? (
                  <p>Drop the file here</p>
                ) : (
                  <p>
                    <span>Upload a file</span> or drag and drop
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX up to 5MB
            </p>
          </div>
        </div>
        {fileValue && (
          <p className="mt-2 text-sm text-gray-500">
            Selected file: {fileValue.name}
          </p>
        )}
        {errors.file && (
          <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {success && (
        <p className="mt-1 text-sm text-green-600">
          Document successfully created!
        </p>
      )}

      {/* Submit Button */}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Create"}
      </Button>
    </form>
  );
}
