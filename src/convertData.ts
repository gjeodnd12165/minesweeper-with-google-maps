import { RawData, RefinedData } from "./types";

export const getConvertedData = (data: RawData) => {
  const refined = new Array<RefinedData>();

  data.features.forEach((feature) => {
    const {name} = feature.properties;
    /**
     * need to convert [latitude, longitude] to [x, y]
     */
    const [x, y] = feature.geometry.coordinates;
    refined.push({
      name: name,
      x: x,
      y: y
    });
  });
  
  return refined;
}