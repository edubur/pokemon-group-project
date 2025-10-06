"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "../types";

export function useTeam(initialTeam: Pokemon[]) {
  const [team, setTeam] = useState<Pokemon[]>(initialTeam);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load from localStorage after mount
  useEffect(() => {
    const savedUnsavedTeam = localStorage.getItem("unsaved_team");
    if (savedUnsavedTeam) {
      setTeam(JSON.parse(savedUnsavedTeam));
    }
  }, []); // Empty dependency array ensures this runs only once

  // Monitor changes and update localStorage
  useEffect(() => {
    const initialTeamIds = initialTeam
      .map((p) => p.id)
      .sort()
      .toString();

    const currentTeamIds = team
      .map((p) => p.id)
      .sort()
      .toString();

    if (initialTeamIds !== currentTeamIds) {
      localStorage.setItem("unsaved_team", JSON.stringify(team));
      setHasUnsavedChanges(true);
    } else {
      localStorage.removeItem("unsaved_team");
      setHasUnsavedChanges(false);
    }
  }, [team, initialTeam]);

  const addToTeam = (pokemon: Pokemon) => {
    setTeam((prev) => {
      if (prev.length < 6 && !prev.find((p) => p.id === pokemon.id)) {
        return [...prev, pokemon];
      }
      return prev;
    });
  };

  const removeFromTeam = (id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  };

  // Function to call after save
  const onSaveSuccess = () => {
    localStorage.removeItem("unsaved_team");
    setHasUnsavedChanges(false);
  };

  return { team, addToTeam, removeFromTeam, hasUnsavedChanges, onSaveSuccess };
}
