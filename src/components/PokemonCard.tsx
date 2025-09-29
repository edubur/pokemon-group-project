"use client";

import { Pokemon } from "../types";
import Link from "next/link";

interface Props {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onSelect }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 hover:scale-105 transition cursor-pointer">
      <Link href={`/card/${pokemon.id}`}>
        <img src={pokemon.image} alt={pokemon.name} className="w-32 mx-auto" />
        <h2 className="text-xl font-bold text-center capitalize">{pokemon.name}</h2>
      </Link>
      {onSelect && (
        <button
          onClick={() => onSelect(pokemon)}
          className="mt-2 w-full bg-blue-500 text-white rounded-xl py-1"
        >
          Add to Team
        </button>
      )}
    </div>
  );
}
