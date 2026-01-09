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
import Loader from "./Loader";

type Props = {
    showCoastlines: boolean;
    showSatellite: boolean;
    showCapitals: boolean;
    showContinents: boolean;
    showHeatmap: boolean;
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
        ],
        [
            showCoastlines,
            showSatellite,
            showCapitals,
            showContinents,
            showHeatmap,
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

    const createPopupContent = useCallback(
        (props: CountryProps): string => {
            const {
                capital,
                country,
                population,
                flag,
                flagAlt,
                currencies,
                area,
                languages,
                car,
                continents,
            } = props;

            return `
            <div style="padding: 12px; max-width: 320px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <img src="${flag}" alt="${flagAlt || `${country} flag`}" 
                         style="width: 40px; height: 30px; object-fit: cover; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" />
                    <a target="_blank" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                        country
                    )}" style="margin: 0; font-size: 18px; font-weight: bold;">${
                country || "N/A"
            }</a>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <p style="margin: 0; font-size: 14px;"><strong>Capital:</strong> 
                        <a target="_blank" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                            capital
                        )}">${capital || "N/A"}</a>
                    </p>
                    <p style="margin: 0; font-size: 14px;"><strong>Population:</strong> ${
                        population ? Number(population).toLocaleString() : "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Area:</strong> ${
                        area ? `${Number(area).toLocaleString()} km²` : "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Languages:</strong> ${
                        languages ? formatLanguages(languages) : "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Currencies:</strong> <a target="_blank" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                        currencies
                    )}">${currencies || "N/A"}</a></p>
                    <p style="margin: 0; font-size: 14px;"><strong>Driving Side:</strong> ${
                        car?.side || "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Continent:</strong> ${
                        continents
                            .map(
                                (continent) =>
                                    `<a target="_blank" href="https://en.wikipedia.org/wiki/${encodeURIComponent(
                                        continent
                                    )}">${continent}</a>`
                            )
                            .join(", ") || "N/A"
                    }</p>
                </div>
            </div>
        `;
        },
        [formatLanguages]
    );

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

            const popupContent = createPopupContent(enrichedProperties);

            popupRef.current?.remove();
            popupRef.current = new Popup({
                closeButton: true,
                closeOnClick: false,
            })
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);
        },
        [createPopupContent]
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

    return (
        <>
            <Loader isLoading={isLoading} />
            <div ref={containerRef} className="map" />
        </>
    );
}
