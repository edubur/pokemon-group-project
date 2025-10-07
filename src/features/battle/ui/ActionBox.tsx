import React from "react";
import { ActionBoxProps } from "@/features/game-logic/types";
import { actionBoxStyle, buttonStyle } from "../utils/utils";

export default function ActionBox({
  onFight, // Called when player selects Fight
  onPokemon, // Called when player selects Pokemon
  onRun, // Called when player selects Run
  onBack, // Called when player presses Back
  isBusy, // Disables input during animations or transitions
  showBack, // Toggles between the Back button and the main options
}: ActionBoxProps) {
  // 🟦 If we are in a submenu show only the back button
  if (showBack) {
    return (
      <div className="w-1/3 h-full">
        <div className={actionBoxStyle}>
          <button onClick={onBack} disabled={isBusy} className={buttonStyle}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // Otherwise shows the full set of player actions
  return (
    <div className="w-1/3 h-full">
      <div className={actionBoxStyle}>
        {/* Grid layout for 3 buttons — fight, pokemon and run */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
          {/* Fight button */}
          <button onClick={onFight} disabled={isBusy} className={buttonStyle}>
            FIGHT
          </button>
          {/* Pokemon button */}
          <button onClick={onPokemon} disabled={isBusy} className={buttonStyle}>
            POKéMON
          </button>
          {/* Run button */}
          <button
            onClick={onRun}
            disabled={isBusy}
            className={`${buttonStyle} col-span-2`}
          >
            RUN
          </button>
        </div>
      </div>
    </div>
  );
}
