import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CellType = "mine" | "gem";
type GameStatus = "idle" | "playing" | "won" | "lost";

interface GameCellProps {
  cellType?: CellType;
  isRevealed: boolean;
  onClick: () => void;
  gameStatus: GameStatus;
  className?: string;
}

const GameCell = forwardRef<HTMLButtonElement, GameCellProps>(
  ({ cellType, isRevealed, onClick, gameStatus, className, ...props }, ref) => {
    const isDisabled = isRevealed || gameStatus !== "playing" || !cellType;

    return (
      <button
        ref={ref}
        className={cn(
          className,
          "w-20 h-20 border-2 border-foreground flex rounded-lg p-2 transition-all",
          isDisabled
            ? "pointer-events-none"
            : "hover:border-white hover:scale-105 cursor-pointer"
        )}
        onClick={onClick}
        disabled={isDisabled}
        {...props}
      >
        {cellType && (
          <img
            src={cellType === "mine" ? "mine.png" : "plumbob.webp"}
            alt={cellType === "mine" ? "mine" : "gem"}
            className={cn(
              "mx-auto transition-opacity",
              isRevealed ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </button>
    );
  }
);

GameCell.displayName = "GameCell";

export { GameCell };
