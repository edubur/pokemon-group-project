import { BattlePokemon } from "@/features/game-logic/types";
import HealthBar from "./Healthbar";
import Image from "next/image";
import { idleAnimation, faintAnimation } from "../utils/utils";

// Renders a Pokemon sprite on battlefield with HP and animations
export default function PokemonSprite({
  pokemon,
  side,
  isFainting,
}: {
  pokemon: BattlePokemon;
  side: "player" | "enemy";
  isFainting: boolean;
}) {
  /**
   * Use relative % positions + translate-x/y to center
   * Both player and enemy sprites stay in fixed relative positions
   * Sprite size is limited via max-w / max-h
   */
  const positionClass =
    side === "player"
      ? "absolute bottom-[min(35%)] left-[47%] -translate-x-1/2"
      : "absolute top-[min(6%)] left-[min(80%)] right-[min(15%)] -translate-x-1/2";

  const spriteUrl =
    side === "player" ? pokemon.backSprite : pokemon.animatedSprite;

  // Adjust size dynamically — player is larger
  const spriteSize = side === "player" ? 600 : 300;

  // Maximum size limits (can adjust to taste)
  const maxWidth = side === "player" ? "w-[150px] sm:w-[200px]" : "w-[120px] sm:w-[160px]";
  const maxHeight = side === "player" ? "h-[150px] sm:h-[200px]" : "h-[120px] sm:h-[160px]";

  return (
    <>
      {/* Keyframe animations for idle and faint */}
      <style>{idleAnimation + faintAnimation}</style>

      <div className={`${positionClass} ${maxWidth} ${maxHeight} flex flex-col items-center`}>
        {/* Health bar above Pokémon */}
        <HealthBar pokemon={pokemon} side={side} />

        {/* Sprite with animation */}
        <div className={`flex ${isFainting ? "animate-faint" : "animate-idle"}`}>
           <Image
            src={spriteUrl}
            alt={pokemon.name}
            width={spriteSize}
            height={spriteSize}
            className="object-contain drop-shadow-[0_0_10px_rgba(255,255,0,0.3)]"
            style={{
              imageRendering: "pixelated",
              transform: side === "player" ? "scale(2.5)" : "scale(1.75)",
            }}
            unoptimized
          />
        </div>
      </div>
    </>
  );
}
