"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { getCurrentSession } from "@/lib/session";

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password cannot be the same as old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    try {
      // const session = await getCurrentSession();
      setErrorMsg("");
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // id: session?.user?.id,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await response.json();
      console.log("Response from password reset:", data);
      if (response.status !== 200) {
        return setErrorMsg(data.message || "Failed to update password");
      }

      setIsSuccess(true);
      reset();
      router.push("/admin");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setErrorMsg(error?.message || "Failed to update password");
      setIsSuccess(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your old password and create a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isSuccess && (
              <Alert color="success">
                Password has been successfully updated.
              </Alert>
            )}

            {errorMsg && <Alert color="danger">{errorMsg}</Alert>}

            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium"
                >
                  Password Sekarang
                </label>
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Masukkan password kamu sekarang"
                  {...register("oldPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  {showOldPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-600">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium"
                >
                  Password Baru
                </label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Masukkan Password Baru"
                  {...register("newPassword")}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showNewPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium"
                >
                  Konfirmasi Password Baru
                </label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="Masukkan ulang password barunya"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <CardFooter className="px-0 pt-2 pb-0">
              <Button
                type="submit"
                color="primary"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memperbarui..." : "Perbarui Password"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
