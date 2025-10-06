import Link from "next/link";
import { logout } from "@/features/auth/actions";
import type { getSession } from "@/shared/lib/session/session";

type SettingsPageProps = {
  session: Awaited<ReturnType<typeof getSession>>;
};

export default function SettingsPageComponent({ session }: SettingsPageProps) {
  // If user is not logged in show access denied message
  if (!session) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center z-40">
        {/* Heading */}
        <h1 className="mb-4 text-2xl font-bold text-yellow-400">
          Access Denied
        </h1>
        {/* Info text */}
        <p className="mb-8 text-amber-200/70">
          You need to login first to access your settings.
        </p>
        {/* Link back to homepage */}
        <Link
          href="/"
          className="inline-block bg-amber-200/70 px-4 py-3 rounded-2xl font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  // If user is logged in show settings page
  return (
    <div className="relative min-h-screen z-40 mx-auto w-full max-w-2xl p-4 sm:p-6 md:p-8">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-yellow-400">
          Settings
        </h1>
        <p className="mt-2 text-lg text-amber-200/70">Placeholder.</p>
      </header>

      {/* Logout form */}
      <form action={logout} className="w-full">
        <button
          type="submit"
          className="w-full rounded-2xl bg-amber-200/70 px-6 py-3 text-xl font-bold text-gray-900 transition-transform hover:scale-105 hover:bg-yellow-400 active:scale-95"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
