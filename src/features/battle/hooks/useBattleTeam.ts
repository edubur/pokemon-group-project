"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchDetailedPokemon } from "@/shared/lib/pokemon/fetch-detailed-pokemon";
import { BattlePokemon } from "@/features/game-logic/types";

// Handles loading the players Pokemon team from localStorage,
// fetching their full data, and giving it to battle scene
export function useBattleTeam() {
  const [team, setTeam] = useState<BattlePokemon[]>([]); // Current player team state

  // Load and build the players team from localStorage
  const loadTeam = useCallback(async () => {
    // Gets saved team prefers unsaved team (temporary changes)
    const stored =
      localStorage.getItem("unsaved_team") || localStorage.getItem("team");
    // If nothing is saved clear team
    if (!stored) return setTeam([]);

    try {
      // Parses saved team list
      const arr: { id: number }[] = JSON.parse(stored);

      // Fetches detailed Pokemon data for each member
      const fullTeam = await Promise.all(
        arr.map((p) => fetchDetailedPokemon(p.id))
      );

      // Stores detailed team in state
      setTeam(fullTeam);
    } catch (err) {
      console.error("Failed to load team:", err);
    }
  }, []);

  // Automatically loads team when the hook mounts
  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  return { team, setTeam, reloadTeam: loadTeam };
}
