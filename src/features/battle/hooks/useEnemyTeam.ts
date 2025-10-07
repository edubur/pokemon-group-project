"use client";
import { useEffect, useState } from "react";
import { BattlePokemon, TypedPokemonInfo } from "@/features/game-logic/types";
import { fetchDetailedPokemon } from "@/shared/lib/pokemon/fetch-detailed-pokemon";
import { isFinalEvolution } from "../utils/utils";

/**
 * Dynamically generates an enemy Pokemon team for a given arena type.
 * Fetches type-specific Pokemon from the PokeAPI, filters for final
 * evolutions, randomizes the selection, and loads detailed battle data.
 */
export function useEnemyTeam(arenaType: string) {
  // Holds the finalized list of enemy Pokemon for battle
  const [enemyTeam, setEnemyTeam] = useState<BattlePokemon[]>([]);
  // Adds a loading state to inform the UI when the team is being fetched
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Async function to load enemy Pokemon when arenaType changes
    const loadEnemies = async () => {
      // Log the incoming arenaType for debugging on Vercel
      console.log("useEnemyTeam received arenaType:", arenaType);

      // Guard clause: If arenaType is missing or invalid, do nothing.
      if (!arenaType) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Step 1: Fetch all Pokemon associated with the given type
        const typeRes = await fetch(
          `https://pokeapi.co/api/v2/type/${arenaType}`
        );

        // Check if the API request was successful
        if (!typeRes.ok) {
          throw new Error(`Failed to fetch type data: ${typeRes.statusText}`);
        }

        const typeData = await typeRes.json();

        // Step 2: Build a list of typed Pokemon (limited to first 3 generations)
        const typedPokemonList: TypedPokemonInfo[] = typeData.pokemon
          .map((p: { pokemon: { name: string; url: string } }) => ({
            id: parseInt(p.pokemon.url.split("/").filter(Boolean).pop()!, 10),
            name: p.pokemon.name,
            // Convert URL to species URL for evolution lookup
            url: p.pokemon.url.replace("pokemon", "pokemon-species"),
          }))
          .filter((p: { id: number }) => p.id <= 386);

        // Step 3: Check which Pokemon are in their final evolution stage
        const evolutionChecks = await Promise.all(
          typedPokemonList.map((p) =>
            isFinalEvolution(p.url).then((isFinal) => ({ ...p, isFinal }))
          )
        );

        // Step 4: Filter for final evolutions only
        const finalEvolutions = evolutionChecks.filter((p) => p.isFinal);

        // Step 5: Randomize and pick up to 6 Pokemon for the enemy team
        const shuffled = finalEvolutions.sort(() => 0.5 - Math.random());
        const enemySelection = shuffled.slice(0, 6);

        // Extract their IDs for detailed fetching
        const enemyIds = enemySelection.map((p) => p.id);

        // Step 6: Fetch full Pokemon data for each selected enemy
        const enemies = await Promise.all(
          enemyIds.map((id) => fetchDetailedPokemon(id))
        );

        // Store the completed enemy team in state
        setEnemyTeam(enemies);
      } catch (error) {
        // Fallback: If anything fails, load 6 random Pokemon instead
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
      } finally {
        // Ensure loading is set to false after fetching is complete
        setIsLoading(false);
      }
    };

    // Run the enemy loading process
    loadEnemies();
  }, [arenaType]);

  // Return the team, a setter, and the loading state
  return { enemyTeam, setEnemyTeam, isLoading };
}
