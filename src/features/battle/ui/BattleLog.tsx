// Displays a scrolling log of battle events such as moves, damage,
// faint messages and other status updates
export default function BattleLog({ messages }: { messages: string[] }) {
  return (
    <div className="absolute top-4 left-4 w-1/4 max-w-[250px] h-[70%] bg-gray-900/70 border border-yellow-400/80 rounded-xl p-3 text-amber-200 text-sm overflow-y-auto shadow-xl backdrop-blur-md flex flex-col">
      {/* Renders each message line in order */}
      {messages.map((msg, i) => (
        <div key={i} className="py-2">
          {`> ${msg}`}
        </div>
      ))}
    </div>
  );
}
