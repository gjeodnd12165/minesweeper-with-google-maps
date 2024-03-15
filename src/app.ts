import axios from 'axios';
import * as L from 'leaflet';
import osmtogeojson from 'osmtogeojson';


let map: L.Map = L.map('map');

// OpenStreetMap API를 사용하여 주소로부터 위도와 경도를 가져오는 함수
async function getCoordinates(address: string): Promise<{ latitude: number, longitude: number }> {
  const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
  const { lat, lon } = response.data[0]; // 가장 상위 검색 결과
  return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
}

// Overpass API를 사용하여 주어진 좌표 주변의 건물 및 도로 정보를 가져오는 함수
async function getNearbyData(rectBounds: L.LatLngBounds): Promise<JSON> {
  const query = `
  [out:json];
  way[highway]
    (${rectBounds.getSouth()}, ${rectBounds.getWest()}, ${rectBounds.getNorth()}, ${rectBounds.getEast()});
  out geom;
  `
  const response = await axios.get(`http://overpass-api.de/api/interpreter?data=${query}`);

  return response.data;
}

// 거리 계산 함수
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구의 반지름 (단위: km)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (단위: km)
  return distance;
}

// 각도를 라디안으로 변환하는 함수
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getBoundsAroundLocation(location: L.LatLng, radiusMeters: number): L.LatLngBounds {
  const northEast = L.latLng(location.lat + radiusMeters / 111320, location.lng + radiusMeters / (111320 * Math.cos(location.lat * Math.PI / 180)));
  const southWest = L.latLng(location.lat - radiusMeters / 111320, location.lng - radiusMeters / (111320 * Math.cos(location.lat * Math.PI / 180)));

  return new L.LatLngBounds(southWest, northEast);
}

// 메인 함수
async function main() {
  try {
    // '오픈스트리트맵 한국'에서 서비스하는 '군사 시설 없는 오픈스트리트맵 지도 타일'을 삽입
    L.tileLayer('https://tiles.osm.kr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap 기여자</a>'
    }).addTo(map);

    // 주소로부터 위도와 경도를 가져옴
    const address: string = "강남역";
    const { latitude, longitude } = await getCoordinates(address);
    const rectBounds: L.LatLngBounds = getBoundsAroundLocation(new L.LatLng(latitude, longitude), 300);

    // 위도와 경도에 따른 맵 조정
    map.setView({lng: longitude, lat: latitude}, 17);
    map.setMaxBounds(rectBounds);

    // 주어진 좌표 주변의 건물 및 도로 정보를 가져옴
    const nearbyData = (await getNearbyData(rectBounds));

    // 결과 출력
    
    const boundaryLayer = L.rectangle(rectBounds, {
      color: 'white',
      weight: 3,
    }).addTo(map)
    console.log(rectBounds);
    let geoJsonData = osmtogeojson(nearbyData, {
      flatProperties: true,
      polygonFeatures: ['way']
    });
    
    console.log(geoJsonData);
    const roadsLayer = L.geoJSON(geoJsonData, {
      style: (feature) => ({
        color: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
        weight: 2,
      })
    }).addTo(map);
  } catch (error) {
    console.error("Error:", error);
  }
}

export default main;