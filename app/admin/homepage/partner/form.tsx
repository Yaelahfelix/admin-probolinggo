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
const MAX_FILE_SIZE = 1000000; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
  alt: z
    .string()
    .min(3, "Alt text must be at least 3 characters")
    .max(100, "Alt text must be less than 100 characters"),
  image: z
    .instanceof(File, {
      message: "Image is required",
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .jpeg and .png files are accepted"
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function PartnerForm({
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
      alt: "",
      image: undefined,
    },
  });

  const imageValue = watch("image");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setValue("image", acceptedFiles[0], { shouldValidate: true });
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
      formData.append("alt", data.alt);

      if (data.image) {
        formData.append("image", data.image);
      }

      await axios.post("/api/homepage/partner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setIsOpen(false);
      Router.refresh();
      toast({
        title: "Success",
        description: "Partner successfully created",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* File Upload Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Masukkan Logo Partner
        </label>
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
                    <span>Upload an image</span> or drag and drop
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">JPEG, PNG up to 5MB</p>
          </div>
        </div>
        {imageValue && (
          <p className="mt-2 text-sm text-gray-500">
            Selected image: {imageValue.name}
          </p>
        )}
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      {/* Alt Text Input */}
      <div>
        <label
          htmlFor="alt"
          className="block text-sm font-medium text-gray-700"
        >
          Alt Text
        </label>
        <input
          {...register("alt")}
          type="text"
          id="alt"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
        {errors.alt && (
          <p className="mt-1 text-sm text-red-600">{errors.alt.message}</p>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {success && (
        <p className="mt-1 text-sm text-green-600">
          Partner successfully created!
        </p>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Create Partner"}
      </Button>
    </form>
  );
}
