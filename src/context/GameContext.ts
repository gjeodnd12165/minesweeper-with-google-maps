import { createContext } from "react";

export const GameContext = createContext({
  isGameOver: false,
  isCleared: false,
  names: ["nodes not found"]
});