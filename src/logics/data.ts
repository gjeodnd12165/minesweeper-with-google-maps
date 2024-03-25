import getConvertedData from "./convertData";
import getNodes from "./nodes";

async function getData(address: string, width: number, height: number) {
  const rawData: GeoJSON.FeatureCollection = await getNodes(address);
  return getConvertedData(rawData, width, height);
}

export default getData;