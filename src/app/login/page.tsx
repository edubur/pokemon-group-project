import { getSession } from "@/shared/lib/session/session";
import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";

// Login page
export default async function LoginPage() {
  // Check if user has an active session
  const session = await getSession();

  // If user is logged in redirect to game page
  if (session) {
    redirect("/gamehub");
  }

  // If no active session render login form
  return <LoginForm />;
}
