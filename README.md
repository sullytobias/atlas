# Atlas

Atlas is an interactive world map built with React, TypeScript, Vite, and MapLibre GL.
It lets you explore countries and capitals, toggle thematic layers, search locations, and inspect airport and terrain overlays without leaving the map.

## Features

- Click countries to open detail popups with capital, population, area, languages, currencies, and driving side.
- Toggle coastlines, capitals, satellite imagery, population choropleth, and continent overlays.
- Use advanced layers for airport categories, globe projection, and 3D terrain.
- Search by country or capital and fly the map to the selected result.
- Use the legend to interpret continent colors and the population layer scale.

## Stack

- React 19
- TypeScript
- Vite
- MapLibre GL
- Zustand

## Getting Started

Prerequisites:

- Node.js 18 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run generate:data
```

`npm run generate:data` refreshes [`src/data/data.json`](/Users/sullivantobias/Desktop/Perso/atlas/src/data/data.json) from the REST Countries API.

## Project Structure

```text
src/
  components/
    Legend/
    MapControls/
    SearchBar/
    SimpleLoader/
    Map.tsx
  config/
    mapLayers.ts
    mapSources.ts
  constants/
    continents.ts
  data/
    airports.json
    continents.json
    data.json
  hooks/
    useLayerVisibility.ts
    useMapInstance.ts
    useMapPopups.ts
  store/
    loadingStore.ts
  styles/
    index.css
    map.css
    popup.css
  utils/
    countryCodeMappings.ts
    popupTemplates.ts
  App.tsx
  main.tsx
```

## Data Sources

- OpenStreetMap raster tiles
- ArcGIS World Imagery tiles
- MapLibre demo vector tiles
- REST Countries API for generated country metadata

## Notes

- Large airport and continent datasets are emitted as separate build assets to keep the main JS bundle smaller.
- No automated test suite is configured yet.
