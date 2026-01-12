import { useState } from "react";
import { CurrencyInput } from "./components/currency-input";

function App() {
  const [bet, setBet] = useState(0);
  return (
    <>
      <span className="status-pill">connected</span>
      <main>
        <div className="details">
          <h1>motherlode mine sweeper</h1>

          <div>
            <label htmlFor="bet">bet:</label>
            <CurrencyInput value={bet} onValueChange={setBet} id="bet" />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
