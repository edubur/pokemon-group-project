import Link from "next/link";

export default function Home() {
  return (
    <div className="relative p-8">
      {/* Background */}
      <div
        className="absolute inset-0 z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/background.png")',
          filter: "blur(35px)",
        }}
      ></div>
      {/* Semi transparent Overlay */}
      <div className="absolute inset-0 z-20 bg-black opacity-60"></div>{" "}
      {/* Golden flairs */}
      <div className="absolute inset-0 z-30">
        <div className="absolute inset-0 bg-gradient-to-br via-yellow-500/10 opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tl via-orange-500/10 opacity-50"></div>
      </div>
      {/* Settings Icon */}
      <div className="absolute top-0 right-0 z-50 p-6 sm:p-8">
        <Link
          href="/settings"
          className="text-white transition-colors hover:text-yellow-400"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
      {/* Main Content */}
      <div className="relative z-40 flex flex-col items-center min-h-screen p-8">
        {/* Title */}
        <h1 className="text-6xl font-extrabold mb-10 text-yellow-400">
          Placeholder
        </h1>
        <p className="font-extrabold mb-10 text-yellow-400 w-180 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta natus
          distinctio fugiat numquam dolores ad laborum ex nostrum magni
          exercitationem suscipit pariatur, quam explicabo? Ullam esse velit
          tenetur deleniti error.
        </p>
        <p className="font-extrabold mb-10 text-yellow-400 w-180 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta natus
          distinctio fugiat numquam dolores ad laborum ex nostrum magni
          exercitationem suscipit pariatur, quam explicabo? Ullam esse velit
          tenetur deleniti error.
        </p>
        {/* Login (placeholder will not stay there) */}
        <div className="">
          <Link
            href="/login"
            className="inline-block px-6 py-3 border-2 border-yellow-400 rounded-lg font-medium text-yellow-400 text-lg transition-all hover:scale-105"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
