import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { Popup, MapMouseEvent } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

import { MAP_SOURCES } from "../config/mapSources";
import { MAP_LAYERS } from "../config/mapLayers";
import { useMapInstance } from "../hooks/useMapInstance";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import countryData from "../data/data.json";
import Loader from "./Loader/Loader";
import {
    createCountryPopup,
    createAirportPopup,
} from "../utils/popupTemplates";

type Props = {
    showCoastlines: boolean;
    showSatellite: boolean;
    showCapitals: boolean;
    showContinents: boolean;
    showHeatmap: boolean;
    showGlobe?: boolean;
    show3DBuildings?: boolean;
    showTerrain?: boolean; // Add this
    showAirports?: {
        large?: boolean;
        medium?: boolean;
        small?: boolean;
        heliport?: boolean;
        seaplane?: boolean;
        closed?: boolean;
        balloonport?: boolean;
    };
};

type CountryProps = {
    capital: string;
    country: string;
    population: number;
    flag: string;
    flagAlt: string;
    currencies: string;
    area: number;
    languages: string;
    car: { side: string };
    continents: string[];
};

type CountryDataFeature = {
    properties: {
        cca3: string;
        capital: string;
        country: string;
        population: number;
        flag: string;
        flagAlt: string;
        currencies: string;
        area: number;
        languages: string;
        car: { side: string };
    };
};

const CODE_MAPPING: Record<string, string> = {
    SDS: "SSD",
};

