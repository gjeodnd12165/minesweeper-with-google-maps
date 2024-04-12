const handleCellHoverFactory = (
  setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>
) => 
  (id: number): React.MouseEventHandler<SVGSVGElement> => 
  (e: React.MouseEvent<SVGSVGElement>) => {
  setHoveredCell(id);
};

const handleCellLClickFactory = (
  mines: number[], setMines: React.Dispatch<React.SetStateAction<number[]>>, calcNewMines: () => number[], 
  revealedCells: number[], setRevealedCells: React.Dispatch<React.SetStateAction<number[]>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>, adjacentMines: number[], adjacentCells: number[][]
) => 
  (id: number): React.MouseEventHandler<SVGSVGElement> => 
  (e: React.MouseEvent<SVGSVGElement>) => {
  if (revealedCells.includes(id)) return;
  revealCell(
    mines, setMines, calcNewMines, 
    revealedCells, setRevealedCells,
    setIsGameOver, adjacentMines, adjacentCells
  )(id)
}

const handleCellDoubleClickFactory = (
  mines: number[], setMines: React.Dispatch<React.SetStateAction<number[]>>, calcNewMines: () => number[], 
  revealedCells: number[], setRevealedCells: React.Dispatch<React.SetStateAction<number[]>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>, adjacentMines: number[], adjacentCells: number[][],
  flaggedCells: number[]
) => 
  (id: number): React.MouseEventHandler<SVGSVGElement> => 
  (e: React.MouseEvent<SVGSVGElement>) => {
  if (!revealedCells.includes(id)) return;
  const adjacentFlaggedCells = adjacentCells[id].filter((cellId) => flaggedCells.includes(cellId));
  if (adjacentFlaggedCells.length === adjacentMines[id]) {
    adjacentCells[id]
      .filter((cellId) => !flaggedCells.includes(cellId))
      .forEach((cellId) => {
        revealCell(
          mines, setMines, calcNewMines, 
          revealedCells, setRevealedCells,
          setIsGameOver, adjacentMines, adjacentCells
        )(cellId);
      })
  }
}

const revealCell = (
  mines: number[], setMines: React.Dispatch<React.SetStateAction<number[]>>, calcNewMines: () => number[], 
  revealedCells: number[], setRevealedCells: React.Dispatch<React.SetStateAction<number[]>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>, adjacentMines: number[], adjacentCells: number[][]
) => 
  (id: number) => {
  if (mines.includes(id)) {
    if (!revealedCells.length) {
      let newMines = calcNewMines();
      while (newMines.includes(id)) { 
        // re-calculate mines until mines[] doesn't inlcude clickedCell
        console.log("re-calc mines");
        newMines = calcNewMines();
      }
      setMines(newMines);
      setRevealedCells([id]);
      return; 
    }
    else {
      setIsGameOver(true);
      return;
    }
  }
  
  if (adjacentMines[id]) {
    // 주변에 지뢰가 있다면 그 셀만 밝히기
    setRevealedCells([...revealedCells, id]);
  }
  else {
    // 주변 지뢰가 없다면 BFS 
    const queue = [id];
    const visited = [id, ...revealedCells];
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

const handleCellRClickFactory = (
  revealedCells: number[], flaggedCells: number[], setFlaggedCells: React.Dispatch<React.SetStateAction<number[]>>
) => 
  (id: number): React.MouseEventHandler<SVGSVGElement> => 
  (e: React.MouseEvent<SVGSVGElement>) => {
  e.preventDefault();
  // 깃발이 있으면 빼고, 없으면 넣기
  if (revealedCells.includes(id)) return; // 이미 밝혀진 셀이면 깃발 X
  setFlaggedCells(flaggedCells.includes(id) ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);
}