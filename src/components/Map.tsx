import React from 'react';
import './Map.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import * as L from 'leaflet';
import { rectBounds } from '../logics/nodes';


interface Props {
  position: [number, number];
  data: GeoJSON.FeatureCollection;
}

const Map: React.FC<Props> = ({ position, data }: Props) => {
  return (
    <MapContainer 
    id="map"
    center={position} 
    zoom={20} 
    scrollWheelZoom={false}
    zoomControl={false}
    dragging={false}
    doubleClickZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Rectangle
        bounds={[[rectBounds.south, rectBounds.east], [rectBounds.north, rectBounds.west]]}
      />
      {
        data?.features.map((feature) => {
          if(feature.geometry.type === "Point"){
            const [lng, lat] = feature.geometry.coordinates;
            return (
              <Marker position={[lat, lng]} icon={
                new L.Icon({
                  iconUrl: "https://www.svgrepo.com/download/476893/marker.svg",
                  iconSize: new L.Point(30, 30)
                })
              }>
                <Popup>
                  {feature.properties?.name}
                </Popup>
              </Marker>
            );
          }
        })
      }
    </MapContainer>
  )
}

export default Map;