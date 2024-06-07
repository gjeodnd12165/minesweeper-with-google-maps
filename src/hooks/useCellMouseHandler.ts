import { SetStateAction } from "react";
import { ConvertedData } from "../logics/convertData";
import _ from "lodash";
import { mineRate } from "../constants";

interface Props {
  variables: {
    revealedCells: number[];
    mines: number[];
    data: ConvertedData[] | null;
    adjacentMines: number[];
    adjacentCells: number[][];
    flaggedCells: number[];
  };
  setters: {
    setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>;
    setMines: React.Dispatch<React.SetStateAction<number[]>>;
    setRevealedCells: React.Dispatch<React.SetStateAction<number[]>>;
    setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    setFlaggedCells: React.Dispatch<React.SetStateAction<number[]>>;
  }
}

export const useCellMouseHandler = ({
  variables: { revealedCells, mines, data, adjacentMines, adjacentCells, flaggedCells },
  setters: { setHoveredCell, setMines, setRevealedCells, setIsGameOver, setFlaggedCells }
}: Props) => {
  const handleCellHover = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    setHoveredCell(id);
  }
  const handleCellLClick = (clickedCell: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    if (revealedCells.includes(clickedCell)) return;
    revealCell(clickedCell);
  }
  const revealCell = (clickedCell: number) => {
    if (mines.includes(clickedCell)) {
      if (!revealedCells.length) {
        let newMines = data ? _.sampleSize(_.range(data.length), data.length / mineRate) : [];
        while (newMines.includes(clickedCell)) { 
          // re-calculate mines until mines[] doesn't inlcude clickedCell
          console.log("re-calc mines");
          newMines = data ? _.sampleSize(_.range(data.length), data.length / mineRate) : [];
        }
        setMines(newMines);
        setRevealedCells([clickedCell]);
        return; 
      }
      else {
        setIsGameOver(true);
        return;
      }
    }
    
    if (adjacentMines[clickedCell]) {
      // 주변에 지뢰가 있다면 그 셀만 밝히기
      setRevealedCells([...revealedCells, clickedCell]);
    }
    else {
      // 주변 지뢰가 없다면 BFS 
      const queue = [clickedCell];
      const visited = [clickedCell, ...revealedCells];
      while (queue.length > 0) {
        const currentCell: number | undefined = queue.shift();
        if (currentCell === undefined) continue;
        // 현재 셀에 인접한 셀 순회
        for (const cell of adjacentCells[currentCell]) {
          // 인접한 셀이 밝혀진 셀이 아니거나, 지뢰가 아니라면 밝혀질 셀 목록인 큐에 추가
          if (!visited.includes(cell)) {
            if (!adjacentMines[cell]){
              queue.push(cell);              
            }
            visited.push(cell);
          }
        }
      }
      setRevealedCells([...visited]);
    }
  }
  const handleCellDoubleClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    if (!revealedCells.includes(id)) return;
    const adjacentFlaggedCells = adjacentCells[id].filter((cellId) => flaggedCells.includes(cellId));
    if (adjacentFlaggedCells.length === adjacentMines[id]) {
      adjacentCells[id]
        .filter((cellId) => !flaggedCells.includes(cellId))
        .forEach((cellId) => {
          revealCell(cellId);
        })
    }
  }
  const handleCellRClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    // 깃발이 있으면 빼고, 없으면 넣기
    if (revealedCells.includes(id)) return; // 이미 밝혀진 셀이면 깃발 X
    setFlaggedCells(flaggedCells.includes(id) ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);
  }

  return {
    handlers: {
      handleCellDoubleClick,
      handleCellHover,
      handleCellLClick,
      handleCellRClick
    }
  }
}