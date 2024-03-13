interface LatLngBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

let map: google.maps.Map;
const TILE_SIZE_METERS = 1000; // 1km

async function initMap(): Promise<void> {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  map = new Map(document.getElementById("map") as HTMLElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  map.addListener('click', (event: google.maps.MapMouseEvent) => {
    const clickedLocation = event.latLng;
    if (clickedLocation) {
      const bounds = getBoundsAroundLocation(clickedLocation, TILE_SIZE_METERS);
      fetchRoadsData(bounds)
        .then(roads => {
          console.log('Fetched roads data:', roads);
        })
        .catch(error => {
          console.error('Error fetching roads data:', error);
        })
    }
  });
}

function getBoundsAroundLocation(location: google.maps.LatLng, radiusMeters: number): LatLngBounds {
  const northEast = google.maps.geometry.spherical.computeOffset(location, radiusMeters, 0);
  const southWest = google.maps.geometry.spherical.computeOffset(location, radiusMeters, 180);
  

  return {
      north: northEast.lat(),
      south: southWest.lat(),
      east: northEast.lng(),
      west: southWest.lng()
  };
}

function fetchRoadsData(bounds: LatLngBounds): Promise<google.maps.Data> {
  return new Promise((resolve, reject) => {
    const roads = new google.maps.Data();

    const origin = new google.maps.LatLng(bounds.south, bounds.west);
    const destination = new google.maps.LatLng(bounds.north, bounds.east);

    const roadsRequest: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(roadsRequest, (response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === google.maps.DirectionsStatus.OK) {
        for (const route of response!.routes) {
          const path: google.maps.LatLng[] = route.overview_path;
          const poly = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          poly.setMap(map);
          console.log(path.map(p => p.toJSON()));
          console.log(poly);
          roads.addGeoJson(poly);
        }
        resolve(roads);
      } else {
        reject(new Error(`Error fetching roads data: ${status}`));
      }
    });
  });
};

initMap();