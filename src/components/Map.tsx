import {
    useMemo,
    useRef,
    useEffect,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from "react";
import type { StyleSpecification } from "maplibre-gl";
import { MapMouseEvent } from "maplibre-gl";

import { MAP_SOURCES } from "../config/mapSources";
import { MAP_LAYERS } from "../config/mapLayers";
import { useMapInstance } from "../hooks/useMapInstance";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import { useMapStore } from "../store/loadingStore";
import SimpleLoader from "./SimpleLoader/SimpleLoader";
import { useMapPopups } from "../hooks/useMapPopups";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

type Props = {
    onLoadingComplete?: (key: string) => void;
};

export type MapRef = {
    flyToLocation: (coordinates: [number, number], zoom?: number) => void;
};

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

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

    export default forwardRef<MapRef, Props>(function Map(
        { onLoadingComplete },
        ref
    ) {
        const containerRef = useRef<HTMLDivElement | null>(null);
        const hoveredCountryId = useRef<string | number | null>(null);

        const {
            showCoastlines,
            showSatellite,
            showCapitals,
            showContinents,
            showHeatmap,
            showGlobe,
            showTerrain,
            showAirports,
        } = useMapStore();

        const style = useMemo<StyleSpecification>(
            () => ({
                version: 8,
                sources: MAP_SOURCES,
                layers: MAP_LAYERS,
            }),
            []
        );

        const mapRef = useMapInstance(containerRef, style);

        useImperativeHandle(
            ref,
            () => ({
                flyToLocation: (
                    coordinates: [number, number],
                    zoom: number = 6
                ) => {
                    const map = mapRef.current;
                    if (!map) return;

                    map.flyTo({
                        center: coordinates,
                        zoom: zoom,
                        duration: 2000,
                        essential: true,
                    });
                },
            }),
            [mapRef]
        );

        const visibilityConfigs = useMemo(
            () => [
                {
                    layerId: "satellite-base",
                    condition: showSatellite,
                    loadingKey: "satellite",
                },
                {
                    layerId: "basic-base",
                    condition: !showSatellite,
                    loadingKey: "satellite",
                },
                {
                    layerId: "hillshade",
                    condition: showTerrain,
                },
                {
                    layerId: "coastline",
                    condition: showCoastlines,
                    loadingKey: "coastlines",
                },
                {
                    layerId: "capitals-points",
                    condition: showCapitals,
                    loadingKey: "capitals",
                },
                {
                    layerId: "capitals-labels",
                    condition: showCapitals && showSatellite,
                    loadingKey: "capitals",
                },
                {
                    layerId: "continents-fill",
                    condition: showContinents,
                    loadingKey: "continents",
                },
                {
                    layerId: "population-choropleth",
                    condition: showHeatmap,
                    loadingKey: "heatmap",
                },
                {
                    layerId: "airports-large",
                    condition: showAirports.large ?? false,
                    loadingKey: "airport-large",
                },
                {
                    layerId: "airports-medium",
                    condition: showAirports.medium ?? false,
                    loadingKey: "airport-medium",
                },
                {
                    layerId: "airports-small",
                    condition: showAirports.small ?? false,
                    loadingKey: "airport-small",
                },
                {
                    layerId: "airports-heliport",
                    condition: showAirports.heliport ?? false,
                    loadingKey: "airport-heliport",
                },
                {
                    layerId: "airports-seaplane",
                    condition: showAirports.seaplane ?? false,
                    loadingKey: "airport-seaplane",
                },
                {
                    layerId: "airports-closed",
                    condition: showAirports.closed ?? false,
                    loadingKey: "airport-closed",
                },
                {
                    layerId: "airports-balloonport",
                    condition: showAirports.balloonport ?? false,
                    loadingKey: "airport-balloonport",
                },
                {
                    layerId: "airports-labels-large",
                    condition: showAirports.large ?? false,
                    loadingKey: "airport-large",
                },
                {
                    layerId: "airports-labels-medium",
                    condition: showAirports.medium ?? false,
                    loadingKey: "airport-medium",
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

        useLayerVisibility(mapRef, visibilityConfigs, onLoadingComplete);

        const formatLanguages = useCallback((languages: string): string => {
            return languages
                .split(",")
                .map((lang) => lang.trim())
                .map(
                    (lang) =>
                        `<a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                            lang
                        )}_language">${escapeHtml(lang)}</a>`
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

        const { handleClick, removePopup } = useMapPopups(
            mapRef,
            formatLanguages
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
            };

            if (map.isStyleLoaded()) {
                onLoad();
            } else {
                map.once("load", onLoad);
            }

            return () => {
                map.off("click", handleClick);
                map.off("mousemove", handleMouseMove);
                removePopup();
            };
        }, [handleClick, handleMouseMove, removePopup]);

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

                if (onLoadingComplete) {
                    const clearGlobe = () => onLoadingComplete("globe");
                    if (map.loaded()) {
                        clearGlobe();
                    } else {
                        map.once("idle", clearGlobe);
                    }
                }
            };

            if (map.isStyleLoaded()) {
                applyProjection();
            } else {
                map.once("load", applyProjection);
            }
        }, [showGlobe, onLoadingComplete]);

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

                if (onLoadingComplete) {
                    const clearTerrain = () => onLoadingComplete("terrain");
                    if (map.loaded()) {
                        clearTerrain();
                    } else {
                        map.once("idle", clearTerrain);
                    }
                }
            };

            if (map.isStyleLoaded()) {
                applyTerrain();
            } else {
                map.once("load", applyTerrain);
            }
        }, [showTerrain, onLoadingComplete]);

        return (
            <>
                <SimpleLoader map={mapRef.current} />
                <div ref={containerRef} className="map" />
            </>
        );
    });
