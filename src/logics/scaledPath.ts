import { parsePath } from "svg-round-corners";

interface PathCommand {
  marker: string;
  values: {
    x: number;
    y: number;
  };
}

export default function getScaledPath(path: string, x: number, y: number, scale: number = 0.9): string {
  const parsedPath = parsePath(path) as PathCommand[];

  let scaledPath = '';

  for (const { marker, values } of parsedPath) {
    switch (marker) {
      case 'M':
        scaledPath += `M${(values.x - x) * scale + x},${(values.y - y) * scale + y}`;
        break;
      case 'L':
        scaledPath += `L${(values.x - x) * scale + x},${(values.y - y) * scale + y}`;
        break;
      case 'Z':
        scaledPath += 'Z';
        break;
      default:
        break;
    }
  }

  return scaledPath;
}