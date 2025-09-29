import { Pokemon } from "../types";

interface Props {
  team: Pokemon[];
  onRemove: (id: number) => void;
  onSave: () => void;
}

export default function TeamBar({ team, onRemove, onSave }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-wrap items-center gap-2 shadow-lg z-50">
      {team.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-gray-700 rounded-xl p-2 min-w-[140px] relative"
        >
          <img src={p.image} alt={p.name} className="w-12 h-12" />
          <span className="capitalize truncate">{p.name}</span>
          {/* Delete button positioned at top-right */}
          <button
            onClick={() => onRemove(p.id)}
            className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            ✖
          </button>
        </div>
      ))}

      {team.length > 0 && (
        <button
          onClick={onSave}
          className="ml-auto bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Save Team
        </button>
      )}
    </div>
  );
}
