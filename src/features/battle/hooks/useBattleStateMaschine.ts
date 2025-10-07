import { useReducer } from "react";
import { capitalize } from "../utils/utils";
import { BattleState } from "@/features/game-logic/types";
import { BattleAction } from "@/features/game-logic/types";

export const initialState: BattleState = {
  phase: "loading", // Current phase of the battle
  playerAction: "IDLE", // Current action state for the player
  playerTeam: [], // Players Pokemon team
  enemyTeam: [], // Opponents Pokemon team
  playerIndex: 0, // Index of currently active Pokemon in playerTeam
  enemyIndex: 0, // Index of currently active Pokemon in enemyTeam
  message: "Loading battle...", // Messages displayed in the UI
  log: [], // Log history of battle events
  isFainting: null, // Tracks if a Pokemon is currently fainting
};

// Battle reducer handles battle state transitions
function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    // When both teams are set at the start of a battle
    case "SET_TEAMS":
      const firstPlayer = action.payload.playerTeam[0];
      return {
        ...state,
        phase: "intro",
        playerTeam: action.payload.playerTeam,
        enemyTeam: action.payload.enemyTeam,
        // Add intro messages to the battle log
        log: [
          `Battle against the enemy started!`,
          `Go, ${capitalize(firstPlayer.name)}!`,
        ],
        // Set initial player prompt
        message: `What will ${capitalize(firstPlayer.name)} do?`,
      };
    // Updates players current action
    case "SET_PLAYER_ACTION":
      return { ...state, playerAction: action.payload };

    // Updates on screen message (bottom battle box)
    case "SET_MESSAGE":
      return { ...state, message: action.payload };

    // Adds a message to battle log newest messages go on top
    case "ADD_LOG":
      return { ...state, log: [action.payload, ...state.log] };

    // Updates HP of a Pokemon
    case "UPDATE_POKEMON_HP":
      const teamToUpdate =
        action.payload.team === "player"
          ? [...state.playerTeam]
          : [...state.enemyTeam];

      // Updates HP for the specific Pokemon in the chosen team
      teamToUpdate[action.payload.index] = {
        ...teamToUpdate[action.payload.index],
        hp: action.payload.newHp,
      };

      return {
        ...state,
        [action.payload.team === "player" ? "playerTeam" : "enemyTeam"]:
          teamToUpdate,
      };

    // Switches currently active Pokemon
    case "SET_ACTIVE_POKEMON":
      const teamKey =
        action.payload.team === "player" ? "playerIndex" : "enemyIndex";

      // Choose which Pokemons name to display in next message
      const messagePokemon =
        action.payload.team === "player"
          ? state.playerTeam[action.payload.index]
          : state.playerTeam[state.playerIndex]; // might need to test enemyIndex here not sure

      return {
        ...state,
        isFainting: null, // Clears fainting animation
        [teamKey]: action.payload.index, // Updates active Pokemon index
        playerAction: "IDLE", // Reset action state
        message: `What will ${capitalize(messagePokemon.name)} do?`,
      };

    // Sets the current battle phase
    case "SET_PHASE":
      return { ...state, phase: action.payload };

    // Triggers fainting animation for player or enemy Pokemon
    case "TRIGGER_FAINT":
      return { ...state, isFainting: action.payload };

    // Default fallback
    default:
      return state;
  }
}

export const useBattleStateMachine = () => {
  return useReducer(battleReducer, initialState);
};
