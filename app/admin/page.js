import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySession } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { hasDatabase } from "@/lib/mongodb";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await verifySession((await cookies()).get(COOKIE)?.value);
  if (!session) redirect("/admin/login");
  return <AdminDashboard session={{ email: session.email, role: session.role, name: session.name }} database={hasDatabase} />;
}
