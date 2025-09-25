import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="ml-10 mt-10 text-xl">
        Links here are just for functional/testing reasons will be changed
        later.
      </div>
      <Link
        href="/register"
        className="ml-8 mt-8 inline-block bg-transparent px-3 py-3 font-medium text-white transition-transform hover:scale-105"
      >
        Register
      </Link>
      <Link
        href="/login"
        className="ml-8 mt-8 inline-block bg-transparent px-3 py-3 font-medium text-white transition-transform hover:scale-105"
      >
        Login
      </Link>
      <Link
        href="/settings"
        className="ml-8 mt-8 inline-block bg-transparent px-3 py-3 font-medium text-white transition-transform hover:scale-105"
      >
        Settings
      </Link>
    </div>
  );
}
