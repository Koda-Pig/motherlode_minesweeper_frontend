import { useState, useCallback } from "react";
import { GameGrid } from "./components/game-grid";
import { ControlPanel } from "./components/control-panel";
import type { UserInputs, CellType, GameStatus } from "./types";

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    bet: 1,
    mines: 15,
    gems: 10
  });

  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set());
  const [cellTypes, setCellTypes] = useState<CellType[]>([]);

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

  return (
    <>
      <span className="absolute top-2.5 right-2.5 border-2 border-foreground rounded-xl px-3 py-1">
        connected
      </span>
      <main className="flex gap-12 items-center justify-center p-10 flex-wrap">
        {/* inputs etc */}
        <ControlPanel
          userInputs={userInputs}
          setUserInputs={setUserInputs}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          revealedCells={revealedCells}
          setRevealedCells={setRevealedCells}
          setCellTypes={setCellTypes}
        />

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
