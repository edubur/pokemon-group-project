import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "../actions"; // Server action to log out user

// Make the page component async to check for the session
export default async function SettingsPage() {
  const session = await getSession();

  // If there is no active session, render access denied view
  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="mb-8">You need to login first to access your settings.</p>
        <Link
          href="/"
          className="inline-block bg-transparent px-3 py-3 font-medium text-white transition-transform hover:scale-105"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  // If a session exists, render settings page
  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-lg text-gray-400">
          Manage your account and privacy settings.
        </p>
      </header>

      {/* Settings options list */}
      <div className="flex flex-col gap-2">
        {/* Navigate to account setting */}
        <Link
          href="/settings/account"
          className="w-full rounded-lg bg-base-200 p-4 text-left transition-colors active:bg-base-300"
        >
          Account Settings
        </Link>

        {/* Navigate to privacy settings */}
        <Link
          href="/settings/privacy"
          className="w-full rounded-lg bg-base-200 p-4 text-left transition-colors active:bg-base-300"
        >
          Privacy
        </Link>

        {/* Logout button uses server action */}
        <form action={logout} className="w-full">
          <button
            type="submit"
            className="w-full rounded-lg bg-base-200 p-4 text-left transition-colors active:bg-error active:text-error-content"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
