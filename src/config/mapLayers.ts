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
    // Large airports
    {
        id: "airports-large",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "large_airport"],
        paint: {
            "circle-radius": 6,
            "circle-color": "#e74c3c",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Medium airports
    {
        id: "airports-medium",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "medium_airport"],
        paint: {
            "circle-radius": 4.5,
            "circle-color": "#f39c12",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Small airports
    {
        id: "airports-small",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "small_airport"],
        paint: {
            "circle-radius": 3,
            "circle-color": "#3498db",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Heliports
    {
        id: "airports-heliport",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "heliport"],
        paint: {
            "circle-radius": 2.5,
            "circle-color": "#9b59b6",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Seaplane bases
    {
        id: "airports-seaplane",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "seaplane_base"],
        paint: {
            "circle-radius": 2.5,
            "circle-color": "#1abc9c",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Balloonports
    {
        id: "airports-balloonport",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "balloonport"],
        paint: {
            "circle-radius": 2,
            "circle-color": "#e91e63",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    // Closed airports
    {
        id: "airports-closed",
        type: "circle",
        source: "airports",
        filter: ["==", ["get", "type"], "closed"],
        paint: {
            "circle-radius": 2,
            "circle-color": "#95a5a6",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.6,
        },
    },
    // Large airport labels
    {
        id: "airports-labels-large",
        type: "symbol",
        source: "airports",
        filter: ["==", ["get", "type"], "large_airport"],
        layout: {
            "text-field": ["get", "code"],
            "text-font": ["Open Sans Bold"],
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-size": 10,
        },
        paint: {
            "text-color": "#2c3e50",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
        },
    },
    // Medium airport labels
    {
        id: "airports-labels-medium",
        type: "symbol",
        source: "airports",
        filter: ["==", ["get", "type"], "medium_airport"],
        layout: {
            "text-field": ["get", "code"],
            "text-font": ["Open Sans Bold"],
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-size": 9,
        },
        paint: {
            "text-color": "#2c3e50",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
        },
    },
];