"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavbarProps } from "@/shared/components/navbar/types";

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Play", href: "/gamehub" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Team Builder", href: "/team-selection" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-gray-900/60 border-b border-yellow-400/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-yellow-400 tracking-wide drop-shadow-lg hover:text-yellow-300 transition"
        >
          Pokémon Arena
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-amber-200/80 hover:text-yellow-400 font-medium transition ${
                pathname === link.href ? "text-yellow-400" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth / Settings */}
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <Link
              href="/login"
              className="rounded-2xl bg-amber-200/70 px-4 py-2 font-semibold text-gray-900 hover:bg-yellow-400 transition-transform hover:scale-105"
            >
              Login
            </Link>
          )}

          {/* Settings Icon */}
          <Link
            href="/settings"
            className="text-amber-200 hover:text-yellow-400 transition-colors"
            aria-label="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
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
      </div>
    </nav>
  );
}
