"use client";

export default function MainMenu({
  onFight,
  onSwitch,
  disabled,
}: {
  onFight: () => void;
  onSwitch: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        className="btn btn-outline text-black hover:text-white"
        onClick={onFight}
        disabled={disabled}
      >
        Fight
      </button>
      <button
        className="btn btn-outline text-black hover:text-white"
        onClick={onSwitch}
        disabled={disabled}
      >
        Pokémon
      </button>
    </div>
  );
}
