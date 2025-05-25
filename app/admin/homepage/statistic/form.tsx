"use client";

import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Statistic } from "./type";
import axios from "axios";
import StatisticCard from "./card";
import { idIconStatistic } from "./idIcon";

// Schema validasi menggunakan Zod
const formSchema = z.object({
  id_icon: z.string().min(1, "ID Icon is required"),
  value: z
    .string()
    .min(1, "Value must not be empty")
    .max(100, "Value must be less than 100 characters"),
  type_value: z.string().optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be less than 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function StatisticForm({ statistic }: { statistic: Statistic }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formValues, setFormValues] = useState<FormValues>(statistic);

  const { toast } = useToast();

  const handleSelectIcon = (icon: string) => {
    setFormValues((prev) => ({ ...prev, id_icon: icon }));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    try {
      formSchema.parse(formValues);
      return true;
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const issues = err.errors.map((issue) => issue.message).join(", ");
        setError(issues);
      } else {
        setError("Unknown validation error occurred");
      }
      return false;
    }
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await axios.put("/api/homepage/statistic", {
        _id: statistic._id,
        ...formValues,
      });
      toast({
        title: "Success",
        description: "Statistik berhasil di update",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <StatisticCard
        statistic={{
          _id: statistic._id,
          ...formValues,
        }}
      />
      <form onSubmit={onSubmitForm} className="space-y-6">
        <div className="grid grid-cols-2 gap-5 items-center mt-5">
          {/* ID Icon Select */}
          <div>
            <label
              htmlFor="id_icon"
              className="block text-sm font-medium text-gray-700"
            >
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                {formValues.id_icon ? (
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-500 rounded">
                      <Image
                        src={`/assets/icon/${formValues.id_icon}.png`}
                        width={25}
                        height={25}
                        alt={formValues.id_icon}
                        className="mr-2"
                      />
                    </div>
                  </div>
                ) : (
                  "Pilih Icon"
                )}
              </button>

              {isOpen && (
                <ul className="flex absolute z-10 mt-1 w-full bg-slate-700 gap-3 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {idIconStatistic.map((icon) => (
                    <li
                      key={icon}
                      onClick={() => handleSelectIcon(icon)}
                      className="flex items-center p-2 cursor-pointer bg-slate-600 hover:bg-slate-500 transition-colors rounded-lg"
                    >
                      <Image
                        src={`/assets/icon/${icon}.png`}
                        width={25}
                        height={25}
                        alt={icon}
                        className="mr-2"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Value Input */}
          <div>
            <label
              htmlFor="value"
              className="block text-sm font-medium text-gray-700"
            >
              Value
            </label>
            <input
              name="value"
              value={formValues.value}
              onChange={handleInputChange}
              type="text"
              id="value"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Type Value Input */}
          <div>
            <label
              htmlFor="type_value"
              className="block text-sm font-medium text-gray-700"
            >
              Type Value
            </label>
            <input
              name="type_value"
              value={formValues.type_value}
              onChange={handleInputChange}
              type="text"
              id="type_value"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
