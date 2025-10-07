"use client";
import { useEffect, useState } from "react";
import { BattlePokemon, TypedPokemonInfo } from "@/features/game-logic/types";
import { fetchDetailedPokemon } from "@/shared/lib/pokemon/fetch-detailed-pokemon";
import { isFinalEvolution } from "../utils/utils";

/**
 * Dynamically generates enemy Pokemon team for a given arena type
 * Fetches type specific Pokemon from the PokeAPI filters only
 * final evolutions, randomizes, and loads detailed data
 */
export function useEnemyTeam(arenaType: string) {
  // Holds the finalized list of enemy Pokemon for battle
  const [enemyTeam, setEnemyTeam] = useState<BattlePokemon[]>([]);

  useEffect(() => {
    // Async function to load enemy Pokemon when arena type changes
    const loadEnemies = async () => {
      // If arena type is missing skip
      if (!arenaType) return;

      try {
        // Step 1: Fetch all Pokemon associated with given type
        const typeRes = await fetch(
          `https://pokeapi.co/api/v2/type/${arenaType}`
        );
        const typeData = await typeRes.json();

        // Step 2: Builds typed Pokemon list (limited to first 3 generations)
        const typedPokemonList: TypedPokemonInfo[] = typeData.pokemon
          .map((p: { pokemon: { name: string; url: string } }) => ({
            id: parseInt(p.pokemon.url.split("/").filter(Boolean).pop()!, 10),
            name: p.pokemon.name,
            // Converts to Pokemon species URL for evolution lookup
            url: p.pokemon.url.replace("pokemon", "pokemon-species"),
          }))
          .filter((p: { id: number }) => p.id <= 386);

        // Step 3: Checks which Pokemon are in their final evolution stage
        const evolutionChecks = await Promise.all(
          typedPokemonList.map((p) =>
            isFinalEvolution(p.url).then((isFinal) => ({ ...p, isFinal }))
          )
        );

        // Step 4: Filters out only final evolutions
        const finalEvolutions = evolutionChecks.filter((p) => p.isFinal);

        // Step 5: Randomizes and picks 6 Pokemon for enemy team
        const shuffled = finalEvolutions.sort(() => 0.5 - Math.random());
        const enemySelection = shuffled.slice(0, 6);

        // Extracts their IDs for detailed fetching
        const enemyIds = enemySelection.map((p) => p.id);

        // Step 6: Fetches full Pokemon data for each selected enemy
        const enemies = await Promise.all(
          enemyIds.map((id) => fetchDetailedPokemon(id))
        );

        // Stores the completed enemy team in state
        setEnemyTeam(enemies);
      } catch (error) {
        // Fallback if anything fails loads 6 random Pokemon instead
        console.error(
          `Failed to load evolved enemies for type ${arenaType}:`,
          error
        );
        const randomIds = Array.from(
          { length: 6 },
          () => Math.floor(Math.random() * 386) + 1 // Random Gen 1–3 Pokemon
        );
        const enemies = await Promise.all(
          randomIds.map((id) => fetchDetailedPokemon(id))
        );
        setEnemyTeam(enemies);
      }
    };

    // Runs enemy loading process
    loadEnemies();
  }, [arenaType]);

  return { enemyTeam, setEnemyTeam };
}
