import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const jar = await cookies();
  const isAdmin = isValidSessionToken(jar.get(ADMIN_COOKIE)?.value);

  if (!isAdmin) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
