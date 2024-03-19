import axios from 'axios';
import osmtogeojson from 'osmtogeojson';


interface Square {
  west: number;
  south: number;
  east: number;
  north: number;
}

interface Location {
  latitude: number;
  longitude: number;
}

// OpenStreetMap API를 사용하여 주소로부터 위도와 경도를 가져오는 함수
async function getCoordinates(address: string): Promise<Location> {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
  const { lat, lon } = response.data[0]; // 가장 상위 검색 결과
  return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
}

// Overpass API를 사용하여 주어진 좌표 주변의 건물 및 도로 정보를 가져오는 함수
async function getNearbyData(rectBounds: Square): Promise<JSON> {
  const query = `
  [out:json];
  node[name]
    (${rectBounds.south}, ${rectBounds.west}, ${rectBounds.north}, ${rectBounds.east});
  out geom;
  `
  const response = await axios.get(`http://overpass-api.de/api/interpreter?data=${query}`);

  return response.data;
}

function getBoundsAroundLocation(location: Location, radiusMeters: number): Square{
  const north: number = location.latitude + radiusMeters / 111320;
  const east: number = location.longitude + radiusMeters / (111320 * Math.cos(location.latitude * Math.PI / 180));
  const south: number = location.latitude - radiusMeters / 111320 
  const west: number = location.longitude - radiusMeters / (111320 * Math.cos(location.latitude * Math.PI / 180));

  return {
    north: north,
    east: east,
    south: south,
    west: west
  };
}

// 메인 함수
async function getNodes() {
  try {
    // 주소로부터 위도와 경도를 가져옴
    const address: string = "강남역";
    const location: Location = await getCoordinates(address);
    const rectBounds: Square = getBoundsAroundLocation(location, 200);


    // 주어진 좌표 주변의 건물 및 도로 정보를 가져옴
    const nearbyData = (await getNearbyData(rectBounds));

    // convert osm data to geojson
    const geoJsonData = osmtogeojson(nearbyData, {
      verbose: false,
      flatProperties: true
    });

    return geoJsonData;
    
  } catch (error) {
    console.error("Error:", error);
  }
}

export default getNodes;