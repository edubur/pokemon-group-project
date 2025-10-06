"use client";
import { capitalize } from "../../utils";

export default function AttackMenu({
  moves,
  onAttack,
  onBack,
  disabled,
}: {
  moves: string[];
  onAttack: (move: string) => void;
  onBack: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {moves.map((mv) => (
        <button
          key={mv}
          className="btn btn-primary"
          onClick={() => onAttack(mv)}
          disabled={disabled}
        >
          {capitalize(mv)}
        </button>
      ))}
      <button
        onClick={onBack}
        className="btn btn-outline col-span-2 text-black hover:text-white"
      >
        Back
      </button>
    </div>
  );
}
