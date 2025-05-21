"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppConfiguration() {
  return (
    <main className="flex flex-col gap-5 justify-center content-center p-5">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Konfigurasi Aplikasi Tidham</CardTitle>
          <CardDescription>
            Dashboard untuk mengatur tampilan data di Aplikasi Tidham
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 flex justify-between items-center">
          <h3>Profile Perusahaan</h3>
          <Link href="/admin/app-configuration/profile">
            <Button>Edit</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
