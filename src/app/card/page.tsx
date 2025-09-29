"use client";

import { useEffect, useState, useRef } from "react";
import PokemonCard from "@/components/PokemonCard";
import TeamBar from "@/components/TeamBar";
import { useTeam } from "@/hooks/useTeam";
import { Pokemon } from "@/types";

const PAGE_SIZE = 50; // number of Pokémon per batch

export default function Home() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [displayPokemons, setDisplayPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const typeCache = useRef<{ [key: string]: Pokemon[] }>({}); // cache for type results

  const { team, addToTeam, removeFromTeam } = useTeam();
  const loader = useRef<HTMLDivElement | null>(null);

  // Fetch all Pokémon metadata once
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
      );
      const data = await res.json();
      const results: Pokemon[] = data.results.map((p: any, index: number) => ({
        id: index + 1,
        name: p.name,
        url: p.url,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      }));
      setAllPokemons(results);
      setDisplayPokemons(results.slice(0, PAGE_SIZE));
      setOffset(PAGE_SIZE);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Fetch Pokémon types for dropdown
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => setTypes(data.results.map((t: any) => t.name)));
  }, []);

  // Load more Pokémon (infinite scroll or button)
  const loadMore = () => {
    setDisplayPokemons((prev) => [
      ...prev,
      ...allPokemons.slice(offset, offset + PAGE_SIZE),
    ]);
    setOffset((prev) => prev + PAGE_SIZE);
  };

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && offset < allPokemons.length) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, offset, allPokemons.length]);

  // Filter Pokémon by type and name
  const filteredPokemons = (() => {
    if (!typeFilter) {
      return displayPokemons.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // If type is selected
    if (typeCache.current[typeFilter]) {
      // use cached type result
      return typeCache.current[typeFilter].filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Fetch Pokémon for this type
    fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`)
      .then((res) => res.json())
      .then((data) => {
        const pokemonsOfType: Pokemon[] = data.pokemon.map((p: any) => {
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
        typeCache.current[typeFilter] = pokemonsOfType;
        setDisplayPokemons(pokemonsOfType.slice(0, PAGE_SIZE));
        setOffset(PAGE_SIZE);
      });

    return []; // temporarily empty until fetch completes
  })();

  // Save team
  const saveTeam = async () => {
    await fetch("/api/save-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });
    alert("Team saved!");
  };

  return (
    <div className="p-6">
      {/* Search + Type filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-xl border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-1/4 p-3 rounded-xl border shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Pokémon grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPokemons.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onSelect={addToTeam} />
        ))}
      </div>

      {/* Loader */}
      <div ref={loader} className="h-16 flex justify-center items-center mt-4">
        {loading && <span>Loading...</span>}
      </div>

      {/* Load more button */}
      {!loading && !typeFilter && offset < allPokemons.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Team bar */}
      <TeamBar team={team} onRemove={removeFromTeam} onSave={saveTeam} />
    </div>
  );
}
