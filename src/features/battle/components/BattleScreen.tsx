"use client";
import { useState, useEffect } from "react";
import { useBattleTeam } from "../hooks/useBattleTeam";
import { useEnemyTeam } from "../hooks/useEnemyTeam";
import PokemonDisplay from "./PokemonDisplay";
import MessageLog from "./MessageLog";
import MainMenu from "./menus/MainMenu";
import AttackMenu from "./menus/AttackMenu";
import SwitchMenu from "./menus/SwitchMenu";
import { capitalize } from "../utils";

export default function BattleScreen() {
  const { team, setTeam, reloadTeam } = useBattleTeam();
  const { enemyTeam, setEnemyTeam } = useEnemyTeam();

  const [activeIndex, setActiveIndex] = useState(0);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [menu, setMenu] = useState<"main" | "attacks" | "switch">("main");
  const [log, setLog] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const player = team[activeIndex];
  const enemy = enemyTeam[enemyIndex];

  // Force reload team on mount
  useEffect(() => {
    reloadTeam();
  }, [reloadTeam]);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev]);
  }

  function handleEnemySwitch(nextIndex: number) {
    setEnemyIndex(nextIndex);
    addLog(`Enemy sent out ${capitalize(enemyTeam[nextIndex].name)}!`);
  }

  function handlePlayerSwitch(nextIndex: number) {
    setActiveIndex(nextIndex);
    addLog(`Go, ${capitalize(team[nextIndex].name)}!`);
    setMenu("attacks");
  }


  function handleAttack(move: string) {
    if (isBusy || !player || !enemy) return;
    setIsBusy(true);

    // Player attack
    const dmg = Math.floor(Math.random() * 10) + 5;
    const newEnemyHp = Math.max(0, enemy.hp - dmg);

    setEnemyTeam((old) => {
      const copy = [...old];
      copy[enemyIndex] = { ...copy[enemyIndex], hp: newEnemyHp };
      return copy;
    });

    addLog(`${capitalize(player.name)} used ${capitalize(move)}! It dealt ${dmg} damage!`);

    setTimeout(() => {
      // Enemy fainted
      if (newEnemyHp <= 0) {
        addLog(`${capitalize(enemy.name)} fainted!`);

        const nextEnemyIndex = enemyTeam.findIndex((p, i) => p.hp > 0 && i !== enemyIndex);
        if (nextEnemyIndex !== -1) {
          handleEnemySwitch(nextEnemyIndex);
          setIsBusy(false);
        } else {
          addLog("You defeated all enemy Pokémon!");
          setIsBusy(false);
        }
        return;
      }

      // Enemy attack
      const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      const edmg = Math.floor(Math.random() * 10) + 5;

      setTeam((old) => {
        const copy = [...old];
        copy[activeIndex] = {
          ...copy[activeIndex],
          hp: Math.max(0, copy[activeIndex].hp - edmg),
        };
        return copy;
      });

      addLog(`${capitalize(enemy.name)} used ${capitalize(enemyMove)}! It dealt ${edmg} damage!`);

      // Player fainted
      setTimeout(() => {
        if (player.hp - edmg <= 0) {
          addLog(`${capitalize(player.name)} fainted!`);

          const nextPlayerIndex = team.findIndex((p, i) => p.hp > 0 && i !== activeIndex);
          if (nextPlayerIndex !== -1) {
            handlePlayerSwitch(nextPlayerIndex);
          } else {
            addLog("All your Pokémon fainted! Game Over!");
            setMenu("main");
          }
        }
        setIsBusy(false);
      }, 500);
    }, 1000);
  }

  function handleSwitch(newIndex: number) {
    if (newIndex === activeIndex || team[newIndex].hp <= 0) {
      addLog(`${capitalize(team[newIndex].name)} cannot battle!`);
      setMenu("main");
      return;
    }
    addLog(`Come back, ${capitalize(player.name)}!`);
    setTimeout(() => handlePlayerSwitch(newIndex), 500);
  }

  if (!team.length || !enemyTeam.length || !player || !enemy) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading teams...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-transparent p-4">
      <div className="flex justify-end pr-8">
        <PokemonDisplay pokemon={enemy} side="enemy" />
      </div>
      <div className="flex justify-start pl-8">
        <PokemonDisplay pokemon={player} side="player" />
      </div>

      <MessageLog messages={log} />

      <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-700">
        {menu === "main" ? (
          <MainMenu
            onFight={() => setMenu("attacks")}
            onSwitch={() => setMenu("switch")}
            disabled={isBusy}
          />
        ) : menu === "attacks" ? (
          <AttackMenu
            moves={player.moves}
            onAttack={handleAttack}
            onBack={() => setMenu("main")}
            disabled={isBusy}
          />
        ) : (
          <SwitchMenu
            team={team}
            activeIndex={activeIndex}
            onSwitch={handleSwitch}
            onBack={() => setMenu("main")}
          />
        )}
      </div>
    </div>
  );
}
