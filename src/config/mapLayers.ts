import type {
    ExpressionSpecification,
    LayerSpecification,
} from "maplibre-gl";
import { getContinentColorExpression } from "../constants/continents";
import countryData from "../data/data.json";
import gdpData from "../data/gdpData.json";
import {
    ADDITIONAL_TERRITORIES,
    CODE_MAPPING,
} from "../utils/countryCodeMappings";

type CountryDataFeature = {
    properties: {
        cca3: string;
        populationDensity?: number;
        population: number;
    };
};

function buildCountryMetricExpression(
    metricSelector: (feature: CountryDataFeature["properties"]) => number,
): ExpressionSpecification {
    const metricByCode = new Map<string, number>();
    const countries = (countryData as { features: CountryDataFeature[] })
        .features;

    countries.forEach((feature) => {
        const sourceCode =
            CODE_MAPPING[feature.properties.cca3] || feature.properties.cca3;
        const metric = metricSelector(feature.properties);

        metricByCode.set(sourceCode, metric);

        const additionalTerritories =
            ADDITIONAL_TERRITORIES[feature.properties.cca3] || [];
        additionalTerritories.forEach((territoryCode) => {
            metricByCode.set(territoryCode, metric);
        });
    });

    return [
        "match",
        ["get", "ADM0_A3"],
        ...Array.from(metricByCode.entries()).flatMap(([code, value]) => [
            code,
            value,
        ]),
        -1,
    ] as unknown as ExpressionSpecification;
}

const POPULATION_EXPRESSION = buildCountryMetricExpression(
    (properties) => properties.population,
);
const DENSITY_EXPRESSION = buildCountryMetricExpression(
    (properties) => properties.populationDensity ?? -1,
);

