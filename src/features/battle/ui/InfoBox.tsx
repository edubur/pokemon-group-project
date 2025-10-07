import { capitalize } from "../utils/utils";
import { BattlePokemon, Move } from "@/features/game-logic/types";
import { InfoBoxProps } from "@/features/game-logic/types";
import { boxStyle, moveButtonStyle, cardStyle } from "../utils/utils";

/**
 * Displays context information and options during battle
 * Depending on the current player action it shows either
 * battle message, available moves to choose from or
 * players Pokemon team for switching
 */
export default function InfoBox({
  state,
  onAttackSelect,
  onPokemonSelect,
}: InfoBoxProps) {
  const { playerAction, playerTeam, playerIndex, message } = state;
  const player = playerTeam[playerIndex]; // Currently active Pokemon

  // Renders different content depending on player action
  const renderContent = () => {
    switch (playerAction) {
      case "SELECTING_MOVE":
        // Shows all available moves for the active Pokemon
        return (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-lg">
            {player.moves.map((move: Move) => (
              <button
                key={move.name}
                className={moveButtonStyle}
                onClick={() => onAttackSelect(move)}
              >
                {capitalize(move.name)}
              </button>
            ))}
          </div>
        );

      // Shows players team to choose a Pokemon to switch
      case "SELECTING_POKEMON":
        return (
          <div className="grid grid-cols-2 gap-2 w-full h-full overflow-y-auto">
            {playerTeam.map((poke: BattlePokemon, i: number) => (
              <button
                key={poke.id}
                className={cardStyle}
                onClick={() => onPokemonSelect(i)}
                disabled={i === playerIndex || poke.hp <= 0}
              >
                {/* Pokemon sprite */}
                <img
                  src={poke.frontSprite}
                  alt={poke.name}
                  className="w-full max-w-[64px] h-auto object-contain"
                />
                {/* Name and HP bar */}
                <div className="flex flex-col items-start w-full">
                  <span className="font-bold text-sm text-yellow-400">
                    {capitalize(poke.name)}
                  </span>
                  <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1">
                    <div
                      className="bg-green-500 h-full rounded-full"
                      style={{ width: `${(poke.hp / poke.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        );
      default:
        // Default shows the battle message if no selection is being made
        return (
          <p className="text-2xl tracking-wide text-yellow-400">{message}</p>
        );
    }
  };

  return (
    <div className="w-2/3 h-full">
      <div className={boxStyle}>{renderContent()}</div>
    </div>
  );
}
