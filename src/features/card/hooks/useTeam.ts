"use client"; // ensure this hook is treated as client-side

import { useState, useEffect } from "react";
import { Pokemon } from "../features/card/type/types";

export function useTeam() {
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Load from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem("team");
    if (saved) {
      setTeam(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever team changes
  useEffect(() => {
    if (team.length > 0) {
      localStorage.setItem("team", JSON.stringify(team));
    } else {
      localStorage.removeItem("team");
    }
  }, [team]);

  const addToTeam = (pokemon: Pokemon) => {
    setTeam(prev => {
      if (prev.length < 6 && !prev.find(p => p.id === pokemon.id)) {
        return [...prev, pokemon];
      }
      return prev;
    });
  };

  const removeFromTeam = (id: number) => {
    setTeam(prev => prev.filter(p => p.id !== id));
  };

  return { team, addToTeam, removeFromTeam };
}
