export interface Handlers {
  handleCellHover: (id: number) => React.MouseEventHandler<SVGSVGElement>;
  handleCellLClick: (id: number) => React.MouseEventHandler<SVGSVGElement>;
  handleDoubleClick: (id: number) => React.MouseEventHandler<SVGSVGElement>;
  handleCellRClick: (id: number) => React.MouseEventHandler<SVGSVGElement>;
}

export interface Datum {
  name: string;
  x: number;
  y: number
}

export interface Options {
  width: number;
  height: number;
}