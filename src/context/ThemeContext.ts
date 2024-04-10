import { createContext } from "react";

export const ThemeContext = createContext({
  revealedColor: "#64a1ff",
  hoveredColor: "#acc5ff",
  adjacentColor: "#8cb3ff",
  normalColor: "#1e90ff"
});