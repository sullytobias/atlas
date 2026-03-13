import { useRef, useCallback } from "react";
import type { Map as MLMap, MapMouseEvent } from "maplibre-gl";
import { Popup } from "maplibre-gl";
import countryData from "../data/data.json";
import { createCountryPopup, createAirportPopup } from "../utils/popupTemplates";
import { REVERSE_CODE_MAPPING } from "../utils/countryCodeMappings";

type CountryFeature = {
    properties: {
        cca3: string;
        country: string;
        flag: string;
        flagAlt: string;
        population: number;
        area: number;
        capital: string;
        languages: string;
        currencies: string;
        car: { side: string };
    };
};

export function useMapPopups(
    mapRef: React.RefObject<MLMap | null>,
    formatLanguages: (languages: string) => string
) {
    const popupRef = useRef<Popup | null>(null);

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
            const mappedCode = REVERSE_CODE_MAPPING[ADM0_A3] || ADM0_A3;
            if (!mappedCode) return;

            const countryFeature = (
                countryData as { features: CountryFeature[] }
            ).features.find((f) => f.properties.cca3 === mappedCode);
            if (!countryFeature) {
                console.warn(`No country data found for: ${ADM0_A3}`);
                return;
            }
            const enrichedProperties = {
                ...countryFeature.properties,
                continents: [CONTINENT],
            };
            const popupContent = createCountryPopup(enrichedProperties, formatLanguages);
            popupRef.current?.remove();
            popupRef.current = new Popup({
                closeButton: true,
                closeOnClick: false,
            })
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);
        },
        [formatLanguages, mapRef]
    );

    const removePopup = useCallback(() => {
        popupRef.current?.remove();
        popupRef.current = null;
    }, []);

    return { handleClick, removePopup };
}
