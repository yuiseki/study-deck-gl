/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
// maplibre
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
// deck.gl
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";

import "./App.css";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

// heatmap
const HEATMAP_DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json"; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -73.75,
  latitude: 40.73,
  zoom: 9,
  maxZoom: 16,
  bearing: 0,
  pitch: 30,
};

const MAP_STYLE = "https://tile.openstreetmap.jp/styles/osm-bright/style.json";

const App: React.FC = () => {
  const onClick = (info) => {
    if (info.object) {
      // eslint-disable-next-line
      alert(
        `${info.object.properties.name} (${info.object.properties.abbrev})`
      );
    }
  };
  const mapStyle = MAP_STYLE;
  const layers = [
    new GeoJsonLayer({
      id: "base-map",
      data: COUNTRIES,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      opacity: 0.2,
      getLineColor: [60, 60, 60],
      getFillColor: [200, 200, 200],
    }),
    new GeoJsonLayer({
      id: "airports",
      data: AIR_PORTS,
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 500,
      getPointRadius: (f) => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      pickable: true,
      autoHighlight: true,
      onClick,
    }),
    new ArcLayer({
      id: "arc-layer",
      data: AIR_PORTS,
      dataTransform: (d) =>
        d.features.filter((f) => f.properties.scalerank < 4),
      // Jhon F. Kennedy International Airport
      getSourcePosition: (f) => [-73.780968, 40.641766],
      getTargetPosition: (f) => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1,
    }),
    new HeatmapLayer({
      data: HEATMAP_DATA_URL,
      id: "heatmp-layer",
      pickable: false,
      getPosition: (d) => [d[0], d[1]],
      getWeight: (d) => d[2],
      radiusPixels: 30,
      intensity: 0.9,
      threshold: 0.4,
    }),
  ];
  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map reuseMaps mapStyle={mapStyle} styleDiffing={true} />
      </DeckGL>
    </>
  );
};

export default App;
