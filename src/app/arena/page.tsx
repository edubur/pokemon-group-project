"use client";

import Link from "next/link";

const categories = ["water", "fire", "ice", "grass", "electric"];

export default function ArenaSelection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Choose Your Arena</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/arena/${cat}`}
            className="bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition text-center capitalize font-bold"
          >
            {cat} Arena
          </Link>
        ))}
      </div>
    </div>
  );
}
