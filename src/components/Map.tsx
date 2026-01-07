import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { Popup } from "maplibre-gl";

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
    showCapitals?: boolean;
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

export default function Map({
    showCoastlines,
    showSatellite,
    showCapitals = false,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<Popup | null>(null);
    const hoveredCountryId = useRef<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isLoadingFlags = useRef(false); // Prevent double flag loading

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
        ],
        [showCoastlines, showSatellite, showCapitals]
    );

    useLayerVisibility(mapRef, visibilityConfigs);

    const createPopupContent = useCallback((props: CountryProps) => {
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
                    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">${
                        country || "N/A"
                    }</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <p style="margin: 0; font-size: 14px;"><strong>Capital:</strong> ${
                        capital || "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Population:</strong> ${
                        population ? Number(population).toLocaleString() : "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Area:</strong> ${
                        area ? `${Number(area).toLocaleString()} km²` : "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Languages:</strong> ${
                        languages || "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Currencies:</strong> ${
                        currencies || "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Driving Side:</strong> ${
                        car?.side || "N/A"
                    }</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Continent:</strong> ${
                        continents || "N/A"
                    }</p>
                </div>
            </div>
        `;
    }, []);

    const handleClick = useCallback(
        (e: any) => {
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

            const ADM0_A3 = features[0]?.properties?.ADM0_A3;
            const CONTINENT = features[0]?.properties?.CONTINENT;
            if (!ADM0_A3) return;

            const countryFeature = (countryData as any).features.find(
                (f: any) => f.properties.cca3 === ADM0_A3
            );

            if (!countryFeature) {
                console.warn(`No capital data found for: ${ADM0_A3}`);
                console.warn(features);
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

    const handleMouseMove = useCallback((e: any) => {
        const map = mapRef.current;
        if (!map) return;

        const features = map.queryRenderedFeatures(e.point, {
            layers: ["countries-fill"],
        });

        if (features.length > 0) {
            map.getCanvas().style.cursor = "pointer";

            const feature = features[0];
            const countryId = feature.id;

            if (countryId === undefined) return;

            if (
                hoveredCountryId.current !== null &&
                hoveredCountryId.current !== countryId
            ) {
                map.setFeatureState(
                    {
                        source: "countries",
                        sourceLayer: "countries",
                        id: hoveredCountryId.current,
                    },
                    { hover: false }
                );
            }

            hoveredCountryId.current = countryId;
            map.setFeatureState(
                {
                    source: "countries",
                    sourceLayer: "countries",
                    id: countryId,
                },
                { hover: true }
            );
        } else {
            map.getCanvas().style.cursor = "default";

            if (hoveredCountryId.current !== null) {
                map.setFeatureState(
                    {
                        source: "countries",
                        sourceLayer: "countries",
                        id: hoveredCountryId.current,
                    },
                    { hover: false }
                );
            }
            hoveredCountryId.current = null;
        }
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const onLoad = async () => {
            if (isLoadingFlags.current) return;
            isLoadingFlags.current = true;

            const flagPromises = (countryData as any).features.map(
                async (feature: any) => {
                    const { cca3, flag } = feature.properties;
                    if (!flag || !cca3) return;

                    try {
                        if (map.hasImage(cca3)) return;

                        const img = await new Promise<HTMLImageElement>(
                            (resolve, reject) => {
                                const image = new Image();
                                image.crossOrigin = "anonymous";
                                image.onload = () => resolve(image);
                                image.onerror = reject;
                                image.src = flag;
                            }
                        );

                        map.addImage(cca3, img);
                    } catch (err) {
                        console.warn(`Failed to load flag for ${cca3}:`, err);
                    }
                }
            );

            await Promise.allSettled(flagPromises);

            map.on("click", handleClick);
            map.on("mousemove", handleMouseMove);

            setIsLoading(false);
        };

        if (map.isStyleLoaded()) onLoad();
        else map.once("load", onLoad);

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
