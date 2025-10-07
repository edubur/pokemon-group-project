"use client";

import { Pokemon } from "../types";

interface Props {
  team: Pokemon[];
  onRemove: (id: number) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
}

export default function TeamBar({
  team,
  onRemove,
  onSave,
  hasUnsavedChanges,
}: Props) {

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-yellow-500/20
                    backdrop-blur-md text-amber-200 p-4 flex flex-wrap items-center gap-2
                    shadow-xl z-50"
    >
      {team.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-gray-800/60 border border-yellow-500/20
                     rounded-xl p-2 min-w-[140px] relative"
        >
          <img src={p.image} alt={p.name} className="w-12 h-12 drop-shadow" />
          <span className="capitalize truncate text-yellow-400">{p.name}</span>
          <button
            onClick={() => onRemove(p.id)}
            className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 bg-red-500
                       text-white rounded-full w-6 h-6 flex items-center justify-center
                       shadow-md hover:bg-red-600 transition"
          >
            ✖
          </button>
        </div>
      ))}

      <button
        onClick={onSave}
        disabled={!hasUnsavedChanges}
        className="ml-auto bg-amber-200/70 text-gray-900 font-bold px-4 py-2 rounded-xl
                   hover:bg-yellow-400 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {hasUnsavedChanges ? "Save Team" : "Saved"}
      </button>
    </div>
  );
}
