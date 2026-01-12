# Motherlode Mine Sweeper Frontend

Deployed here: https://motherlode-mine-sweeper.netlify.app/

## Core Gameplay Mechanics

1. **Bet Placement**: Player selects bet amount (in Solana) and number of mines to place on the field
2. **Game Progression**: Player clicks tiles to reveal "green diamonds" (safe tiles), with each successful click multiplying their potential winnings
3. **Win Conditions**:
   - Player can cash out at any time to claim accumulated winnings
   - Hitting a mine results in losing the entire bet
4. **Multiplier System**: Earnings multiply based on:
   - Number of mines selected at game start (higher risk = higher rewards)
   - Number of safe tiles successfully revealed
5. Game grid is set to 5 x 5 tiles, changing the number of mines will change the number of gems to keep the correct total (and vice versa)
