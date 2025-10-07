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
  // Calculates HP percentage for width of health bar
  const hpPct = (pokemon.hp / pokemon.maxHp) * 100;

  // Positions health bars differently for player and enemy
  const positionClass =
    side === "player" ? "top-[150px] left-[100%]" : "top-[200px] right-[80%]";

  // Chooses the HP bar color based on remaining HP
  const hpColor =
    hpPct > 50 ? "bg-green-500" : hpPct > 20 ? "bg-yellow-400" : "bg-red-500";

  return (
    // Health bar
    <div
      className={`absolute p-3 bg-gray-900/70 border border-yellow-400/80 rounded-xl shadow-lg
                  backdrop-blur-md text-amber-200 w-64 ${positionClass}`}
    >
      {/* Pokemon name and level */}
      <div className="flex justify-between items-center text-yellow-400 text-lg font-bold">
        <span>{capitalize(pokemon.name)}</span>
        <span>Lv.80</span>
      </div>
      {/* HP label and bar */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-bold text-amber-200">HP</span>
        {/* HP bar background */}
        <div className="w-full h-3 bg-gray-700 rounded-full border border-yellow-400/20">
          {/* HP bar fill animated as HP changes */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
            style={{ width: `${hpPct}%` }}
          />
        </div>
      </div>

      {/* Numeric HP display */}
      <div
        className={`mt-1 font-semibold text-amber-200 ${
          side === "player" ? "text-right" : "text-left"
        }`}
      >
        {pokemon.hp}/{pokemon.maxHp}
      </div>
    </div>
  );
}
