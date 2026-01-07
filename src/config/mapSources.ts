import type { SourceSpecification } from "maplibre-gl";
import capitalsData from "../data/capitals.json";

export const MAP_SOURCES: Record<string, SourceSpecification> = {
    capitals: {
        type: "geojson",
        data: capitalsData as any,
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
};