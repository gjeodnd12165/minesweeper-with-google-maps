import { createContext } from "react";

export const GameContext = createContext({
  isGameOver: false,
  names: ["nodes not found"]
});