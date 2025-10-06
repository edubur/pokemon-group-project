import { prisma } from "@/shared/lib/prisma/prisma";
import { Pokemon } from "@/features/team-selection/types";
import { getSession } from "@/shared/lib/session/session";

// Fetch Pokémon details from PokeAPI
export async function fetchPokemonDetails(ids: number[]): Promise<Pokemon[]> {
  if (ids.length === 0) return [];

  const requests = ids.map((id) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
  );

  const results = await Promise.all(requests);

  return results.map((p) => ({
    id: p.id,
    name: p.name,
    url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
    image: p.sprites.front_default || "",
  }));
}

// Fetch current user by session
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({ where: { id: session.userId } });
}

// Fetch top leaderboard entries
export async function getLeaderboardTop(limit = 5) {
  return prisma.leaderboardEntry.findMany({
    orderBy: { score: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, username: true, avatarUrl: true } },
    },
  });
}

// Fetch personal best and rank
export async function getPersonalBestAndRank(userId: number) {
  let personalBest = 0;
  let rank: number | string = "Unranked";

  const entry = await prisma.leaderboardEntry.findFirst({
    where: { userId },
    orderBy: { score: "desc" },
  });

  if (entry) {
    personalBest = entry.score;

    const higherScoresCount = await prisma.leaderboardEntry.count({
      where: { score: { gt: personalBest } },
    });
    rank = higherScoresCount + 1;
  }

  return { personalBest, rank };
}

// Fetch the user's team
export async function getUserTeam(
  user: { roster?: number[] } | null
): Promise<Pokemon[]> {
  if (!user?.roster || user.roster.length === 0) return [];
  return fetchPokemonDetails(user.roster);
}
