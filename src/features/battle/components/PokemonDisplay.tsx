"use client";
import Image from "next/image";
import { BattlePokemon } from "../hooks/useBattleTeam";

interface PokemonDisplayProps {
  pokemon: BattlePokemon;
  side: "player" | "enemy";
}

export default function PokemonDisplay({ pokemon, side }: PokemonDisplayProps) {
  const hpPct = (pokemon.hp / pokemon.maxHp) * 100;
  const sprite = side === "player" ? pokemon.backSprite : pokemon.frontSprite;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="bg-white border-2 border-black rounded-lg p-2 shadow-md w-48">
        <div className="flex justify-between font-bold text-sm">
          <span className="text-black capitalize">{pokemon.name}</span>
          <span className="text-black">Lv 5</span>
        </div>
        <div className="w-full h-3 bg-gray-300 rounded mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-400" : "bg-red-500"
            }`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
        <div className="text-right text-xs text-black">
          {pokemon.hp}/{pokemon.maxHp}
        </div>
      </div>
      <div className="w-32 h-32 relative">
        {sprite ? (
          <Image src={sprite} alt={pokemon.name} fill style={{ objectFit: "contain" }} />
        ) : (
          <div className="text-gray-500">No image</div>
        )}
      </div>
    </div>
  );
}
