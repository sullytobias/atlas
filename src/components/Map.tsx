// src/components/Map.tsx
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/map.css";


export default function Map() {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={11} style={{ height: "50vh", width: "50vw" }}>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}