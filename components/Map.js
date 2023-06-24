import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Circle,
  CircleMarker,
  Popup,
  Tooltip,
} from "react-leaflet";
import { VStack } from "@chakra-ui/react";

// Set default view
export function ChangeView({ coords }) {
  const map = useMap();
  map.setView(coords, 12);
  return null;
}

// Creates the map and the points, takes coordinates generated from top-artists
export default function Map({ coordinates }) {
  const [geoData, setGeoData] = useState({ lat: 40.7128, lng: -74.006 });
  const center = [geoData.lat, geoData.lng];
  const fillBlueOptions = { fillColor: "blue" };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "80vh", width: "150vh" }}
    >
      <ChangeView coords={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.map((item, index) => {
        console.log(item);
        console.log(index);
        const artistName = Object.keys(item)[0];
        const originMap = item[artistName].origin;
        const originCoordinates = { lat: originMap.lat, lng: originMap.lng };
        const birthMap = item[artistName].birthplace;
        const birthCoordinates = { lat: birthMap.lat, lng: birthMap.lng };

        return (
          <>
            {originCoordinates.lat && originCoordinates.lng ? (
              <CircleMarker
                key={index}
                center={originCoordinates}
                pathOptions={{ fillColor: "blue" }}
                radius={5}
              >
                {/* TODO: Implement sticky saying the location and artist!*/}
                <Tooltip sticky>
                  {artistName}
                  {"'s"} Origin: {"\n\n\n"} {originMap.location}
                </Tooltip>
              </CircleMarker>
            ) : (
              <div></div>
            )}

            {birthCoordinates.lat && birthCoordinates.lng ? (
              <CircleMarker
                key={index}
                center={birthCoordinates}
                pathOptions={{ fillColor: "blue" }}
                radius={5}
              >
                {/* TODO: Implement sticky saying the location and artist!*/}
                <Tooltip sticky>
                  {artistName}
                  {"'s"} Birthplace: {"\n\n\n"}
                  {birthMap.location}
                </Tooltip>
              </CircleMarker>
            ) : (
              <div></div>
            )}
          </>
        );
      })}
    </MapContainer>
  );
}
