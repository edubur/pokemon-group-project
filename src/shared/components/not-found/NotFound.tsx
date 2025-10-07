import Link from "next/link";
import Navbar from "../navbar/components/NavBar";
import Background from "../ui/Background";
import { getSession } from "@/shared/lib/session/session";

export default async function NotFoundComponent() {
  const session = await getSession();
  return (
    <>
      <Navbar isLoggedIn={!!session} />
      <Background />
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8 z-40">
        <div className="max-w-2xl mx-auto p-8 bg-gray-900/60 border border-yellow-500/20 rounded-xl shadow-xl backdrop-blur-sm text-center text-amber-200/80">
          {/* Heading */}
          <h1 className="text-6xl font-bold text-yellow-400 md:text-9xl">
            404
          </h1>
          {/* Info text */}
          <h2 className="mt-4 text-2xl font-semibold text-amber-200/70 md:text-3xl">
            Oops! Page Not Found.
          </h2>
          {/* Info text */}
          <p className="mt-2 text-base text-amber-200/70">
            We can&apos;t seem to find the page you&apos;re looking for.
          </p>
          {/* Link back to homepage */}
          <Link
            href="/"
            className="mt-8 inline-block rounded-2xl bg-amber-200/70 px-6 py-3 text-lg font-bold text-gray-900 shadow-md transition-transform hover:scale-105 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Return Home
          </Link>
        </div>
      </main>
    </>
  );
}
