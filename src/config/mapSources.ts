import type { FeatureCollection, LineString, Point } from "geojson";
import type { SourceSpecification } from "maplibre-gl";
import countriesData from "../data/data.json";

const continentsDataUrl = new URL("../data/continents.json", import.meta.url)
    .href;
const airportsDataUrl = new URL("../data/airports.json", import.meta.url).href;
const timezonePolygonsDataUrl = `${import.meta.env.BASE_URL}timezones-now.min.json`;
const timezoneLabelsDataUrl = `${import.meta.env.BASE_URL}timezone-labels-now.json`;
const countriesGeoJson = countriesData as FeatureCollection<
    Point,
    Record<string, unknown>
>;

export const MAP_SOURCES: Record<string, SourceSpecification> = {
    countriesData: {
        type: "geojson",
        data: countriesGeoJson,
    },
    populationHeatmap: {
        type: "geojson",
        data: countriesGeoJson,
    },
    satellite: {
        type: "raster",
        tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
    },
    basic: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
    },
    countries: {
        type: "vector",
        tiles: ["https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf"],
    },
    continents: {
        type: "geojson",
        data: continentsDataUrl,
    },
    airports: {
        type: "geojson",
        data: airportsDataUrl,
    },
    timezones: {
        type: "geojson",
        data: timezonePolygonsDataUrl,
    },
    timezoneLabels: {
        type: "geojson",
        data: timezoneLabelsDataUrl,
    },
    measurementLine: {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [],
        } as FeatureCollection<LineString, Record<string, never>>,
    },
    measurementPoints: {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [],
        } as FeatureCollection<Point, Record<string, never>>,
    },
    measurementLabel: {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [],
        } as FeatureCollection<Point, { label: string }>,
    },
    nightLights: {
        type: "raster",
        tiles: [
            "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_DayNightBand_ENCC/default/2023-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png",
        ],
        tileSize: 256,
        maxzoom: 8,
        attribution: "NASA VIIRS Day/Night Band",
    },
    terrainSource: {
        type: "raster-dem",
        tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        encoding: "terrarium",
        tileSize: 256,
        maxzoom: 15,
    },
};
