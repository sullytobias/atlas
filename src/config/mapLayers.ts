import type { LayerSpecification } from "maplibre-gl";

export const MAP_LAYERS: LayerSpecification[] = [
    {
        id: "basic-base",
        type: "raster",
        source: "basic",
    },
    {
        id: "satellite-base",
        type: "raster",
        source: "satellite",
    },
    {
        id: "coastline",
        source: "coastline",
        "source-layer": "countries",
        type: "line",
        paint: { "line-color": "#198EC8" },
    },
    {
        id: "capitals-points",
        type: "circle",
        source: "capitals",
        filter: ["==", ["get", "adm0cap"], 1],
        paint: {
            "circle-color": "#c20b0bff",
            "circle-radius": 5,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#000",
        },
    },
    {
        id: "capitals-labels",
        type: "symbol",
        source: "capitals",
        filter: ["==", ["get", "adm0cap"], 1],
        layout: {
            "text-field": ["get", "name"],
            "text-size": 10,
            "text-offset": [0, 1.5],
        },
        paint: {
            "text-color": "#000",
            "text-halo-color": "#fff",
            "text-halo-width": 2,
        },
    },
];