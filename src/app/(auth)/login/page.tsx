import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { dashboardForRole } from "@/lib/auth/permissions";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect(dashboardForRole(session.user.role));

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <LoginForm />
    </main>
  );
}