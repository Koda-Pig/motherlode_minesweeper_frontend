import { forwardRef } from "react";
import { GameCell } from "./game-cell";

type CellType = "mine" | "gem";
type GameStatus = "idle" | "playing" | "won" | "lost";

interface GameGridProps {
  cellTypes: CellType[];
  revealedCells: Set<number>;
  gameStatus: GameStatus;
  onCellClick: (index: number) => void;
}

const GameGrid = forwardRef<HTMLDivElement, GameGridProps>(
  ({ cellTypes, revealedCells, gameStatus, onCellClick, ...props }, ref) => {
    // If game hasn't started, show empty grid
    const cellsToRender = cellTypes.length > 0 ? cellTypes.length : 25;

    return (
      <div
        ref={ref}
        className="grid grid-cols-5 gap-1 w-max border-2 border-foreground p-4 rounded-xl"
        {...props}
      >
        {Array.from({ length: cellsToRender }).map((_, index) => {
          // Using index as key is acceptable here since the grid is static
          // eslint-disable-next-line react/no-array-index-key
          return (
            <GameCell
              key={index}
              cellType={cellTypes[index]}
              isRevealed={revealedCells.has(index)}
              onClick={() => onCellClick(index)}
              gameStatus={gameStatus}
            />
          );
        })}
      </div>
    );
  }
);

GameGrid.displayName = "GameGrid";

export { GameGrid };
