import { BattlePokemon } from "@/features/battle/hooks/useBattleTeam";
import { calculateStat } from "@/features/battle/lib/mechanics";

interface PokeApiStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

type CalculatedStat = {
  name: string;
  value: number;
};

const BATTLE_LEVEL = 80;

export async function fetchDetailedPokemon(id: number): Promise<BattlePokemon> {
  const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemonData = await pokemonRes.json();

  const stats: CalculatedStat[] = pokemonData.stats.map((s: PokeApiStat) => ({
    name: s.stat.name,
    value: calculateStat(s.base_stat, BATTLE_LEVEL, s.stat.name),
  }));

  const maxHp = stats.find((s) => s.name === "hp")?.value || 100;

  // Fetches details for each move
  const moveDetails = await Promise.all(
    pokemonData.moves
      .filter((m: any) =>
        m.version_group_details.some(
          (vgd: any) =>
            vgd.move_learn_method.name === "level-up" &&
            vgd.version_group.name === "emerald"
        )
      )
      .map(async (m: any) => {
        const moveRes = await fetch(m.move.url);
        return moveRes.json();
      })
  );

  // Selects the 4 best damaging moves
  const selectedMoves = moveDetails
    .filter((md) => md.power) // Only damaging moves
    .sort((a, b) => b.power - a.power) // Sort by power
    .slice(0, 4);

  // If less than 4 moves adds tackle as fallback
  while (selectedMoves.length < 4) {
    const tackleRes = await fetch(`https://pokeapi.co/api/v2/move/tackle/`);
    selectedMoves.push(await tackleRes.json());
  }

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    frontSprite: pokemonData.sprites.front_default ?? "",
    backSprite: pokemonData.sprites.back_default ?? "",
    animatedSprite: `https://play.pokemonshowdown.com/sprites/ani/${pokemonData.name}.gif`,
    animatedBackSprite: `https://play.pokemonshowdown.com/sprites/ani-back/${pokemonData.name}.gif`,
    moves: selectedMoves,
    maxHp: maxHp,
    hp: maxHp,
    stats: stats,
    types: pokemonData.types,
  };
}
