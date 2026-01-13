import { useCallback, forwardRef } from "react";
import { CurrencyInput } from "./currency-input";
import { Input } from "./ui/input";
import { calculateProfit } from "@/lib/utils";
import type { UserInputs, GameStatus, CellType } from "@/types";

type ControlPanelProps = {
  userInputs: UserInputs;
  setUserInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  revealedCells: Set<number>;
  setRevealedCells: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCellTypes: React.Dispatch<React.SetStateAction<CellType[]>>;
};

function initializeGameGrid(mines: number, gems: number): CellType[] {
  const grid: CellType[] = [];

  for (let i = 0; i < mines; i++) grid.push("mine");
  for (let i = 0; i < gems; i++) grid.push("gem");

  // Shuffle the array randomly - NEED TO REPLACE WITH LEGIT RANDOMIZATION
  for (let i = grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grid[i], grid[j]] = [grid[j], grid[i]];
  }

  return grid;
}

const ControlPanel = forwardRef<HTMLDivElement, ControlPanelProps>(
  (
    {
      userInputs,
      setUserInputs,
      gameStatus,
      setGameStatus,
      revealedCells,
      setRevealedCells,
      setCellTypes
    },
    ref
  ) => {
    // Automatic adjustment: keep total mines + gems = 25
    const handleMinesChange = useCallback((newMines: number) => {
      const clampedMines = Math.max(1, Math.min(24, newMines));
      const newGems = 25 - clampedMines;
      setUserInputs((prev) => ({
        ...prev,
        mines: clampedMines,
        gems: newGems
      }));
    }, []);

    const handleGemsChange = useCallback((newGems: number) => {
      const clampedGems = Math.max(1, Math.min(24, newGems));
      const newMines = 25 - clampedGems;
      setUserInputs((prev) => ({
        ...prev,
        mines: newMines,
        gems: clampedGems
      }));
    }, []);

    const handleCashOut = useCallback(() => {
      if (gameStatus === "playing" && revealedCells.size > 0) {
        setGameStatus("won");
      }
    }, [gameStatus, revealedCells.size]);

    const startGame = useCallback(() => {
      const grid = initializeGameGrid(userInputs.mines, userInputs.gems);
      setCellTypes(grid);
      setRevealedCells(new Set());
      setGameStatus("playing");
    }, [userInputs.mines, userInputs.gems]);

    const profit = calculateProfit(
      userInputs.bet,
      userInputs.mines,
      userInputs.gems
    );

    return (
      <div
        className="p-5 border-foreground border-2 flex flex-col gap-2 max-w-[min(100%,420px)]"
        ref={ref}
      >
        <h1 className="text-4xl text-transparent p-5 border-2 border-foreground rounded-4xl text-center font-black">
          motherlode mine sweeper
        </h1>

        <div className="w-1/2">
          <label htmlFor="bet" className="block">
            bet:
          </label>
          <CurrencyInput
            value={userInputs.bet}
            onValueChange={(value) =>
              setUserInputs((prev) => ({ ...prev, bet: value }))
            }
            id="bet"
          />
        </div>

        {/* mines + gems */}
        <div className="flex gap-4">
          {/* mines */}
          <div>
            <label htmlFor="mines">mines:</label>
            <Input
              type="number"
              id="mines"
              min={1}
              max={24}
              value={userInputs.mines}
              onChange={(e) => handleMinesChange(Number(e.target.value))}
            />
          </div>
          {/* gems */}
          <div>
            <label htmlFor="gems">gems:</label>
            <Input
              type="number"
              id="gems"
              min={1}
              max={24}
              value={userInputs.gems}
              onChange={(e) => handleGemsChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* profit */}
        <div>
          <p>profit:</p>
          <p className="text-xl border-foreground h-9 rounded-md border-2 px-3 py-1 text-center">
            {profit === null
              ? "Invalid combination"
              : `${profit.toFixed(2)} SOL`}
          </p>
        </div>

        {/* start game / cash out */}
        {gameStatus === "idle" ? (
          <button
            onClick={startGame}
            className="border-2 my-4 border-foreground text-2xl px-6 py-2 rounded-xl outline-2 outline-foreground outline-offset-2 mx-auto"
          >
            START GAME
          </button>
        ) : (
          <button
            onClick={handleCashOut}
            disabled={gameStatus !== "playing" || revealedCells.size === 0}
            className="border-2 my-4 border-foreground text-2xl px-6 py-2 rounded-xl outline-2 outline-foreground outline-offset-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CASH OUT
          </button>
        )}

        {(gameStatus === "won" || gameStatus === "lost") && (
          <div
            className="absolute inset-0 grid items-center text-center "
            style={{ background: "radial-gradient(black, transparent)" }}
          >
            <div>
              <p className="text-9xl mb-4">you {gameStatus}</p>
              <button
                onClick={() => {
                  setGameStatus("idle");
                  setRevealedCells(new Set());
                  setCellTypes([]);
                }}
                className="border-2 border-foreground text-2xl px-6 py-2 rounded-xl outline-2 outline-foreground outline-offset-2 mx-auto"
              >
                play again
              </button>
            </div>
          </div>
        )}

        <div className="border-2 border-foreground p-2">
          <img src="eye.png" alt="lookin at you" />
        </div>
      </div>
    );
  }
);

ControlPanel.displayName = "ControlPanel";

export { ControlPanel };
