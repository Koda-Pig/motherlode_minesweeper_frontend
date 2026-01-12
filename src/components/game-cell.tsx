import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GameCellProps {
  className?: string;
}

const GameCell = forwardRef<HTMLButtonElement, GameCellProps>(
  ({ className, ...props }, ref) => {
    const isMine = Math.random() < 0.1;
    const [isClicked, setIsClicked] = useState(false);

    return (
      <button
        ref={ref}
        className={cn(
          className,
          "w-20 h-20 border-2 border-foreground flex rounded-lg p-2 transition-all",
          isClicked
            ? "pointer-events-none"
            : "hover:border-white hover:scale-105"
        )}
        {...props}
        onClick={() => setIsClicked(true)}
      >
        <img
          src={isMine ? "mine.png" : "plumbob.webp"}
          alt="...mine?"
          className={cn(
            "mx-auto transition-opacity",
            isClicked ? "opacity-100" : "opacity-0"
          )}
        />
      </button>
    );
  }
);

GameCell.displayName = "GameCell";

export { GameCell };
