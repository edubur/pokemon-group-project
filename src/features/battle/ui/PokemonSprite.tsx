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
  // Position on screen depending on player or enemy side
  const positionClass =
    side === "player" ? "bottom-[25%] left-[18%]" : "top-[-9%] right-[-5%]";

  // Selects correct sprite for side
  // Player uses back sprite and enemy uses animated front sprite
  const spriteUrl =
    side === "player" ? pokemon.backSprite : pokemon.animatedSprite;

  return (
    <>
      {/* Keyframe animations for idle and faint */}
      <style>{idleAnimation + faintAnimation}</style>
      <div
        className={`absolute w-[1000px] h-[500px] transition-transform duration-500 ${positionClass}`}
      >
        {/* Displays health bar above Pokemon */}
        <HealthBar pokemon={pokemon} side={side} />

        {/* Pokemon sprite with animation */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${
            isFainting ? "animate-faint" : "animate-idle"
          }`}
        >
          <Image
            src={spriteUrl}
            alt={pokemon.name}
            width={side === "player" ? 500 : 300}
            height={side === "player" ? 500 : 200}
            className="object-contain drop-shadow-[0_0_10px_rgba(255,255,0,0.3)]"
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
        </div>
      </div>
    </>
  );
}
