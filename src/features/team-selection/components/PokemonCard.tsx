"use client";

import { Pokemon } from "../types";
import Link from "next/link";

interface Props {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onSelect }: Props) {
  return (
    <div className="bg-gray-900/60 border border-yellow-500/20 rounded-2xl shadow-xl p-4 backdrop-blur-md transition hover:scale-105 cursor-pointer">
      <Link href={`/team-selection/${pokemon.id}`}>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-32 mx-auto drop-shadow-lg"
        />
        <h2 className="mt-2 text-xl font-bold text-center capitalize text-yellow-400">
          {pokemon.name}
        </h2>
      </Link>
      {onSelect && (
        <button
          onClick={() => onSelect(pokemon)}
          className="mt-3 w-full bg-amber-200/70 text-gray-900 rounded-xl py-2 font-semibold
                     hover:bg-yellow-400 transition"
        >
          Add to Team
        </button>
      )}
    </div>
  );
}
