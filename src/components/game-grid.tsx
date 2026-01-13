import { forwardRef } from "react";
import { GameCell } from "./game-cell";
import type { CellType, GameStatus } from "@/types";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface GameGridProps {
  cellTypes: CellType[];
  revealedCells: Set<number>;
  gameStatus: GameStatus;
  onCellClick: (index: number) => void;
}

const GameGrid = forwardRef<HTMLDivElement, GameGridProps>(
  ({ cellTypes, revealedCells, gameStatus, onCellClick, ...props }, ref) => {
    // If game hasn't started, show empty grid
    const gameHasStarted = cellTypes.length > 0;
    const cellsToRender = gameHasStarted ? cellTypes.length : 25;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={ref}
            className="grid grid-cols-5 gap-1 aspect-square w-full max-w-[calc(var(--spacing)*5*23)] border-2 border-foreground p-4 rounded-xl"
            {...props}
          >
            {Array.from({ length: cellsToRender }).map((_, index) => {
              return (
                <GameCell
                  // Using index as key is acceptable here since the grid is static
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  cellType={cellTypes[index]}
                  isRevealed={revealedCells.has(index)}
                  onClick={() => onCellClick(index)}
                  gameStatus={gameStatus}
                />
              );
            })}
          </div>
        </TooltipTrigger>
        {!gameHasStarted && (
          <TooltipContent>
            <p className="text-xl">Place your bet first!</p>
          </TooltipContent>
        )}
      </Tooltip>
    );
  }
);

GameGrid.displayName = "GameGrid";

export { GameGrid };
