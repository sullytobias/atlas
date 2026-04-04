import {
    useMemo,
    useRef,
    useEffect,
    useCallback,
    useImperativeHandle,
    forwardRef,
    useState,
} from "react";
import type { GeoJSONSource, RasterTileSource, StyleSpecification } from "maplibre-gl";
import { MapMouseEvent } from "maplibre-gl";

import { MAP_SOURCES } from "../config/mapSources";
import { getFlightRoutesGeoJson } from "../utils/flightRoutes";
import { MAP_LAYERS } from "../config/mapLayers";
import gdpRaw from "../data/gdpData.json";
import { useMapInstance } from "../hooks/useMapInstance";
import { useLayerVisibility } from "../hooks/useLayerVisibility";
import { useMapStore } from "../store/loadingStore";
import {
    CODE_MAPPING,
    ADDITIONAL_TERRITORIES,
} from "../utils/countryCodeMappings";
import SimpleLoader from "./SimpleLoader/SimpleLoader";
import { useMapPopups } from "../hooks/useMapPopups";
import {
    buildMeasurementLabelGeoJson,
    buildMeasurementLineGeoJson,
    buildMeasurementPointsGeoJson,
} from "../utils/distanceMeasurement";
import { getCountryFeaturesAtPoint } from "../utils/countryFeatureQueries";
import { getSelectedCountryFromFeature } from "../utils/selectedCountry";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

type Props = {
    onLoadingComplete?: (key: string) => void;
    onMapMove?: (lat: number, lng: number, zoom: number) => void;
};

export type MapRef = {
    flyToLocation: (coordinates: [number, number], zoom?: number) => void;
};

const gdpByCode = gdpRaw as Record<string, number>;

function formatGdpMillions(millions: number): string {
    const value = millions * 1e6;
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    return `${(value / 1e6).toFixed(1)}M`;
}

