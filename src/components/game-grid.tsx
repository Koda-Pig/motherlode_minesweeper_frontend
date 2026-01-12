import { forwardRef } from "react";
import { GameCell } from "./game-cell";
import type { UserInputs } from "@/types";

interface GameGridProps {
  userInputs: UserInputs;
}

const GameGrid = forwardRef<HTMLDivElement, GameGridProps>(
  ({ userInputs, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="grid grid-cols-5 gap-1 w-max border-2 border-foreground p-4 rounded-xl"
        {...props}
      >
        {Array.from({ length: 25 }).map((_, index) => (
          <GameCell key={index} />
        ))}
      </div>
    );
  }
);

GameGrid.displayName = "GameGrid";

export { GameGrid };
