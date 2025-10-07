"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DetailsPageProps } from "@/features/team-selection/types";
import { PokemonSprites } from "@/features/team-selection/types";
import { Pokemon } from "@/features/team-selection/types";
import { useParams } from "next/navigation";

export default function DetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json())
        .then((data) => setPokemon(data));
    }
  }, [id]);

  if (!pokemon)
    return <p className="text-center mt-20 text-amber-200">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto text-amber-200/80">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={160}
          height={160}
          className="w-40 h-40 drop-shadow-lg"
        />
        <h1 className="text-4xl font-bold capitalize text-yellow-400 drop-shadow-lg">
          {pokemon.name}
        </h1>
      </div>

      {/* Types */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Types</h2>
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((t) => (
            <span
              key={t.slot}
              className="bg-gray-800/60 border border-yellow-400/40 px-3 py-1
                         rounded-full capitalize text-amber-200"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-400">
          Abilities
        </h2>
        <ul className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <li
              key={a.ability.name}
              className={`px-3 py-1 rounded-full capitalize font-medium border ${
                a.is_hidden
                  ? "bg-gray-700/60 border-gray-500 text-amber-200/60"
                  : "bg-gray-800/60 border-yellow-400/40 text-amber-200"
              }`}
            >
              {a.ability.name} {a.is_hidden ? "(Hidden)" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {pokemon.stats.map((s) => (
            <div
              key={s.stat.name}
              className="flex justify-between px-4 py-2 bg-gray-900/60 border border-yellow-500/20
                         backdrop-blur-md rounded-xl capitalize"
            >
              <span>{s.stat.name}</span>
              <span className="text-yellow-400 font-semibold">
                {s.base_stat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Moves */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Moves</h2>
        <div
          className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-yellow-500/20
                        rounded-lg bg-gray-900/40 backdrop-blur-md"
        >
          {pokemon.moves.map((m) => (
            <span
              key={m.move.name}
              className="bg-gray-800/60 border border-yellow-400/20 px-2 py-1 rounded-full
                         capitalize text-sm text-amber-200"
            >
              {m.move.name}
            </span>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div className="mb-4 flex gap-6">
        <div>
          <h3 className="font-semibold text-yellow-400">Height</h3>
          <p>{pokemon.height / 10} m</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Weight</h3>
          <p>{pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );
}
