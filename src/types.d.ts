export type UserInputs = {
  bet: number;
  gems: number;
  mines: number;
};

export type GameStatus = "idle" | "playing" | "won" | "lost";
export type CellType = "mine" | "gem";
