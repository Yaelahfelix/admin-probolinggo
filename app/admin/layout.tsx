import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminLayout from "./adminLayout";

export default async function RootLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();
  console.log(user);
  if (user === null) {
    console.log(user, "from page");
    return redirect("/login");
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
