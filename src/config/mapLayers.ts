import type { LayerSpecification } from "maplibre-gl";
import { getContinentColorExpression } from "../constants/continents";

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
        id: "population-choropleth",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-color": [
                "case",
                ["!=", ["feature-state", "population"], null],
                [
                    "interpolate",
                    ["linear"],
                    ["feature-state", "population"],
                    0,
                    "#E0F3FF",
                    1000000,
                    "#87CEEB",
                    10000000,
                    "#4169E1",
                    50000000,
                    "#FFA500",
                    100000000,
                    "#FF4500",
                    500000000,
                    "#DC143C",
                    1000000000,
                    "#8B008B",
                ],
                "transparent",
            ],
            "fill-opacity": 0.5,
        },
    },
    {
        id: "countries-tint",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.25,
                0,
            ],
        },
    },
    {
        id: "countries-fill",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.1,
                0,
            ],
        },
    },
    {
        id: "coastline",
        source: "countries",
        "source-layer": "countries",
        type: "line",
        paint: { "line-color": "#198EC8", "line-width": 2 },
    },
    {
        id: "capitals-points",
        type: "circle",
        source: "countriesData",
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
        source: "countriesData",
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
    {
        id: "continents-fill",
        type: "fill",
        source: "continents",
        paint: {
            "fill-color": getContinentColorExpression(),
            "fill-opacity": 0.4,
        },
    },
];