import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { getCurrentSession } from "@/lib/session";
import type { SessionValidationResult } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { session, user }: SessionValidationResult = await getCurrentSession();
  if (session !== null) {
    return redirect("/");
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Web Admin PDAM Probolinggo
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
