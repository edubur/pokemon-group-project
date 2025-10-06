"use client";
import { useEffect, useState, useCallback } from "react";

export interface BattlePokemon {
  id: number;
  name: string;
  frontSprite: string;
  backSprite: string;
  moves: string[];
  hp: number;
  maxHp: number;
}

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

export function useBattleTeam() {
  const [team, setTeam] = useState<BattlePokemon[]>([]);

  const loadTeam = useCallback(async () => {
    const stored = localStorage.getItem("unsaved_team") || localStorage.getItem("team");
    if (!stored) return setTeam([]);

    try {
      const arr: { id: number; name: string; image: string }[] = JSON.parse(stored);

      const fullTeam: BattlePokemon[] = await Promise.all(
        arr.map(async (p) => {
          const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
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
        })
      );

      setTeam(fullTeam);
    } catch (err) {
      console.error("Failed to load team:", err);
    }
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  return { team, setTeam, reloadTeam: loadTeam };
}
