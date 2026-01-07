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
        id: "countries-fill",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#000",
                "transparent",
            ],
            "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.3,
                0,
            ],
        },
    },
    {
        id: "coastline",
        source: "countries",
        "source-layer": "countries",
        type: "line",
        paint: { "line-color": "#198EC8", "line-width": 1 },
    },
    {
        id: "capitals-points",
        type: "circle",
        source: "capitals",
        paint: {
            "circle-radius": 6,
            "circle-color": "#FF0000",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
        },
    },
    {
        id: "capitals-labels",
        type: "symbol",
        source: "capitals",
        layout: {
            "text-field": ["get", "capital"],
            "text-font": ["Open Sans Regular"],
            "text-offset": [0, 1.5],
            "text-anchor": "top",
            "text-size": 12,
        },
        paint: {
            "text-color": "#FFFFFF",
            "text-halo-color": "#000000",
            "text-halo-width": 1,
        },
    },
];