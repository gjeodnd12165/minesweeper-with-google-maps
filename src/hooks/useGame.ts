import { useMemo, useState } from "react";
import { useMine } from "./useMine";
import { useCell } from "./useCell";
import _ from "lodash";

export const useGame = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const { mines } = useMine();
  const { flaggedCells } = useCell();

  const isCleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  return { isGameOver, isCleared, setIsGameOver };
}