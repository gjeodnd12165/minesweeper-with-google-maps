import axios from 'axios';
import osmtogeojson from 'osmtogeojson';


export interface BBox {
  south: number;
  west: number;
  north: number;
  east: number;
}

// lat, lon
type Location = [number, number];

let center: Location;
let rectBounds: BBox;

// OpenStreetMap API를 사용하여 주소로부터 위도와 경도를 가져오는 함수
async function getCoordinates(address: string): Promise<Location> {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
  const { lat, lon } = response.data[0]; // 가장 상위 검색 결과
  return [ parseFloat(lat), parseFloat(lon) ];
}

// Overpass API를 사용하여 주어진 좌표 주변의 건물 및 도로 정보를 가져오는 함수
async function getNearbyData(rectBounds: BBox): Promise<JSON> {
  console.log(rectBounds);
  const query = `
  [out:json];
  node[name]
    (${rectBounds.south}, ${rectBounds.west}, ${rectBounds.north}, ${rectBounds.east});
  out geom;
  `
  const response = await axios.get(`http://overpass-api.de/api/interpreter?data=${query}`);

  return response.data;
}

function getBoundsAroundLocation(location: Location, radiusMeters: number): BBox{
  const south: number = center[0] - radiusMeters / 111320 
  const west: number = center[1] - radiusMeters / (111320 * Math.cos(center[0] * Math.PI / 180));
  const north: number = center[0] + radiusMeters / 111320;
  const east: number = center[1] + radiusMeters / (111320 * Math.cos(center[0] * Math.PI / 180));

  return {
    south: south,
    west: west,
    north: north,
    east: east
  };
}

// 메인 함수
async function getNodes(address: string): Promise<GeoJSON.FeatureCollection> {
  // 주소로부터 위도와 경도를 가져옴
  center = await getCoordinates(address);
  rectBounds = getBoundsAroundLocation(center, 200);
  // 주어진 좌표 주변의 건물 및 도로 정보를 가져옴
  const nearbyData: JSON = (await getNearbyData(rectBounds));
  // convert osm data to geojson
  const geoJsonData: GeoJSON.FeatureCollection = osmtogeojson(nearbyData, {
    verbose: false,
    flatProperties: true
  });

  return geoJsonData;
}

export {
  rectBounds,
  center,
  getNodes
};