import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GameCellProps {
  className?: string;
}

const GameCell = forwardRef<HTMLDivElement, GameCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          className,
          "w-20 h-20 border-2 border-foreground flex rounded-lg p-2"
        )}
        {...props}
      >
        <img src="plumbob.webp" alt="plumbob" className="mx-auto" />
      </div>
    );
  }
);

GameCell.displayName = "GameCell";

export { GameCell };
