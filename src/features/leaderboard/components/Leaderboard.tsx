"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "../actions";

interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  createdAt: string;
  avatarUrl?: string | null;
}

type SortKey = "place" | "username" | "score" | "date";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getLeaderboard();
      setEntries(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const sortedEntries = [...entries].sort((a, b) => {
    switch (sortKey) {
      case "username":
        return sortAsc
          ? a.username.localeCompare(b.username)
          : b.username.localeCompare(a.username);
      case "score":
        return sortAsc ? a.score - b.score : b.score - a.score;
      case "date":
        return sortAsc
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black/90 text-white px-6 py-16">
      <h1 className="mb-10 text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-[0_0_15px_rgba(255,200,0,0.5)]">
        🏆 Leaderboard
      </h1>

      <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md rounded-3xl border border-yellow-500/20 shadow-[0_0_40px_rgba(255,200,0,0.2)] p-6">
        {loading ? (
          <p className="text-yellow-200/70 text-lg text-center animate-pulse">
            Loading scores...
          </p>
        ) : entries.length === 0 ? (
          <p className="text-gray-300 text-center text-lg">
            No scores yet — be the first to enter the arena!
          </p>
        ) : (
          <table className="w-full table-auto text-left border-separate border-spacing-y-2">
  <thead>
    <tr className="border-b border-yellow-400/20">
      <th
        className="px-4 py-2 text-right cursor-pointer"
        onClick={() => handleSort("place")}
      >
        #
      </th>
      <th
        className="px-4 py-2 cursor-pointer"
        onClick={() => handleSort("username")}
      >
        <div className="flex items-center gap-3">Player</div>
      </th>
      <th
        className="px-4 py-2 cursor-pointer"
        onClick={() => handleSort("score")}
      >
        Points
      </th>
      <th
        className="px-4 py-2 cursor-pointer"
        onClick={() => handleSort("date")}
      >
        Date
      </th>
    </tr>
  </thead>
  <tbody>
    {sortedEntries.map((entry, index) => (
      <tr
        key={entry.id}
        className={`transition-transform duration-200 ${
          index === 0
            ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/20 scale-[1.02] border border-yellow-400/40 shadow-lg"
            : "hover:bg-yellow-500/10"
        }`}
      >
        <td className="px-4 py-2 font-bold text-yellow-400 text-right">
          {index + 1}
        </td>
        <td className="px-4 py-2 flex items-center gap-3">
          {entry.avatarUrl && (
            <img
              src={entry.avatarUrl}
              alt={entry.username}
              className="w-8 h-8 rounded-full object-cover border border-yellow-400/30"
            />
          )}
          <span className="font-semibold text-amber-100">
            {entry.username || "Anonymous"}
          </span>
        </td>
        <td className="px-4 py-2 font-mono text-yellow-300">{entry.score}</td>
        <td className="px-4 py-2 text-amber-200/70">
          {new Date(entry.createdAt).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>

      <p className="mt-10 text-amber-200/60 text-sm">
        Can you claim the <span className="text-yellow-400 font-bold">#1</span>{" "}
        spot?
      </p>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.1),transparent_70%)]" />
    </div>
  );
}
