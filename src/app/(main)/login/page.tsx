import { getSession } from "@/shared/lib/session/session";
import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/gamehub");
  }

  return <LoginForm />;
}
