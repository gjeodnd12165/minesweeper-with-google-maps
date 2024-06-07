import { useEffect, useMemo, useState } from "react"
import { useData } from "./useData";
import { mineRate } from "../constants";
import _ from "lodash";
import { useCell } from "./useCell";
import { ConvertedData } from "../logics/convertData";

// need to change to other name
export const useMine = (data: ConvertedData[] | null, adjacentCells: number[][], flaggedCells: number[]) => {
  const [mines, setMines] = useState<number[]>([]);

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

  const isCleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  return { mines, remainingMines, adjacentMines, isCleared, setters: {
    setMines,
  }};
}