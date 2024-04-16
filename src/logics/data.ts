import getConvertedData from "./convertData";
import { center, getNodes, rectBounds } from "./nodes";

let rawData: GeoJSON.FeatureCollection;

async function getData(address: string, width: number, height: number) {
  rawData = await getNodes(address);
  return getConvertedData(rawData, width, height);
}

export {
  rectBounds,
  center,
  rawData,
  getData
};