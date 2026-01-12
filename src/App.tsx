import { useState, useCallback } from "react";
import { CurrencyInput } from "./components/currency-input";
import { Input } from "./components/ui/input";
import { calculateProfit } from "./lib/utils";
import { GameGrid } from "./components/game-grid";
import type { UserInputs } from "./types";

type GameStatus = "idle" | "playing" | "won" | "lost";
type CellType = "mine" | "gem";

function initializeGameGrid(mines: number, gems: number): CellType[] {
  const grid: CellType[] = [];

  // Add mines
  for (let i = 0; i < mines; i++) grid.push("mine");

  // Add gems
  for (let i = 0; i < gems; i++) grid.push("gem");

  // Shuffle the array randomly
  for (let i = grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grid[i], grid[j]] = [grid[j], grid[i]];
  }

  return grid;
}

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    bet: 1,
    mines: 15,
    gems: 10
  });

  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set());
  const [cellTypes, setCellTypes] = useState<CellType[]>([]);

  const profit = calculateProfit(
    userInputs.bet,
    userInputs.mines,
    userInputs.gems
  );

  // Automatic adjustment: mines + gems = 25
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

  const startGame = useCallback(() => {
    const grid = initializeGameGrid(userInputs.mines, userInputs.gems);
    setCellTypes(grid);
    setRevealedCells(new Set());
    setGameStatus("playing");
  }, [userInputs.mines, userInputs.gems]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameStatus !== "playing" || revealedCells.has(index)) return;

      const cellType = cellTypes[index];
      const newRevealed = new Set(revealedCells);
      newRevealed.add(index);

      if (cellType === "mine") {
        // Reveal all mines, but keep already revealed gems visible
        const allMineIndices = new Set<number>();
        cellTypes.forEach((type, idx) => {
          if (type === "mine") {
            allMineIndices.add(idx);
          }
        });
        // Merge with already revealed cells (gems that were revealed)
        const allRevealed = new Set([...revealedCells, ...allMineIndices]);
        setRevealedCells(allRevealed);
        setGameStatus("lost");
      } else {
        // Gem clicked
        setRevealedCells(newRevealed);

        // Check if all gems are revealed (win condition)
        const totalGems = cellTypes.filter((type) => type === "gem").length;
        const revealedGems = Array.from(newRevealed).filter(
          (idx) => cellTypes[idx] === "gem"
        ).length;

        if (revealedGems === totalGems) setGameStatus("won");
      }
    },
    [gameStatus, revealedCells, cellTypes]
  );

  const handleCashOut = useCallback(() => {
    if (gameStatus === "playing" && revealedCells.size > 0) {
      setGameStatus("won");
    }
  }, [gameStatus, revealedCells.size]);

  return (
    <>
      <span className="absolute top-2.5 right-2.5 border-2 border-foreground rounded-xl px-3 py-1">
        connected
      </span>
      <main className="flex gap-12 items-center justify-center p-10 flex-wrap">
        {/* inputs etc */}
        <div className="p-5 border-foreground border-2 flex flex-col gap-2 max-w-[min(100%,420px)]">
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

        <GameGrid
          cellTypes={cellTypes}
          revealedCells={revealedCells}
          gameStatus={gameStatus}
          onCellClick={handleCellClick}
        />
      </main>
    </>
  );
}

export default App;
