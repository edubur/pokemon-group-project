"use client";
import { useEffect, useState } from "react";
import { BattlePokemon } from "./useBattleTeam";

interface PokemonMoveVersionGroupDetail {
  move_learn_method: { name: string };
  level_learned_at: number;
}

interface PokemonMove {
  move: { name: string; url: string };
  version_group_details: PokemonMoveVersionGroupDetail[];
}

interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
}

interface PokemonAPIResponse {
  id: number;
  name: string;
  sprites: PokemonSprites;
  moves: PokemonMove[];
}

export function useEnemyTeam() {
  const [enemyTeam, setEnemyTeam] = useState<BattlePokemon[]>([]);

  useEffect(() => {
    const loadEnemies = async () => {
      const promises = Array.from({ length: 6 }, async (_, i) => {
        const id = i + 1; // first 6 Pokémon
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data: PokemonAPIResponse = await resp.json();

        const moves = data.moves
          .filter((mv) =>
            mv.version_group_details.some(
              (vg) => vg.move_learn_method.name === "level-up"
            )
          )
          .map((mv) => mv.move.name);

        const selected = moves.slice(0, 4);
        while (selected.length < 4) selected.push("struggle");

        return {
          id: data.id,
          name: data.name,
          frontSprite: data.sprites.front_default ?? "",
          backSprite: data.sprites.back_default ?? "",
          moves: selected,
          hp: 50,
          maxHp: 50,
        } as BattlePokemon;
      });

      const enemies = await Promise.all(promises);
      setEnemyTeam(enemies);
    };

    loadEnemies();
  }, []);

  return { enemyTeam, setEnemyTeam };
}
