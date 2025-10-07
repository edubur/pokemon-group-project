import { prisma } from "@/shared/lib/prisma/prisma";
import { createScore } from "./actions";

// metadata for SEO
export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  // fetch leaderboard entries ordered by score (descending)
  const rows = await prisma.leaderboardEntry.findMany({
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: 100,
  });

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-sm text-gray-500">
          Highest scores first. Submit your score after the battle.
        </p>
      </header>

      <section className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{row.username}</td>
                <td className="px-3 py-2">{row.score}</td>
                <td className="px-3 py-2">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}