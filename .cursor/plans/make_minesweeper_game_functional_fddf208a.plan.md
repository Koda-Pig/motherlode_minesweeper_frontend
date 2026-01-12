---
name: Make Minesweeper Game Functional
overview: Implement game logic to use user-selected mines and gems counts, handle cell reveals, win/lose conditions with alerts, and proper game state management for a 5x5 grid.
todos: []
---

# Make Minesweeper Game Functional

## Overview

Transform the static grid into a functional minesweeper game that uses the user's selected number of mines and gems, handles cell reveals, and triggers win/lose alerts. There should always be a 5 x 5 grid, so changing the number of mines should change the number of gems to keep the total at 25, and vice versa.

## Current State Analysis

- `App.tsx` collects user inputs (bet, mines, gems) but they're not used in gameplay
- `GameGrid` receives `userInputs` but doesn't use them
- `GameCell` randomly assigns mines (10% chance) instead of using the user's selection
- No game state management (no tracking of revealed cells, game status, etc.)
- Grid is hardcoded to 25 cells (5x5)

## Implementation Plan

### 1. Game State Management (`App.tsx`)

- Add game state to track:
- `gameStatus`: 'idle' | 'playing' | 'won' | 'lost'
- `revealedCells`: Set of revealed cell indices
- `cellTypes`: Array mapping each cell index to 'mine' | 'gem' (initialized on game start, always 25 cells)
- Add automatic adjustment logic for mines/gems inputs:
- When mines changes: automatically set gems = 25 - mines (clamp to valid range 1-24)
- When gems changes: automatically set mines = 25 - gems (clamp to valid range 1-24)
- Ensure mines and gems are always between 1-24 and sum to exactly 25
- Add `startGame` function that:
- Validates mines + gems = 25 (grid size constraint)
- Randomly places mines and gems based on `userInputs.mines` and `userInputs.gems`
- All 25 cells are either mines or gems (no empty cells)
- Sets game status to 'playing'
- Add `handleCellClick` function to process cell reveals
- Add `handleCashOut` function for manual win condition

### 2. Game Logic (`App.tsx` or new utility)

- Create `initializeGameGrid(mines: number, gems: number)` function:
- Creates array of 25 cells
- Randomly assigns `mines` number of mines
- Randomly assigns `gems` number of gems
- Remaining cells are empty (or could be gems - need to clarify)
- Handle cell click logic:
- If mine clicked → set status to 'lost', reveal all mines, show alert
- If gem clicked → add to revealed set, check if all gems revealed (win condition)
- Prevent clicks when game is over

### 3. Update `GameGrid` Component

- Pass down game state props:
- `cellTypes`: Array of cell types for each position
- `revealedCells`: Set of revealed indices
- `gameStatus`: Current game status
- `onCellClick`: Click handler function
- Remove hardcoded array generation, use cellTypes length instead

### 4. Update `GameCell` Component

- Accept props:
- `cellType`: 'mine' | 'gem' (no null, all cells are either mine or gem)
- `isRevealed`: boolean
- `onClick`: click handler
- `gameStatus`: to disable interactions when game over
- Remove random mine assignment
- Show appropriate image based on cellType when revealed:
- 'mine' → mine.png
- 'gem' → plumbob.webp (green diamond)
- Disable button when revealed or game is over

### 5. Win/Lose Alerts

- Add `useEffect` in `App.tsx` to trigger alerts:
- When `gameStatus === 'won'` → `alert('you win')`
- When `gameStatus === 'lost'` → `alert('you lose')`

### 6. Cash Out Button

- Connect CASH OUT button to `handleCashOut` function
- Only enable when game status is 'playing' and at least one gem revealed
- On click: set status to 'won', trigger alert

### 7. Game Initialization

- Add "Start Game" button or auto-start when inputs change
- Validation is handled by automatic adjustment (mines + gems always = 25)
- Reset game state when starting new game

## File Changes

### `src/App.tsx`

- Add game state management (useState hooks)
- Add automatic mines/gems adjustment logic in input handlers (mines + gems = 25)
- Add game initialization logic
- Add cell click handler
- Add cash out handler
- Add win/lose alert effects
- Pass game state to GameGrid

### `src/components/game-grid.tsx`

- Update props interface to accept game state
- Pass cell-specific props to each GameCell
- Use cellTypes array length instead of hardcoded 25

### `src/components/game-cell.tsx`

- Update props to accept cellType, isRevealed, onClick, gameStatus
- Remove random mine logic
- Show correct image based on cellType when revealed
- Handle click events properly

## Edge Cases to Handle

- Mines/gems input adjustment: When user changes mines, automatically adjust gems to keep total at 25 (and vice versa)
- Clamping: Ensure mines and gems stay within valid range (1-24) when auto-adjusting
- Clicking already revealed cell: No-op
- Clicking cell when game over: No-op
- Starting new game: Reset all state properly
- All cells must be assigned: No empty cells, all 25 cells are either mines or gems
