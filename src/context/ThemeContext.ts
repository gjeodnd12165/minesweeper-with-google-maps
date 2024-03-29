import { createContext } from "react";

export const ThemeContext = createContext({
  revealedColor: "#DDDDDD",
  hoveredColor: "#BBBBBB",
  adjacentColor: "#999999",
  normalColor: "#000000"
});