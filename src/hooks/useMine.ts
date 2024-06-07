import { useEffect, useMemo, useState } from "react"
import { useData } from "./useData";
import { mineRate } from "../constants";
import _ from "lodash";
import { useCell } from "./useCell";

// need to change to other name
export const useMine = () => {
  const { data } = useData();
  const [mines, setMines] = useState<number[]>([]);
  const { adjacentCells, flaggedCells } = useCell();

  useEffect(() => {
    setMines(data ? _.sampleSize(_.range(data.length), data.length / mineRate) : []);
  }, [data]);

  const remainingMines = useMemo(() => {
    return mines.length - flaggedCells.length;
  }, [mines, flaggedCells]);

  const adjacentMines: number[] = useMemo(() => {
    return adjacentCells.map((cell) => {
      return cell.filter((adjs) => (mines.includes(adjs))).length
    });
  }, [mines, adjacentCells]);

  return { mines, remainingMines, adjacentMines, setMines };
}