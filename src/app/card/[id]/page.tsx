"use client";

import { useEffect, useState, use } from "react";

interface DetailsPageProps {
  params: Promise<{ id: string }>;
}

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string; other: any };
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
  height: number;
  weight: number;
}

export default function DetailsPage({ params }: DetailsPageProps) {
  const { id } = use(params); // unwrap the promise
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, [id]);

  if (!pokemon) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Name & Sprite */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-40 h-40"
        />
        <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
      </div>

      {/* Types */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Types</h2>
        <div className="flex gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t.slot}
              className="bg-blue-200 px-3 py-1 rounded-full capitalize font-medium"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Abilities</h2>
        <ul className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <li
              key={a.ability.name}
              className={`px-3 py-1 rounded-full capitalize font-medium ${
                a.is_hidden ? "bg-gray-300" : "bg-green-300"
              }`}
            >
              {a.ability.name} {a.is_hidden ? "(Hidden)" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {pokemon.stats.map((s) => (
            <div
              key={s.stat.name}
              className="flex justify-between px-4 py-2 bg-gray-200 rounded-xl capitalize"
            >
              <span>{s.stat.name}</span>
              <span>{s.base_stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Moves */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Moves</h2>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
          {pokemon.moves.map((m) => (
            <span
              key={m.move.name}
              className="bg-yellow-200 px-2 py-1 rounded-full capitalize text-sm"
            >
              {m.move.name}
            </span>
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div className="mb-4 flex gap-6">
        <div>
          <h3 className="font-semibold">Height</h3>
          <p>{pokemon.height / 10} m</p>
        </div>
        <div>
          <h3 className="font-semibold">Weight</h3>
          <p>{pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );
}
