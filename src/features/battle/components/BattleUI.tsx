"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBattleTeam } from "@/features/battle/hooks/useBattleTeam";
import { useEnemyTeam } from "@/features/battle/hooks/useEnemyTeam";
import { useBattleStateMachine } from "../hooks/useBattleStateMaschine";
import { capitalize } from "@/features/battle/utils/utils";
import { calculateDamage } from "@/features/battle/lib/mechanics";
import {
  updateArenasCompletedAction,
  resetArenasCompletedAction,
} from "@/features/game-logic/actions";
import BattleBackground from "@/shared/components/ui/BattleBackground";
import PokemonSprite from "../ui/PokemonSprite";
import ActionBox from "../ui/ActionBox";
import InfoBox from "../ui/InfoBox";
import BattleLog from "../ui/BattleLog";
import { delay } from "@/features/battle/utils/utils";
import { Move } from "@/features/game-logic/types";

// Main battle scene controller
export default function BattleScene({
  arenaType,
  mode,
}: {
  arenaType: string;
  mode?: string;
}) {
  const router = useRouter();
  const [state, dispatch] = useBattleStateMachine();

  // Player and enemy team data
  const { team: playerTeam, reloadTeam } = useBattleTeam();
  const { enemyTeam } = useEnemyTeam(arenaType);

  // Keeps the latest state reference for async updates
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const {
    phase,
    playerAction,
    message,
    log,
    isFainting,
    playerIndex,
    enemyIndex,
  } = state;
  // Prevents user inputs during animations or after game over
  const isBusy = phase === "animating" || phase === "game_over";

  // Loads player and enemy teams when both are ready
  useEffect(() => {
    reloadTeam();
    if (
      playerTeam.length > 0 &&
      enemyTeam.length > 0 &&
      state.phase === "loading"
    ) {
      dispatch({ type: "SET_TEAMS", payload: { playerTeam, enemyTeam } });
    }
  }, [playerTeam, enemyTeam, state.phase, dispatch, reloadTeam]);

  // Handles victory condition
  const handleWin = async () => {
    if (mode === "ranked") {
      try {
        const progressString = sessionStorage.getItem("rankedProgress");
        if (progressString) {
          const progress = JSON.parse(progressString);
          const newArenasCompleted = progress.completed + 1;
          await updateArenasCompletedAction(newArenasCompleted);
          sessionStorage.setItem(
            "rankedProgress",
            JSON.stringify({ ...progress, completed: newArenasCompleted })
          );
        }
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    }
    router.push("/gamehub");
  };

  // Handles run condition
  const handleRun = async () => {
    if (mode === "ranked") {
      sessionStorage.removeItem("rankedProgress");
      await resetArenasCompletedAction();
    }
    router.push("/gamehub");
  };

  // Handles player turn
  const handleTurn = async (
    playerMove?: Move,
    isSwitching?: { newIndex: number }
  ) => {
    dispatch({ type: "SET_PHASE", payload: "animating" });
    const currentPlayer =
      stateRef.current.playerTeam[stateRef.current.playerIndex];
    // Case 1 Player switches Pokemon
    if (isSwitching) {
      dispatch({
        type: "ADD_LOG",
        payload: `Come back, ${capitalize(currentPlayer.name)}!`,
      });
      await delay(1200);
      dispatch({
        type: "SET_ACTIVE_POKEMON",
        payload: { team: "player", index: isSwitching.newIndex },
      });
      const newPlayer = playerTeam[isSwitching.newIndex];
      dispatch({
        type: "ADD_LOG",
        payload: `Go, ${capitalize(newPlayer.name)}!`,
      });
      await delay(1200);
      // Case 2 Player attacks
    } else if (playerMove) {
      dispatch({ type: "SET_PLAYER_ACTION", payload: "IDLE" });
      const playerAttackMessage = `${capitalize(
        currentPlayer.name
      )} used ${capitalize(playerMove.name)}!`;
      dispatch({ type: "SET_MESSAGE", payload: playerAttackMessage });
      dispatch({ type: "ADD_LOG", payload: playerAttackMessage });
      await delay(1500);
      const currentEnemy =
        stateRef.current.enemyTeam[stateRef.current.enemyIndex];

      // Calculates attack results
      const { damage, effectiveness } = calculateDamage(
        80,
        playerMove,
        currentPlayer,
        currentEnemy
      );

      const newEnemyHp = Math.max(0, currentEnemy.hp - damage);

      dispatch({
        type: "UPDATE_POKEMON_HP",
        payload: {
          team: "enemy",
          index: stateRef.current.enemyIndex,
          newHp: newEnemyHp,
        },
      });

      // Display effectiveness feedback
      if (effectiveness !== "normal") {
        const message = `It's ${effectiveness.replace("-", " ")}!`;
        dispatch({ type: "SET_MESSAGE", payload: message });
        dispatch({ type: "ADD_LOG", payload: message });
        await delay(1200);
      }

      // Handles enemy fainting
      if (newEnemyHp <= 0) {
        dispatch({
          type: "SET_MESSAGE",
          payload: `${capitalize(currentEnemy.name)} fainted!`,
        });
        dispatch({
          type: "ADD_LOG",
          payload: `${capitalize(currentEnemy.name)} fainted!`,
        });
        dispatch({ type: "TRIGGER_FAINT", payload: "enemy" });
        await delay(2000);

        // Checks for remaining enemies
        const nextEnemyIndex = stateRef.current.enemyTeam.findIndex(
          (p) => p.hp > 0
        );

        // If enemy has more Pokemon send out the next one
        if (nextEnemyIndex !== -1) {
          dispatch({
            type: "SET_ACTIVE_POKEMON",
            payload: { team: "enemy", index: nextEnemyIndex },
          });
          const nextEnemy = stateRef.current.enemyTeam[nextEnemyIndex];
          const msg = `Enemy sent out ${capitalize(nextEnemy.name)}!`;
          dispatch({ type: "SET_MESSAGE", payload: msg });
          dispatch({ type: "ADD_LOG", payload: msg });
          await delay(1500);
          dispatch({ type: "SET_PHASE", payload: "player_turn" });
          return;

          // Otherwise player wins
        } else {
          dispatch({ type: "SET_MESSAGE", payload: "You won the battle!" });
          dispatch({ type: "ADD_LOG", payload: "You won!" });
          dispatch({ type: "SET_PHASE", payload: "game_over" });
          await delay(2000);
          handleWin();
          return;
        }
      }
    }

    // Wait before enemy attacks
    await delay(2000);

    const playerAfterAttack =
      stateRef.current.playerTeam[stateRef.current.playerIndex];
    const enemyAfterAttack =
      stateRef.current.enemyTeam[stateRef.current.enemyIndex];

    // Enemy selects random move
    const enemyMove =
      enemyAfterAttack.moves[
        Math.floor(Math.random() * enemyAfterAttack.moves.length)
      ];

    const enemyAttackMsg = `${capitalize(
      enemyAfterAttack.name
    )} used ${capitalize(enemyMove.name)}!`;

    dispatch({ type: "SET_MESSAGE", payload: enemyAttackMsg });
    dispatch({ type: "ADD_LOG", payload: enemyAttackMsg });

    await delay(1500);

    // Calculates enemy attack damage
    const { damage: playerDamage, effectiveness: playerEffect } =
      calculateDamage(80, enemyMove, enemyAfterAttack, playerAfterAttack);

    const newPlayerHp = Math.max(0, playerAfterAttack.hp - playerDamage);

    dispatch({
      type: "UPDATE_POKEMON_HP",
      payload: {
        team: "player",
        index: stateRef.current.playerIndex,
        newHp: newPlayerHp,
      },
    });

    // Shows enemy move effectiveness
    if (playerEffect !== "normal") {
      const message = `It was ${playerEffect.replace("-", " ")}!`;
      dispatch({ type: "SET_MESSAGE", payload: message });
      dispatch({ type: "ADD_LOG", payload: message });
      await delay(1200);
    }

    // Handles player fainting
    if (newPlayerHp <= 0) {
      dispatch({
        type: "SET_MESSAGE",
        payload: `${capitalize(playerAfterAttack.name)} fainted!`,
      });
      dispatch({
        type: "ADD_LOG",
        payload: `${capitalize(playerAfterAttack.name)} fainted!`,
      });
      dispatch({ type: "TRIGGER_FAINT", payload: "player" });
      await delay(2000);
      const nextPlayerIndex = stateRef.current.playerTeam.findIndex(
        (p) => p.hp > 0
      );

      // If player still has Pokemon lets them pick next
      if (nextPlayerIndex !== -1) {
        dispatch({ type: "SET_MESSAGE", payload: "Choose your next Pokémon." });
        dispatch({ type: "SET_PLAYER_ACTION", payload: "SELECTING_POKEMON" });
      } else {
        // Otherwise player loses
        dispatch({
          type: "SET_MESSAGE",
          payload: "You have no more Pokémon to fight! You lose.",
        });
        dispatch({ type: "ADD_LOG", payload: "You lost the battle." });
        dispatch({ type: "SET_PHASE", payload: "game_over" });
      }
      return;
    }

    // Turn passes back to player
    const finalPlayer =
      stateRef.current.playerTeam[stateRef.current.playerIndex];
    dispatch({ type: "SET_PHASE", payload: "player_turn" });
    dispatch({ type: "SET_PLAYER_ACTION", payload: "IDLE" });
    dispatch({
      type: "SET_MESSAGE",
      payload: `What will ${capitalize(finalPlayer.name)} do?`,
    });
  };

  // Shows loading screen until both teams are ready
  if (
    state.phase === "loading" ||
    !state.playerTeam.length ||
    !state.enemyTeam.length
  ) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        Loading Battle...
      </div>
    );
  }

  // Renders the full battle scene layout
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center font-mono">
      <div className="relative aspect-[4/3] h-full max-w-full overflow-hidden">
        <BattleBackground arenaType={arenaType} />
        <BattleLog messages={log} />

        {/* Enemy Pokemon Sprite */}
        <PokemonSprite
          key={state.enemyTeam[enemyIndex].id}
          pokemon={state.enemyTeam[enemyIndex]}
          side="enemy"
          isFainting={isFainting === "enemy"}
        />

        {/* Player Pokemon Sprite */}
        <PokemonSprite
          key={state.playerTeam[playerIndex].id}
          pokemon={state.playerTeam[playerIndex]}
          side="player"
          isFainting={isFainting === "player"}
        />

        {/* Bottom HUD Info + Action buttons */}
        <div className="absolute bottom-0 left-0 w-full h-[30%] p-2 flex gap-2">
          {/* Info box */}
          <InfoBox
            state={state}
            onAttackSelect={(move: Move) => handleTurn(move)}
            onPokemonSelect={(index: number) =>
              handleTurn(undefined, { newIndex: index })
            }
          />

          {/* Action buttons */}
          <ActionBox
            onFight={() =>
              dispatch({ type: "SET_PLAYER_ACTION", payload: "SELECTING_MOVE" })
            }
            onPokemon={() =>
              dispatch({
                type: "SET_PLAYER_ACTION",
                payload: "SELECTING_POKEMON",
              })
            }
            onRun={handleRun}
            onBack={() =>
              dispatch({ type: "SET_PLAYER_ACTION", payload: "IDLE" })
            }
            isBusy={isBusy}
            showBack={playerAction !== "IDLE"}
          />
        </div>
      </div>
    </div>
  );
}
