import { createContext } from "react";

export const HandlerContext = createContext({
  handleCellHover: (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {console.error("Handler Not Found")},
  handleCellLClick: (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {console.error("Handler Not Found")},
  handleCellDoubleClick: (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {console.error("Handler Not Found")},
  handleCellRClick: (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {console.error("Handler Not Found")}
});