const gdpByCode = gdpData as Record<string, number>;
const GDP_EXPRESSION: ExpressionSpecification = [
    "match",
    ["get", "ADM0_A3"],
    ...Object.entries(gdpByCode).flatMap(([code, value]) => [code, value]),
    -1,
] as unknown as ExpressionSpecification;
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
        layout: {
            visibility: "none",
        },
    },
    {
        id: "hillshade",
        type: "hillshade",
        source: "terrainSource",
        layout: {
            visibility: "none",
        },
        paint: {
            "hillshade-exaggeration": 0.4,
            "hillshade-shadow-color": "#000000",
        },
    },
    {
        id: "rain-radar",
        type: "raster",
        source: "rainRadar",
        layout: { visibility: "none" },
        paint: { "raster-opacity": 0.7 },
    },
    {
        id: "night-lights",
        type: "raster",
        source: "nightLights",
        layout: {
            visibility: "none",
        },
        paint: {
            "raster-opacity": 0.9,
            "raster-contrast": 0.5,
            "raster-brightness-min": 0,
            "raster-brightness-max": 0.8,
        },
    },
    {
        id: "density-choropleth",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        layout: {
            visibility: "none",
        },
        paint: {
            "fill-color": [
                "case",
                [">=", DENSITY_EXPRESSION, 0],
                [
                    "interpolate",
                    ["linear"],
                    DENSITY_EXPRESSION,
                    0,
                    "#eef9f1",
                    25,
                    "#d6f1df",
                    100,
                    "#b4e6c8",
                    250,
                    "#87d6ae",
                    500,
                    "#59c096",
                    1000,
                    "#2f9f87",
                ],
                "transparent",
            ],
            "fill-opacity": 0.5,
        },
    },
    {
        id: "gdp-choropleth",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        layout: {
            visibility: "none",
        },
        paint: {
            "fill-color": [
                "case",
                [">=", GDP_EXPRESSION, 0],
                [
                    "interpolate",
                    ["linear"],
                    GDP_EXPRESSION,
                    0,
                    "#fef9e7",
                    1000,
                    "#fde68a",
                    10000,
                    "#fbbf24",
                    100000,
                    "#d97706",
                    1000000,
                    "#92400e",
                    10000000,
                    "#451a03",
                ],
                "transparent",
            ],
            "fill-opacity": 0.5,
        },
    },
    {
        id: "population-choropleth",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        layout: {
            visibility: "none",
        },
        paint: {
            "fill-color": [
                "case",
                [">=", POPULATION_EXPRESSION, 0],
                [
                    "interpolate",
                    ["linear"],
                    POPULATION_EXPRESSION,
                    0,
                    "#d7eef8",
                    1000000,
                    "#acd8f0",
                    10000000,
                    "#84bfe0",
                    50000000,
                    "#f4de9b",
                    100000000,
                    "#f5bc91",
                    500000000,
                    "#eb8f78",
                    1000000000,
                    "#d96f78",
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
        id: "country-visited-fill",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-color": "rgba(34, 197, 94, 0.18)",
        },
        filter: ["==", ["get", "ADM0_A3"], ""],
    },
    {
        id: "country-selected-fill",
        type: "fill",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "fill-color": "rgba(99, 179, 237, 0.25)",
        },
        filter: ["==", ["get", "ADM0_A3"], ""],
    },
    {
        id: "country-selected-outline",
        type: "line",
        source: "countries",
        "source-layer": "countries",
        paint: {
            "line-color": "rgba(99, 179, 237, 1)",
            "line-width": 2,
        },
        filter: ["==", ["get", "ADM0_A3"], ""],
    },
    {
        id: "coastline",
        source: "countries",
        "source-layer": "countries",
        type: "line",
        layout: {
            visibility: "none",
        },
        paint: { "line-color": "#70c8dc", "line-width": 2 },
    },
    {
        id: "capitals-points",
        type: "circle",
        source: "countriesData",
        layout: {
            visibility: "none",
        },
        paint: {
            "circle-radius": 6,
            "circle-color": "#ef9a84",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
        },
    },
    {
        id: "capitals-labels",
        type: "symbol",
        source: "countriesData",
        layout: {
            visibility: "none",
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
        layout: {
            visibility: "none",
        },
        paint: {
            "fill-color": getContinentColorExpression(),
            "fill-opacity": 0.4,
        },
    },
    {
        id: "timezones-fill",
        type: "fill",
        source: "timezones",
        layout: {
            visibility: "none",
        },
        paint: {
            "fill-color": ["coalesce", ["get", "fillColor"], "#b7e4dc"],
            "fill-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                0.2,
                3,
                0.26,
                6,
                0.32,
            ],
        },
    },
    {
        id: "timezones-outline",
        type: "line",
        source: "timezones",
        layout: {
            visibility: "none",
        },
        paint: {
            "line-color": ["coalesce", ["get", "outlineColor"], "#4f8d84"],
            "line-opacity": 0.95,
            "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                4,
                1.8,
                7,
                2.4,
            ],
        },
    },
    {
        id: "timezones-labels",
        type: "symbol",
        source: "timezoneLabels",
        layout: {
            visibility: "none",
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Regular"],
            "text-size": [
                "interpolate",
                ["linear"],
                ["zoom"],
                2,
                11,
                5,
                12,
                8,
                14,
            ],
            "text-anchor": "top",
            "text-offset": [0, 0.8],
        },
        paint: {
            "text-color": ["coalesce", ["get", "textColor"], "#233735"],
            "text-halo-color": "rgba(255, 255, 255, 0.9)",
            "text-halo-width": 1.8,
        },
    },
    {
        id: "measurement-line",
        type: "line",
        source: "measurementLine",
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        paint: {
            "line-color": "#72bfe1",
            "line-width": 4,
            "line-opacity": 0.95,
        },
    },
    {
        id: "measurement-points",
        type: "circle",
        source: "measurementPoints",
        paint: {
            "circle-radius": 5.5,
            "circle-color": "#f8fafc",
            "circle-stroke-color": "#72bfe1",
            "circle-stroke-width": 3,
        },
    },
    {
        id: "measurement-label",
        type: "symbol",
        source: "measurementLabel",
        layout: {
            "text-field": ["get", "label"],
            "text-font": ["Open Sans Bold"],
            "text-offset": [0, -1.4],
            "text-size": 13,
        },
        paint: {
            "text-color": "#f8fafc",
            "text-halo-color": "#082f49",
            "text-halo-width": 1.6,
        },
    },
    {
        id: "flight-routes-glow",
        type: "line",
        source: "flightRoutes",
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "none",
        },
        paint: {
            "line-color": "#a8d8f0",
            "line-width": 3,
            "line-opacity": 0.18,
            "line-blur": 2,
        },
    },
    {
        id: "flight-routes",
        type: "line",
        source: "flightRoutes",
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "none",
        },
        paint: {
            "line-color": "#72bfe1",
            "line-width": 2,
            "line-opacity": 0.55,
        },
    },
    {
        id: "airports-large",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "large_airport"],
        paint: {
            "circle-radius": 6,
            "circle-color": "#ef9a84",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-medium",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "medium_airport"],
        paint: {
            "circle-radius": 4.5,
            "circle-color": "#f2c878",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-small",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "small_airport"],
        paint: {
            "circle-radius": 3,
            "circle-color": "#88c7e8",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-heliport",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "heliport"],
        paint: {
            "circle-radius": 2.5,
            "circle-color": "#99d7ac",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-seaplane",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "seaplane_base"],
        paint: {
            "circle-radius": 2.5,
            "circle-color": "#71cabf",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-balloonport",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "balloonport"],
        paint: {
            "circle-radius": 2,
            "circle-color": "#ef9ab2",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
        },
    },
    {
        id: "airports-closed",
        type: "circle",
        source: "airports",
        layout: {
            visibility: "none",
        },
        filter: ["==", ["get", "type"], "closed"],
        paint: {
            "circle-radius": 2,
            "circle-color": "#b3c3c8",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
            "circle-opacity": 0.6,
        },
    },
    {
        id: "airports-labels-large",
        type: "symbol",
        source: "airports",
        filter: ["==", ["get", "type"], "large_airport"],
        layout: {
            visibility: "none",
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
    {
        id: "airports-labels-medium",
        type: "symbol",
        source: "airports",
        filter: ["==", ["get", "type"], "medium_airport"],
        layout: {
            visibility: "none",
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
    {
        id: "earthquakes-circles",
        type: "circle",
        source: "earthquakes",
        layout: {
            visibility: "none",
        },
        paint: {
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, 3,
                3, 6,
                5, 12,
                7, 22,
                9, 36,
            ] as unknown as ExpressionSpecification,
            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, "#fef3c7",
                3, "#fbbf24",
                5, "#f97316",
                7, "#dc2626",
                9, "#7f1d1d",
            ] as unknown as ExpressionSpecification,
            "circle-opacity": 0.8,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.6,
        },
    },
    {
        id: "volcanoes-circles",
        type: "circle",
        source: "volcanoes",
        layout: {
            visibility: "none",
        },
        paint: {
            "circle-radius": 8,
            "circle-color": "#ef4444",
            "circle-opacity": 0.9,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-opacity": 0.8,
        },
    },
];
