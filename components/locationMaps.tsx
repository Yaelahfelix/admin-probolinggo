// components/OpenLayersMap.tsx
import React, { useEffect, useRef } from "react";
import "ol/ol.css"; // Import CSS OpenLayers
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM"; // OpenStreetMap sebagai sumber peta
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon, Circle, Fill, Stroke, Text } from "ol/style";
import { Button } from "./ui/button";

interface OpenLayersMapProps {
  latitude: number;
  longitude: number;
}

const OpenLayersMap: React.FC<OpenLayersMapProps> = ({
  latitude,
  longitude,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const center = fromLonLat([longitude, latitude]);

    const marker = new Feature({
      geometry: new Point(center),
    });

    const svgMarker = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
        <path fill="#E74C3C" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"/>
        <circle fill="#FFFFFF" cx="12" cy="12" r="4"/>
      </svg>
    `;

    const svgUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarker);

    marker.setStyle(
      new Style({
        image: new Icon({
          src: svgUrl,
          anchor: [0.5, 1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          scale: 1,
        }),
      })
    );

    /*     marker.setStyle(
      new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#E74C3C'
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2
          })
        }),
        text: new Text({
          text: '📍',
          font: '24px sans-serif',
          offsetY: -12
        })
      })
    );
    */

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [marker],
          }),
        }),
      ],
      view: new View({
        center: center,
        zoom: 15,
      }),
    });

    return () => map.setTarget(undefined);
  }, [latitude, longitude]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };
  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px" }}
        className="rounded-lg shadow overflow-hidden"
      />
      <Button onClick={openGoogleMaps} className="w-full mt-3">
        Buka di Google Maps
      </Button>
    </div>
  );
};

export default OpenLayersMap;
