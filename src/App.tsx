import { useState } from "react";
import { CurrencyInput } from "./components/currency-input";
import { Input } from "./components/ui/input";
import { calculateProfit } from "./lib/utils";
import { GameGrid } from "./components/game-grid";
import type { UserInputs } from "./types";

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    bet: 1,
    mines: 15,
    gems: 10
  });

  const profit = calculateProfit(
    userInputs.bet,
    userInputs.mines,
    userInputs.gems
  );

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
                onChange={(e) =>
                  setUserInputs((prev) => ({
                    ...prev,
                    mines: Number(e.target.value)
                  }))
                }
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
                onChange={(e) =>
                  setUserInputs((prev) => ({
                    ...prev,
                    gems: Number(e.target.value)
                  }))
                }
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

          {/* cash out */}
          <button className="border-2 my-4 border-foreground text-2xl px-6 py-2 rounded-xl outline-2 outline-foreground outline-offset-2 mx-auto">
            CASH OUT
          </button>

          <div className="border-2 border-foreground p-2">
            <img src="eye.png" alt="lookin at you" />
          </div>
        </div>

        <GameGrid userInputs={userInputs} />
      </main>
    </>
  );
}

export default App;
