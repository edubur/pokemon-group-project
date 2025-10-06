"use client";

export default function MessageLog({ messages }: { messages: string[] }) {
  return (
    <div className="bg-black text-white rounded-lg p-2 h-28 overflow-y-auto mb-2 font-mono text-sm">
      {messages.length === 0 ? (
        <p className="opacity-50">Battle started!</p>
      ) : (
        messages.map((m, i) => <p key={i}>▶ {m}</p>)
      )}
    </div>
  );
}
