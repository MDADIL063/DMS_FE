import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";

interface IProps {
  lat?: number;
  lng?: number;
  height?: string;
  disableClick?: boolean;
  zoom?: number;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  fullscreenControl?: boolean;
  latLngChange?: (lat: number, lng: number) => void;
}

const GeoMap = ({
  lat,
  lng,
  height = "375px",
  disableClick = false,
  zoom = 16,
  zoomControl = true,
  mapTypeControl = true,
  fullscreenControl = true,
  latLngChange = (lat, lng) => {},
}: IProps) => {
  const [mapCenter, setMapCenter] = useState({ lat: lat || 19.086022922443416, lng: lng || 72.90804243684849 });
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (disableClick) {
      return;
    }
    const lat = e.latLng?.lat() as number;
    const lng = e.latLng?.lng() as number;

    setMapCenter({ lat, lng });
    latLngChange(lat, lng);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height }}
      center={mapCenter}
      zoom={zoom}
      options={{ streetViewControl: false, disableDoubleClickZoom: true, zoomControl, mapTypeControl, fullscreenControl }}
      onClick={handleMapClick}
    >
      <Marker position={mapCenter}></Marker>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(GeoMap);
