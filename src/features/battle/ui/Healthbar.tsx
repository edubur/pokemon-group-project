import { BattlePokemon } from "@/features/game-logic/types";
import { capitalize } from "../utils/utils";

// Displays the HP bar for a Pokemon during battle
// Shows the Pokemons name, level and dynamic HP bar that
// visually updates as damage is taken
export default function HealthBar({
  pokemon,
  side,
}: {
  pokemon: BattlePokemon;
  side: "player" | "enemy";
}) {
  const hpPct = (pokemon.hp / pokemon.maxHp) * 100;

  // Dynamic HP color
  const hpColor =
    hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-400" : "bg-red-500";

  // Position next to sprite — responsive & mirrored per side
  const positionClass =
    side === "player"
      ? "absolute bottom-[-30%] right-[-150%]" // moved down and right
      : "absolute top-[5%] left-[-190%]"; // enemy bar near top-left

  return (
    <div
      className={`flex flex-col items-center absolute ${positionClass} z-20 
                  bg-gray-900/70 border border-yellow-400/80 rounded-xl 
                  shadow-md backdrop-blur-md text-amber-200 
                  w-48 sm:w-56 md:w-64 p-2 sm:p-3`}
    >
      {/* Name + Level */}
      <div className="flex justify-between items-center w-full text-yellow-400 text-sm sm:text-base font-bold">
        <span>{capitalize(pokemon.name)}</span>
        <span>Lv.80</span>
      </div>

      {/* HP Bar */}
      <div className="flex items-center gap-2 w-full mt-1 sm:mt-2">
        <span className="text-[10px] sm:text-xs font-bold text-amber-200">HP</span>
        <div className="flex-1 h-2 sm:h-3 bg-gray-700 rounded-full border border-yellow-400/20">
          <div
            className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>

      {/* Numeric HP */}
      <div className="mt-1 w-full text-xs sm:text-sm font-semibold text-right text-amber-200">
        {pokemon.hp}/{pokemon.maxHp}
      </div>
    </div>
  );
}