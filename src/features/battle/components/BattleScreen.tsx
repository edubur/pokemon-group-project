"use client";

import { useState } from "react";
import Image from "next/image";

// types for now, need to expand later (move into types folder?)
type Pokemon = {
  name: string;
  hp: number;
  maxHp: number;
  moves: string[];
  sprite: string;
};

// main battle function with fixed pokemons
export default function BattleScreen() {
  const [player, setPlayer] = useState<Pokemon>({
    name: "Pikachu",
    hp: 35,
    maxHp: 35,
    moves: ["Thunderbolt", "Quick Attack", "Iron Tail", "Growl"],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png", // back sprite for player
  });

  const [enemy, setEnemy] = useState<Pokemon>({
    name: "Charmander",
    hp: 39,
    maxHp: 39,
    moves: ["Scratch", "Ember", "Leer", "Smokescreen"],
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", // front sprite for enemy
  });

  const [menu, setMenu] = useState<"main" | "attacks">("main");
  const [log, setLog] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  function addLog(message: string) {
    setLog((prev) => [message, ...prev]);
  }

  function handleAttack(move: string) {
    if (isBusy) return;
    setIsBusy(true);

    const playerDmg = Math.floor(Math.random() * 10) + 5;
    setEnemy((prev) => {
      const newHp = Math.max(0, prev.hp - playerDmg);
      return { ...prev, hp: newHp };
    });
    addLog(`${player.name} used ${move}! It dealt ${playerDmg} damage!`);
    setMenu("main");

    setTimeout(() => {
      if (enemy.hp - playerDmg <= 0) {
        addLog(`${enemy.name} fainted!`);
        setIsBusy(false);
        return;
      }

      const enemyMove =
        enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      const enemyDmg = Math.floor(Math.random() * 10) + 5;

      setPlayer((prev) => {
        const newHp = Math.max(0, prev.hp - enemyDmg);
        return { ...prev, hp: newHp };
      });
      addLog(
        `${enemy.name} used ${enemyMove}! It dealt ${enemyDmg} damage!`
      );

      if (player.hp - enemyDmg <= 0) {
        addLog(`${player.name} fainted!`);
      }

      setIsBusy(false);
    }, 1200);
  }

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-transparent p-4">
      {/* enemy side */}
      <div className="flex justify-end pr-8">
        <PokemonDisplay pokemon={enemy} side="enemy" />
      </div>

      {/* player side */}
      <div className="flex justify-start pl-8">
        <PokemonDisplay pokemon={player} side="player" />
      </div>

      {/* message Log */}
      <MessageLog messages={log} />

      {/* menu */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-700">
        {menu === "main" ? (
          <MainMenu onFight={() => setMenu("attacks")} disabled={isBusy} />
        ) : (
          <AttackMenu
            moves={player.moves}
            onAttack={handleAttack}
            onBack={() => setMenu("main")}
            disabled={isBusy}
          />
        )}
      </div>
    </div>
  );
}

function PokemonDisplay({
  pokemon,
  side,
}: {
  pokemon: Pokemon;
  side: "player" | "enemy";
}) {
  const hpPercent = (pokemon.hp / pokemon.maxHp) * 100;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="bg-white border-2 border-black rounded-lg p-2 shadow-md w-48">
        <div className="flex justify-between font-bold text-sm">
          <span className="text-black">{pokemon.name}</span>
          <span className="text-black">Lv 5</span>
        </div>
        <div className="w-full h-3 bg-gray-300 rounded mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              hpPercent > 50
                ? "bg-green-500"
                : hpPercent > 20
                ? "bg-yellow-400"
                : "bg-red-500"
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="text-right text-xs text-black">
          {pokemon.hp}/{pokemon.maxHp}
        </div>
      </div>
      {/* Sprite */}
      <div className="w-32 h-32 relative">
        <Image
          src={pokemon.sprite}
          alt={pokemon.name}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

function MainMenu({
  onFight,
  disabled,
}: {
  onFight: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button className="btn btn-outline hover:text-white text-black" onClick={onFight} disabled={disabled}>
        Fight
      </button>
      <button className="btn btn-outline hover:text-white text-black" disabled={disabled}>
        Pokémon
      </button>
    </div>
  );
}

// option to pick from attacks the pokemon has
function AttackMenu({
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
      {moves.map((attack) => (
        <button
          key={attack}
          className="btn btn-primary"
          onClick={() => onAttack(attack)}
          disabled={disabled}
        >
          {attack}
        </button>
      ))}
      <button onClick={onBack} className="btn btn-outline col-span-2 hover:text-white text-black">
        Back
      </button>
    </div>
  );
}

// display all action messages in a box
function MessageLog({ messages }: { messages: string[] }) {
  return (
    <div className="bg-black text-white rounded-lg p-2 h-28 overflow-y-auto mb-2 font-mono text-sm">
      {messages.length === 0 ? (
        <p className="opacity-50">Battle started!</p>
      ) : (
        messages.map((msg, i) => <p key={i}>▶ {msg}</p>)
      )}
    </div>
  );
}
