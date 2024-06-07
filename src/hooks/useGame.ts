import { useMemo, useState, useEffect } from "react";
import _ from "lodash";

export const useGame = (mines: number[], flaggedCells: number[]) => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const isCleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  return { isGameOver, isCleared, setters: { setIsGameOver } };
};