export default forwardRef<MapRef, Props>(function Map(
    { onLoadingComplete, onMapMove },
    ref,
) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hoveredCountryId = useRef<string | number | null>(null);
    const [hoveredGdpInfo, setHoveredGdpInfo] = useState<{
        name: string;
        gdp: number | null;
        x: number;
        y: number;
    } | null>(null);

    const {
        showCoastlines,
        showNightLights,
        showSatellite,
        showCapitals,
        showContinents,
        showTimezones,
        showDensity,
        showGdp,
        showHeatmap,
        showGlobe,
        showTerrain,
        showAirports,
        showWeather,
        showFlightRoutes,
        showEarthquakes,
        showVolcanoes,
        layerOpacities,
        measurementStart,
        selectedMeasurement,
        showCountryComparison,
        pendingFlyTo,
    } = useMapStore();
    const visitedCountries = useMapStore((s) => s.visitedCountries);
    const setHoveredComparisonCountry = useMapStore(
        (state) => state.setHoveredComparisonCountry,
    );
    const setPendingFlyTo = useMapStore((state) => state.setPendingFlyTo);

    const style = useMemo<StyleSpecification>(
        () => ({
            version: 8,
            sources: MAP_SOURCES,
            layers: MAP_LAYERS,
        }),
        [],
    );

    const { map, mapRef } = useMapInstance(containerRef, style);
    const previousLayerStateRef = useRef({
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showTimezones,
        showDensity,
        showGdp,
        showHeatmap,
        showGlobe,
        showTerrain,
        showAirports,
        showFlightRoutes,
        showEarthquakes,
        showVolcanoes,
    });

    useImperativeHandle(
        ref,
        () => ({
            flyToLocation: (
                coordinates: [number, number],
                zoom: number = 6,
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
        [mapRef],
    );

    const visibilityConfigs = useMemo(
        () => [
            {
                layerId: "satellite-base",
                condition: showSatellite,
                loadingKey: "satellite",
                paintProperties: [
                    {
                        name: "raster-opacity",
                        visibleValue: layerOpacities.satellite,
                        hiddenValue: 0,
                    },
                ],
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
                layerId: "night-lights",
                condition: showNightLights,
                loadingKey: "nightLights",
                paintProperties: [
                    {
                        name: "raster-opacity",
                        visibleValue: layerOpacities.nightLights,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "coastline",
                condition: showCoastlines,
                loadingKey: "coastlines",
                paintProperties: [
                    {
                        name: "line-opacity",
                        visibleValue: layerOpacities.coastlines,
                        hiddenValue: 0,
                    },
                ],
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
                paintProperties: [
                    {
                        name: "fill-opacity",
                        visibleValue: layerOpacities.continents,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "timezones-fill",
                condition: showTimezones,
                loadingKey: "timezones",
            },
            {
                layerId: "timezones-outline",
                condition: showTimezones,
                loadingKey: "timezones",
            },
            {
                layerId: "timezones-labels",
                condition: showTimezones,
                loadingKey: "timezones",
            },
            {
                layerId: "density-choropleth",
                condition: showDensity,
                loadingKey: "density",
                paintProperties: [
                    {
                        name: "fill-opacity",
                        visibleValue: layerOpacities.density,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "gdp-choropleth",
                condition: showGdp,
                loadingKey: "gdp",
                paintProperties: [
                    {
                        name: "fill-opacity",
                        visibleValue: layerOpacities.gdp,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "population-choropleth",
                condition: showHeatmap,
                loadingKey: "heatmap",
                paintProperties: [
                    {
                        name: "fill-opacity",
                        visibleValue: layerOpacities.heatmap,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "flight-routes-glow",
                condition: showFlightRoutes,
                loadingKey: "flightRoutes",
                paintProperties: [
                    {
                        name: "line-opacity",
                        visibleValue: layerOpacities.flightRoutes * 0.33,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "flight-routes",
                condition: showFlightRoutes,
                loadingKey: "flightRoutes",
                paintProperties: [
                    {
                        name: "line-opacity",
                        visibleValue: layerOpacities.flightRoutes,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "earthquakes-circles",
                condition: showEarthquakes,
                loadingKey: "earthquakes",
                paintProperties: [
                    {
                        name: "circle-opacity",
                        visibleValue: layerOpacities.earthquakes ?? 0.8,
                        hiddenValue: 0,
                    },
                ],
            },
            {
                layerId: "volcanoes-circles",
                condition: showVolcanoes,
                loadingKey: "volcanoes",
                paintProperties: [
                    {
                        name: "circle-opacity",
                        visibleValue: layerOpacities.volcanoes ?? 0.9,
                        hiddenValue: 0,
                    },
                ],
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
            showNightLights,
            showSatellite,
            showCapitals,
            showContinents,
            showTimezones,
            showDensity,
            showGdp,
            showHeatmap,
            showTerrain,
            showAirports,
            showFlightRoutes,
            showEarthquakes,
            showVolcanoes,
            layerOpacities,
        ],
    );

    useLayerVisibility(map, visibilityConfigs, onLoadingComplete);

    const measurementStartRef = useRef(measurementStart);
    const selectedMeasurementRef = useRef(selectedMeasurement);

    useEffect(() => {
        measurementStartRef.current = measurementStart;
        selectedMeasurementRef.current = selectedMeasurement;
    }, [measurementStart, selectedMeasurement]);

    useEffect(() => {
        if (!map) return;

        const syncMeasurementSources = () => {
            const measurementLineSource = map.getSource("measurementLine") as
                | GeoJSONSource
                | undefined;
            const measurementPointsSource = map.getSource(
                "measurementPoints",
            ) as GeoJSONSource | undefined;
            const measurementLabelSource = map.getSource("measurementLabel") as
                | GeoJSONSource
                | undefined;
            const currentMeasurementStart = measurementStartRef.current;
            const currentSelectedMeasurement = selectedMeasurementRef.current;

            measurementLineSource?.setData(
                buildMeasurementLineGeoJson(
                    currentSelectedMeasurement?.start ?? null,
                    currentSelectedMeasurement?.end ?? null,
                ),
            );
            measurementPointsSource?.setData(
                buildMeasurementPointsGeoJson(
                    currentSelectedMeasurement?.start ??
                        currentMeasurementStart,
                    currentSelectedMeasurement?.end ?? null,
                ),
            );
            measurementLabelSource?.setData(
                buildMeasurementLabelGeoJson(
                    currentSelectedMeasurement?.start ?? null,
                    currentSelectedMeasurement?.end ?? null,
                    currentSelectedMeasurement?.distanceMeters ?? null,
                ),
            );
        };

        if (map.isStyleLoaded()) {
            syncMeasurementSources();
        } else {
            map.once("load", syncMeasurementSources);
        }
    }, [map, measurementStart, selectedMeasurement]);

    useEffect(() => {
        if (!onLoadingComplete) return;

        const previousState = previousLayerStateRef.current;
        const changedKeys = new Set<string>();

        if (previousState.showCoastlines !== showCoastlines) {
            changedKeys.add("coastlines");
        }
        if (previousState.showSatellite !== showSatellite) {
            changedKeys.add("satellite");
        }
        if (previousState.showCapitals !== showCapitals) {
            changedKeys.add("capitals");
        }
        if (previousState.showContinents !== showContinents) {
            changedKeys.add("continents");
        }
        if (previousState.showTimezones !== showTimezones) {
            changedKeys.add("timezones");
        }
        if (previousState.showDensity !== showDensity) {
            changedKeys.add("density");
        }
        if (previousState.showGdp !== showGdp) {
            changedKeys.add("gdp");
        }
        if (previousState.showHeatmap !== showHeatmap) {
            changedKeys.add("heatmap");
        }
        if (previousState.showGlobe !== showGlobe) {
            changedKeys.add("globe");
        }
        if (previousState.showTerrain !== showTerrain) {
            changedKeys.add("terrain");
        }

        (Object.keys(showAirports) as Array<keyof typeof showAirports>).forEach(
            (airportType) => {
                if (
                    previousState.showAirports[airportType] !==
                    showAirports[airportType]
                ) {
                    changedKeys.add(`airport-${airportType}`);
                }
            },
        );

        if (previousState.showFlightRoutes !== showFlightRoutes) {
            changedKeys.add("flightRoutes");
        }
        if (previousState.showEarthquakes !== showEarthquakes) {
            changedKeys.add("earthquakes");
        }
        if (previousState.showVolcanoes !== showVolcanoes) {
            changedKeys.add("volcanoes");
        }

        previousLayerStateRef.current = {
            showCoastlines,
            showSatellite,
            showCapitals,
            showContinents,
            showTimezones,
            showDensity,
            showGdp,
            showHeatmap,
            showGlobe,
            showTerrain,
            showAirports,
            showFlightRoutes,
            showEarthquakes,
            showVolcanoes,
        };

        if (changedKeys.size === 0) return;

        const frameId = window.requestAnimationFrame(() => {
            changedKeys.forEach((key) => onLoadingComplete(key));
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [
        onLoadingComplete,
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showTimezones,
        showDensity,
        showGdp,
        showHeatmap,
        showGlobe,
        showTerrain,
        showAirports,
        showFlightRoutes,
        showEarthquakes,
        showVolcanoes,
    ]);

    const clearHoveredCountry = useCallback(() => {
        const map = mapRef.current;
        if (!map || hoveredCountryId.current === null) return;

        map.setFeatureState(
            {
                source: "countries",
                sourceLayer: "countries",
                id: hoveredCountryId.current,
            },
            { hover: false },
        );
        hoveredCountryId.current = null;
    }, []);

    const setHoveredCountry = useCallback(
        (countryId: string | number) => {
            if (!map) return;

            map.setFeatureState(
                {
                    source: "countries",
                    sourceLayer: "countries",
                    id: countryId,
                },
                { hover: true },
            );
            hoveredCountryId.current = countryId;
        },
        [map],
    );

    const { handleClick, removePopup } = useMapPopups(mapRef);

    const handleMouseMove = useCallback(
        (e: MapMouseEvent) => {
            const map = mapRef.current;
            if (!map) return;

            // Earthquake / volcano layers get cursor priority
            const evLayers: string[] = [];
            if (showEarthquakes) evLayers.push("earthquakes-circles");
            if (showVolcanoes) evLayers.push("volcanoes-circles");
            if (evLayers.length > 0) {
                const evFeatures = map.queryRenderedFeatures(e.point, {
                    layers: evLayers,
                });
                if (evFeatures.length > 0) {
                    map.getCanvas().style.cursor = "pointer";
                    setHoveredGdpInfo(null);
                    return;
                }
            }

            const features = getCountryFeaturesAtPoint(map, e.point);

            if (features.length > 0) {
                map.getCanvas().style.cursor = "pointer";

                if (showGdp) {
                    const adm0a3 = features[0].properties?.ADM0_A3 as string | undefined;
                    const name = features[0].properties?.ADMIN as string | undefined;
                    setHoveredGdpInfo({
                        name: name ?? adm0a3 ?? "",
                        gdp: adm0a3 ? (gdpByCode[adm0a3] ?? null) : null,
                        x: e.originalEvent.clientX,
                        y: e.originalEvent.clientY,
                    });
                } else {
                    setHoveredGdpInfo(null);
                }

                const countryId = features[0].id;
                if (countryId === undefined) return;

                if (hoveredCountryId.current !== countryId) {
                    clearHoveredCountry();
                    setHoveredCountry(countryId);
                }

                if (showCountryComparison) {
                    setHoveredComparisonCountry(
                        getSelectedCountryFromFeature(features[0]),
                    );
                }
            } else {
                map.getCanvas().style.cursor = "default";
                clearHoveredCountry();
                setHoveredComparisonCountry(null);
                setHoveredGdpInfo(null);
            }
        },
        [
            clearHoveredCountry,
            setHoveredComparisonCountry,
            setHoveredCountry,
            showCountryComparison,
            showGdp,
            showEarthquakes,
            showVolcanoes,
            setHoveredGdpInfo,
        ],
    );

    useEffect(() => {
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
    }, [map, handleClick, handleMouseMove, removePopup]);

    useEffect(() => {
        if (showCountryComparison) {
            return;
        }

        setHoveredComparisonCountry(null);
    }, [setHoveredComparisonCountry, showCountryComparison]);

    useEffect(() => {
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
                window.requestAnimationFrame(clearGlobe);
            }
        };

        if (map.isStyleLoaded()) {
            applyProjection();
        } else {
            map.once("load", applyProjection);
        }
    }, [map, showGlobe, onLoadingComplete]);

    useEffect(() => {
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
                window.requestAnimationFrame(clearTerrain);
            }
        };

        if (map.isStyleLoaded()) {
            applyTerrain();
        } else {
            map.once("load", applyTerrain);
        }
    }, [map, showTerrain, onLoadingComplete]);

    // Highlight selected country
    const selectedCountry = useMapStore((s) => s.selectedCountry);
    useEffect(() => {
        if (!map) return;

        const applySelection = () => {
            if (!selectedCountry) {
                const empty = [
                    "==",
                    ["get", "ADM0_A3"],
                    "",
                ] as maplibregl.FilterSpecification;
                map.setFilter("country-selected-fill", empty);
                map.setFilter("country-selected-outline", empty);
                return;
            }

            const primary =
                CODE_MAPPING[selectedCountry.cca3] ?? selectedCountry.cca3;
            const extras = ADDITIONAL_TERRITORIES[selectedCountry.cca3] ?? [];
            const codes = [primary, ...extras];

            const filter = (
                codes.length === 1
                    ? ["==", ["get", "ADM0_A3"], codes[0]]
                    : ["in", ["get", "ADM0_A3"], ["literal", codes]]
            ) as maplibregl.FilterSpecification;

            map.setFilter("country-selected-fill", filter);
            map.setFilter("country-selected-outline", filter);
        };

        if (map.isStyleLoaded()) {
            applySelection();
        } else {
            map.once("load", applySelection);
        }
    }, [map, selectedCountry]);

    // Highlight visited countries
    useEffect(() => {
        if (!map) return;

        const applyVisited = () => {
            const adm0Codes = visitedCountries.flatMap((cca3) => [
                CODE_MAPPING[cca3] ?? cca3,
                ...(ADDITIONAL_TERRITORIES[cca3] ?? []),
            ]);

            const filter = (
                adm0Codes.length > 0
                    ? ["in", ["get", "ADM0_A3"], ["literal", adm0Codes]]
                    : ["==", ["get", "ADM0_A3"], ""]
            ) as maplibregl.FilterSpecification;

            map.setFilter("country-visited-fill", filter);
        };

        if (map.isStyleLoaded()) {
            applyVisited();
        } else {
            map.once("load", applyVisited);
        }
    }, [map, visitedCountries]);

    // Fly to pending location (triggered by neighbor chip clicks or URL init)
    useEffect(() => {
        if (!map || !pendingFlyTo) return;
        map.flyTo({
            center: pendingFlyTo,
            zoom: 5,
            duration: 2000,
            essential: true,
        });
        setPendingFlyTo(null);
    }, [map, pendingFlyTo, setPendingFlyTo]);

    // Rain radar — fetch latest RainViewer timestamp, then show layer
    useEffect(() => {
        if (!map) return;

        const apply = () => {
            if (!showWeather) {
                if (map.getLayer("rain-radar")) {
                    map.setLayoutProperty("rain-radar", "visibility", "none");
                }
                if (onLoadingComplete) onLoadingComplete("weather");
                return;
            }

            fetch("https://api.rainviewer.com/public/weather-maps.json")
                .then((r) => r.json())
                .then((json) => {
                    const past = json.radar.past as { time: number; path: string }[];
                    const latest = past[past.length - 1];
                    const tileUrl = `${json.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
                    const src = map.getSource("rainRadar") as RasterTileSource | undefined;
                    if (src) {
                        src.setTiles([tileUrl]);
                    }
                    if (map.getLayer("rain-radar")) {
                        map.setLayoutProperty("rain-radar", "visibility", "visible");
                    }
                })
                .catch(() => {})
                .finally(() => {
                    if (onLoadingComplete)
                        window.requestAnimationFrame(() => onLoadingComplete("weather"));
                });
        };

        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("load", apply);
        }
    }, [map, showWeather, onLoadingComplete]);

    useEffect(() => {
        if (!map || !showWeather) return;
        const apply = () => {
            if (map.getLayer("rain-radar")) {
                map.setPaintProperty("rain-radar", "raster-opacity", layerOpacities.weather);
            }
        };
        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("load", apply);
        }
    }, [map, showWeather, layerOpacities.weather]);

    useEffect(() => {
        if (!map || !showFlightRoutes) return;
        let cancelled = false;

        getFlightRoutesGeoJson().then((geoJson) => {
            if (cancelled) return;
            const apply = () => {
                const source = map.getSource("flightRoutes") as GeoJSONSource | undefined;
                source?.setData(geoJson);
            };
            if (map.isStyleLoaded()) {
                apply();
            } else {
                map.once("load", apply);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [map, showFlightRoutes]);

    // Fetch live earthquake data from USGS
    useEffect(() => {
        if (!map || !showEarthquakes) return;
        let cancelled = false;

        fetch(
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson",
        )
            .then((r) => r.json())
            .then((geoJson) => {
                if (cancelled) return;
                const apply = () => {
                    const source = map.getSource("earthquakes") as
                        | GeoJSONSource
                        | undefined;
                    source?.setData(geoJson);
                };
                if (map.isStyleLoaded()) {
                    apply();
                } else {
                    map.once("load", apply);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled && onLoadingComplete) {
                    window.requestAnimationFrame(() =>
                        onLoadingComplete("earthquakes"),
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, [map, showEarthquakes, onLoadingComplete]);

    // Sync map position to URL
    useEffect(() => {
        if (!map || !onMapMove) return;

        const handleMoveEnd = () => {
            const center = map.getCenter();
            onMapMove(center.lat, center.lng, map.getZoom());
        };

        map.on("moveend", handleMoveEnd);
        return () => {
            map.off("moveend", handleMoveEnd);
        };
    }, [map, onMapMove]);

    return (
        <>
            <SimpleLoader map={map} />
            <div ref={containerRef} className="map" />
            {hoveredGdpInfo && showGdp && (
                <div
                    className="map-gdp-tooltip"
                    style={{
                        left: hoveredGdpInfo.x + 14,
                        top: hoveredGdpInfo.y - 10,
                    }}
                >
                    <div className="map-gdp-tooltip-name">{hoveredGdpInfo.name}</div>
                    <div className="map-gdp-tooltip-value">
                        GDP:{" "}
                        {hoveredGdpInfo.gdp != null
                            ? `$${formatGdpMillions(hoveredGdpInfo.gdp)}`
                            : "No data"}
                    </div>
                </div>
            )}
        </>
    );
});
