import { getSession } from "@/shared/lib/session/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/features/auth/components/RegisterForm";

// Registration page
export default async function RegisterPage() {
  // Check for active session
  const session = await getSession();

  // If user is logged in redirect to game page
  if (session) {
    redirect("/gamehub");
  }

  // If no session show registration form
  return <RegisterForm />;
}
