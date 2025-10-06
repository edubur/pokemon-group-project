"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Pokemon } from "../types";
import { useTeam } from "../hooks/useTeam";
import { saveTeamAction } from "../actions";

import PokemonCard from "./PokemonCard";
import TeamBar from "./TeamBar";

const PAGE_SIZE = 50;

export default function TeamSelectionClient({
  initialTeam,
}: {
  initialTeam: Pokemon[];
}) {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState("");

  // Cache results from type specific fetches
  const typeCache = useRef<{ [key: string]: Pokemon[] }>({});

  const { team, addToTeam, removeFromTeam, hasUnsavedChanges, onSaveSuccess } =
    useTeam(initialTeam);
  const loader = useRef<HTMLDivElement | null>(null);

  // Fetch list of all Pokémon
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302");
      const data = await res.json();
      const results: Pokemon[] = data.results.map((p: any, index: number) => ({
        id: index + 1,
        name: p.name,
        url: p.url,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`,
      }));
      setAllPokemons(results);
      setDisplayedPokemons(results.slice(0, PAGE_SIZE));
      setOffset(PAGE_SIZE);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Fetch list of types for filter
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => {
        const filteredTypes = data.results
          .map((t: any) => t.name)
          .filter((t: string) => !["unknown", "shadow"].includes(t));
        setTypes(filteredTypes);
      });
  }, []);

  //  Handles what happens when user changes type filter
  useEffect(() => {
    if (!typeFilter) {
      setDisplayedPokemons(allPokemons.slice(0, PAGE_SIZE));
      setOffset(PAGE_SIZE);
      return;
    }

    // If a type is selected check the cache first
    if (typeCache.current[typeFilter]) {
      setDisplayedPokemons(typeCache.current[typeFilter]);
      return;
    }

    // If not in cache fetch data for that type
    const fetchByType = async () => {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`);
      const data = await res.json();
      const results: Pokemon[] = data.pokemon.map((p: any) => {
        const id = parseInt(
          p.pokemon.url.split("/").filter(Boolean).pop() || "0"
        );
        return {
          id,
          name: p.pokemon.name,
          url: p.pokemon.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      typeCache.current[typeFilter] = results; // Save to cache
      setDisplayedPokemons(results);
      setLoading(false);
    };

    fetchByType();
  }, [typeFilter, allPokemons]);

  // Final filtering logic for search input
  const searchedPokemons = useMemo(() => {
    return displayedPokemons.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, displayedPokemons]);

  // Infinite scroll logic
  const loadMore = () => {
    if (loading || typeFilter || offset >= allPokemons.length) return;
    const nextBatch = allPokemons.slice(offset, offset + PAGE_SIZE);
    setDisplayedPokemons((prev) => [...prev, ...nextBatch]);
    setOffset((prev) => prev + PAGE_SIZE);
  };

  useEffect(() => {
    if (typeFilter) return; // Disable infinite scroll if a type is selected
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [offset, typeFilter]);

  const handleSaveTeam = async () => {
    try {
      const pokemonIds = team.map((p) => p.id);
      const result = await saveTeamAction(pokemonIds);

      if (result.success) {
        alert(result.message);
        onSaveSuccess();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 mb-24">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="select select-bordered w-full md:w-1/4"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-center">Loading Pokémon...</p>}

      {!loading && searchedPokemons.length === 0 && (
        <p className="text-center">No Pokémon found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {searchedPokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onSelect={addToTeam} />
        ))}
      </div>

      <div ref={loader} className="h-16 flex justify-center items-center mt-4">
        {!typeFilter && !loading && offset < allPokemons.length && (
          <span>Loading more...</span>
        )}
      </div>

      <TeamBar
        team={team}
        onRemove={removeFromTeam}
        onSave={handleSaveTeam}
        hasUnsavedChanges={hasUnsavedChanges}
      />
    </div>
  );
}