export default function Map({
    showCoastlines,
    showSatellite,
    showCapitals = false,
    showContinents = false,
    showHeatmap = false,
    showGlobe = false,
    show3DBuildings = false,
    showTerrain = false, // Add this
    showAirports = {
        large: false,
        medium: false,
        small: false,
        heliport: false,
        seaplane: false,
        closed: false,
        balloonport: false,
    },
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<Popup | null>(null);
    const hoveredCountryId = useRef<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const style = useMemo<StyleSpecification>(
        () => ({
            version: 8,
            sources: MAP_SOURCES,
            layers: MAP_LAYERS,
        }),
        []
    );

    const mapRef = useMapInstance(containerRef, style);

    const visibilityConfigs = useMemo(
        () => [
            { layerId: "satellite-base", condition: showSatellite },
            { layerId: "basic-base", condition: !showSatellite },
            { layerId: "hillshade", condition: showTerrain },
            { layerId: "coastline", condition: showCoastlines },
            { layerId: "capitals-points", condition: showCapitals },
            {
                layerId: "capitals-labels",
                condition: showCapitals && showSatellite,
            },
            {
                layerId: "continents-fill",
                condition: showContinents,
            },
            {
                layerId: "population-choropleth",
                condition: showHeatmap,
            },
            {
                layerId: "airports-large",
                condition: showAirports.large ?? false,
            },
            {
                layerId: "airports-medium",
                condition: showAirports.medium ?? false,
            },
            {
                layerId: "airports-small",
                condition: showAirports.small ?? false,
            },
            {
                layerId: "airports-heliport",
                condition: showAirports.heliport ?? false,
            },
            {
                layerId: "airports-seaplane",
                condition: showAirports.seaplane ?? false,
            },
            {
                layerId: "airports-closed",
                condition: showAirports.closed ?? false,
            },
            {
                layerId: "airports-balloonport",
                condition: showAirports.balloonport ?? false,
            },
            {
                layerId: "airports-labels-large",
                condition: showAirports.large ?? false,
            },
            {
                layerId: "airports-labels-medium",
                condition: showAirports.medium ?? false,
            },
        ],
        [
            showCoastlines,
            showSatellite,
            showCapitals,
            showContinents,
            showHeatmap,
            showTerrain,
            showAirports,
        ]
    );

    useLayerVisibility(mapRef, visibilityConfigs);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const loadPopulationData = () => {
            const countriesDataTyped = countryData as {
                features: CountryDataFeature[];
            };

            countriesDataTyped.features.forEach((feature) => {
                const cca3 =
                    CODE_MAPPING[feature.properties.cca3] ||
                    feature.properties.cca3;

                const countryFeatures = map.querySourceFeatures("countries", {
                    sourceLayer: "countries",
                    filter: ["==", "ADM0_A3", cca3],
                });

                countryFeatures.forEach((f) => {
                    if (f.id !== undefined) {
                        map.setFeatureState(
                            {
                                source: "countries",
                                sourceLayer: "countries",
                                id: f.id,
                            },
                            {
                                population: feature.properties.population,
                            }
                        );
                    }
                });
            });
        };

        const onStyleLoad = () => {
            if (map.isSourceLoaded("countries")) {
                loadPopulationData();
            } else {
                map.once("sourcedata", (e) => {
                    if (e.sourceId === "countries" && e.isSourceLoaded) {
                        loadPopulationData();
                    }
                });
            }
        };

        if (map.isStyleLoaded()) {
            onStyleLoad();
        } else {
            map.once("load", onStyleLoad);
        }
    }, []);

    const formatLanguages = useCallback((languages: string): string => {
        return languages
            .split(",")
            .map((lang) => lang.trim())
            .map(
                (lang) =>
                    `<a target="_blank" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                        lang
                    )}_language">${lang}</a>`
            )
            .join(", ");
    }, []);

    const clearHoveredCountry = useCallback(() => {
        const map = mapRef.current;
        if (!map || hoveredCountryId.current === null) return;

        map.setFeatureState(
            {
                source: "countries",
                sourceLayer: "countries",
                id: hoveredCountryId.current,
            },
            { hover: false }
        );
        hoveredCountryId.current = null;
    }, []);

    const setHoveredCountry = useCallback((countryId: string | number) => {
        const map = mapRef.current;
        if (!map) return;

        map.setFeatureState(
            {
                source: "countries",
                sourceLayer: "countries",
                id: countryId,
            },
            { hover: true }
        );
        hoveredCountryId.current = countryId;
    }, []);

    const handleClick = useCallback(
        (e: MapMouseEvent) => {
            const map = mapRef.current;
            if (!map) return;

            const airportFeatures = map.queryRenderedFeatures(e.point, {
                layers: [
                    "airports-large",
                    "airports-medium",
                    "airports-small",
                    "airports-heliport",
                    "airports-seaplane",
                    "airports-closed",
                    "airports-balloonport",
                ],
            });

            if (airportFeatures.length > 0) {
                const airport = airportFeatures[0].properties;

                const airportPopupContent = createAirportPopup({
                    name: airport?.name || "Unknown Airport",
                    link: airport?.wikipedia_link,
                });

                popupRef.current?.remove();
                popupRef.current = new Popup({
                    closeButton: true,
                    closeOnClick: false,
                    maxWidth: "none",
                })
                    .setLngLat(e.lngLat)
                    .setHTML(airportPopupContent)
                    .addTo(map);
                return;
            }

            const features = map.queryRenderedFeatures(e.point, {
                layers: ["countries-fill"],
            });

            if (features.length === 0) {
                popupRef.current?.remove();
                popupRef.current = null;
                return;
            }

            const { ADM0_A3, CONTINENT } = features[0].properties || {};
            const mappedCode = CODE_MAPPING[ADM0_A3] || ADM0_A3;

            if (!mappedCode) return;

            const countryFeature = (
                countryData as { features: CountryDataFeature[] }
            ).features.find((f) => f.properties.cca3 === mappedCode);

            if (!countryFeature) {
                console.warn(`No country data found for: ${ADM0_A3}`);
                return;
            }

            const enrichedProperties = {
                ...countryFeature.properties,
                continents: [CONTINENT],
            };

            const popupContent = createCountryPopup(
                enrichedProperties,
                formatLanguages
            );

            popupRef.current?.remove();
            popupRef.current = new Popup({
                closeButton: true,
                closeOnClick: false,
            })
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);
        },
        [formatLanguages]
    );

    const handleMouseMove = useCallback(
        (e: MapMouseEvent) => {
            const map = mapRef.current;
            if (!map) return;

            const features = map.queryRenderedFeatures(e.point, {
                layers: ["countries-fill"],
            });

            if (features.length > 0) {
                map.getCanvas().style.cursor = "pointer";

                const countryId = features[0].id;
                if (countryId === undefined) return;

                if (hoveredCountryId.current !== countryId) {
                    clearHoveredCountry();
                    setHoveredCountry(countryId);
                }
            } else {
                map.getCanvas().style.cursor = "default";
                clearHoveredCountry();
            }
        },
        [clearHoveredCountry, setHoveredCountry]
    );

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const onLoad = () => {
            map.on("click", handleClick);
            map.on("mousemove", handleMouseMove);
            setIsLoading(false);
        };

        if (map.isStyleLoaded()) {
            onLoad();
        } else {
            map.once("load", onLoad);
        }

        return () => {
            map.off("click", handleClick);
            map.off("mousemove", handleMouseMove);
            popupRef.current?.remove();
        };
    }, [handleClick, handleMouseMove]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const applyProjection = () => {
            if (showGlobe) {
                map.setProjection({ type: "globe" });
                map.setZoom(1.3);
                map.easeTo({ center: [0, 20], duration: 1000 });
            } else {
                map.setProjection({ type: "mercator" });
            }
        };

        if (map.isStyleLoaded()) {
            applyProjection();
        } else {
            map.once("load", applyProjection);
        }
    }, [showGlobe]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const applyTerrain = () => {
            if (showTerrain) {
                map.setTerrain({
                    source: "terrainSource",
                    exaggeration: 1.5,
                });
            } else {
                map.setTerrain(null);
            }
        };

        if (map.isStyleLoaded()) {
            applyTerrain();
        } else {
            map.once("load", applyTerrain);
        }
    }, [showTerrain]);

    return (
        <>
            <Loader isLoading={isLoading} />
            <div ref={containerRef} className="map" />
        </>
    );
}
