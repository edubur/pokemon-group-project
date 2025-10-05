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
  // Return null if team is empty
  if (team.length === 0) return null;

  return (
    // Fixed bottom bar for team
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-wrap items-center gap-2 shadow-lg z-50">
      {/* Pokemon cards */}
      {team.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-gray-700 rounded-xl p-2 min-w-[140px] relative"
        >
          {/* Pokemon image */}
          <img src={p.image} alt={p.name} className="w-12 h-12" />

          {/* Pokemon name */}
          <span className="capitalize truncate">{p.name}</span>

          {/* Delete button */}
          <button
            onClick={() => onRemove(p.id)}
            className="absolute top-0 right-0 -translate-x-1/4 -translatey-1/4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            ✖
          </button>
        </div>
      ))}

      {/* Save button */}
      {team.length > 0 && (
        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="ml-auto bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {hasUnsavedChanges ? "Save Team" : "Saved"}
        </button>
      )}
    </div>
  );
}
