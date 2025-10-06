"use client";
import { BattlePokemon } from "../../hooks/useBattleTeam";
import { capitalize } from "../../utils";

export default function SwitchMenu({
  team,
  activeIndex,
  onSwitch,
  onBack,
}: {
  team: BattlePokemon[];
  activeIndex: number;
  onSwitch: (newIndex: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {team.map((poke, i) => (
        <button
          key={poke.id}
          className={`btn ${
            i === activeIndex ? "btn-disabled opacity-70" : "btn-outline-custom"
          }`}
          onClick={() => onSwitch(i)}
        >
          {capitalize(poke.name)}
        </button>
      ))}
      <button
        onClick={onBack}
        className="btn btn-outline text-black hover:text-white mt-2"
      >
        Back
      </button>
    </div>
  );
}
