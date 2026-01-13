import { forwardRef } from "react";
import { GameCell } from "./game-cell";
import type { CellType, GameStatus } from "@/types";

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
      <div
        ref={ref}
        className="relative grid grid-cols-5 gap-1 aspect-square w-full max-w-[calc(var(--spacing)*5*23)] border-2 border-foreground p-4 rounded-xl"
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
        {!gameHasStarted && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-xl font-semibold bg-background/90 px-4 py-2 rounded-lg border-2 border-foreground">
              Place your bet first!
            </p>
          </div>
        )}
      </div>
    );
  }
);

GameGrid.displayName = "GameGrid";

export { GameGrid };
