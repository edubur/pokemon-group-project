"use client";

import { use, useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import { useTeam } from "@/hooks/useTeam";

export default function ArenaPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params); // ✅ unwrap Next.js params
  const [opponentTeam, setOpponentTeam] = useState<any[]>([]);
  const { team } = useTeam();

  // 🎯 Fetch Pokémon of this type
  useEffect(() => {
    const fetchByType = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await res.json();

      const results = data.pokemon.map((p: any) => {
        const id = parseInt(p.pokemon.url.split("/").filter(Boolean).pop() || "0");
        return {
          id,
          name: p.pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      // 🎲 Pick 6 random Pokémon as opponent team
      const shuffled = [...results].sort(() => 0.5 - Math.random());
      setOpponentTeam(shuffled.slice(0, 6));
    };

    fetchByType();
  }, [type]);

  // 🎨 Arena background images
  const arenaBackgrounds: Record<string, string> = {
    water: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=1600&q=80')",
    fire: "url('https://images.unsplash.com/photo-1543005472-1b1d37fa4eae?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    ice: "url('https://plus.unsplash.com/premium_photo-1732783307875-7fea5e3eee27?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    grass: "url('https://images.unsplash.com/photo-1548445929-4f60a497f851?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    electric: "url('https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    default: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?fit=crop&w=1600&q=80')",
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative"
      style={{
        backgroundImage: arenaBackgrounds[type] || arenaBackgrounds.default,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-6 capitalize drop-shadow-lg">
          {type} Arena 🏟️
        </h1>

        {/* Arena Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* Opponent Team (left side) */}
          <div className="flex-1 bg-black/40 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Opponent Team</h2>
            <div className="grid grid-cols-3 gap-2">
              {opponentTeam.map((p) => (
                <div key={p.id} className="transform scale-90">
                  <PokemonCard pokemon={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Center Battle Button */}
          <div className="flex flex-col items-center justify-center">
            <button
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full text-xl shadow-lg transform hover:scale-105 transition"
              onClick={() => alert("⚔️ The battle begins!")}
            >
              Start Battle
            </button>
          </div>

          {/* User Team (right side) */}
          <div className="flex-1 bg-black/40 backdrop-blur-md p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Your Team</h2>
            {team.length === 0 ? (
              <p className="text-center text-gray-200">No Pokémon selected yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {team.map((p) => (
                  <div key={p.id} className="transform scale-90">
                    <PokemonCard pokemon={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
