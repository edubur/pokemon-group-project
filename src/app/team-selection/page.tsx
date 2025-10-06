import { getSession } from "@/shared/lib/session/session";
import { prisma } from "@/shared/lib/prisma/prisma";
import { Pokemon } from "@/features/team-selection/types";
import TeamSelectionClient from "@/features/team-selection/components/TeamSelectionComponent";

async function fetchPokemonDetails(ids: number[]): Promise<Pokemon[]> {
  if (ids.length === 0) return [];

  const requests = ids.map((id) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
  );

  const results = await Promise.all(requests);

  // Map the results to Pokemon type
  return results.map((p) => ({
    id: p.id,
    name: p.name,
    url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
    image: p.sprites.front_default || "Placeholder.png", // Fallback for missing images
  }));
}

export default async function TeamSelectionPage() {
  const session = await getSession();
  let initialTeam: Pokemon[] = [];

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { roster: true },
    });

    if (user?.roster && user.roster.length > 0) {
      initialTeam = await fetchPokemonDetails(user.roster);
    }
  }

  return <TeamSelectionClient initialTeam={initialTeam} />;
}
