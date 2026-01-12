import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { GameCell } from "./game-cell";

interface GameGridProps {
  className?: string;
}

const GameGrid = forwardRef<HTMLDivElement, GameGridProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          className,
          "grid grid-cols-5 gap-1 w-max border-2 border-foreground p-4 rounded-xl"
        )}
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
