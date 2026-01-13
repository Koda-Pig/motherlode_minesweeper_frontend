import { useState, useCallback } from "react";
import { GameGrid } from "./components/game-grid";
import { ControlPanel } from "./components/control-panel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "./components/ui/dialog";
import type { UserInputs, CellType, GameStatus } from "./types";

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    bet: 1,
    mines: 10,
    gems: 15
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

  const handlePlayAgain = useCallback(() => {
    setGameStatus("idle");
    setRevealedCells(new Set());
    setCellTypes([]);
  }, []);

  const handleCashOut = useCallback(() => {
    if (gameStatus === "playing" && revealedCells.size > 0) {
      setGameStatus("won");
    }
  }, [gameStatus, revealedCells.size]);

  return (
    <>
      {/* placeholder for wallet connection */}
      <span className="absolute top-2.5 right-2.5 border-2 border-foreground rounded-xl px-3 py-1">
        connected
      </span>
      <main className="flex gap-12 items-center justify-center px-4 md:px-10 py-14 flex-wrap">
        {/* inputs etc */}
        <ControlPanel
          userInputs={userInputs}
          setUserInputs={setUserInputs}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          revealedCells={revealedCells}
          setRevealedCells={setRevealedCells}
          setCellTypes={setCellTypes}
          handleCashOut={handleCashOut}
        />

        <GameGrid
          cellTypes={cellTypes}
          revealedCells={revealedCells}
          gameStatus={gameStatus}
          onCellClick={handleCellClick}
        />
      </main>

      <Dialog
        open={gameStatus === "won" || gameStatus === "lost"}
        onOpenChange={(open) => {
          if (!open) handlePlayAgain();
        }}
      >
        <DialogContent className="text-center" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-6xl mb-4">
              YOU {gameStatus.toUpperCase()}!
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <button
              onClick={handlePlayAgain}
              className="border-2 border-foreground text-2xl px-6 py-2 rounded-xl outline-2 outline-foreground outline-offset-2"
            >
              PLAY AGAIN
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
