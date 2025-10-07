export type BattleState = {
  phase:
    | "loading"
    | "intro"
    | "player_turn"
    | "enemy_turn"
    | "animating"
    | "game_over";
  playerAction: "IDLE" | "SELECTING_MOVE" | "SELECTING_POKEMON";
  playerTeam: BattlePokemon[];
  enemyTeam: BattlePokemon[];
  playerIndex: number;
  enemyIndex: number;
  message: string;
  log: string[];
  isFainting: null | "player" | "enemy";
};

export type BattleAction =
  | {
      type: "SET_TEAMS";
      payload: { playerTeam: BattlePokemon[]; enemyTeam: BattlePokemon[] };
    }
  | {
      type: "SET_PLAYER_ACTION";
      payload: "IDLE" | "SELECTING_MOVE" | "SELECTING_POKEMON";
    }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "ADD_LOG"; payload: string }
  | {
      type: "UPDATE_POKEMON_HP";
      payload: { team: "player" | "enemy"; index: number; newHp: number };
    }
  | {
      type: "SET_ACTIVE_POKEMON";
      payload: { team: "player" | "enemy"; index: number };
    }
  | { type: "SET_PHASE"; payload: BattleState["phase"] }
  | { type: "TRIGGER_FAINT"; payload: "player" | "enemy" };

export interface Move {
  name: string;
  power: number | null;
  type: { name: string };
  damage_class: { name: string };
}

export interface BattlePokemon {
  id: number;
  name: string;
  frontSprite: string;
  backSprite: string;
  animatedSprite: string;
  animatedBackSprite: string;
  moves: Move[];
  hp: number;
  maxHp: number;
  stats: { name: string; value: number }[];
  types: any[];
}

export interface TypedPokemonInfo {
  id: number;
  name: string;
  url: string;
}

export interface ActionBoxProps {
  onFight: () => void;
  onPokemon: () => void;
  onRun: () => void;
  onBack: () => void;
  isBusy: boolean;
  showBack: boolean;
}

export interface InfoBoxProps {
  state: BattleState;
  onAttackSelect: (move: Move) => void;
  onPokemonSelect: (index: number) => void;
}

export interface LeaderboardEntry {
  id: number;
  score: number;
  user: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  };
}
