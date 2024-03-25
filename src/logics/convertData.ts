import * as d3 from 'd3';


export interface ConvertedData {
  name: string;
  x: number;
  y: number;
}

const getConvertedData = (rawData: GeoJSON.FeatureCollection, width: number, height: number): ConvertedData[] => {
  /**
   * d3 projection needed
   */
  const projection = d3.geoMercator()
    .fitExtent([[0, 0], [width, height]], rawData);
  
  const refinedData = rawData.features.map((feature) => {
    const name = feature.properties?.name;
    const coordinates: [number, number] = feature.geometry.type === "Point" ? feature.geometry.coordinates as [number, number]: [0, 0];
    const [x, y] = projection(coordinates) ?? [0, 0];
    return {
      name: name,
      x: x,
      y: y
    }
  });
    
  return refinedData;
}

export default getConvertedData;