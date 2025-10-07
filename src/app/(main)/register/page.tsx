import { getSession } from "@/shared/lib/session/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/gamehub");
  }

  return <RegisterForm />;
}
