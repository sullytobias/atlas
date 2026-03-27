import { useCallback } from "react";
import type { Map as MLMap, MapMouseEvent } from "maplibre-gl";
import countryData from "../data/data.json";
import { REVERSE_CODE_MAPPING } from "../utils/countryCodeMappings";
import { useMapStore } from "../store/loadingStore";
import { calculateProjectedDistance } from "../utils/distanceMeasurement";

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
    mapRef: React.RefObject<MLMap | null>
) {
    const setSelectedCountry = useMapStore((state) => state.setSelectedCountry);
    const setSelectedAirport = useMapStore((state) => state.setSelectedAirport);
    const setSelectedLocation = useMapStore(
        (state) => state.setSelectedLocation
    );
    const setMeasurementStart = useMapStore(
        (state) => state.setMeasurementStart,
    );
    const setSelectedMeasurement = useMapStore(
        (state) => state.setSelectedMeasurement,
    );
    const setComparisonCountry = useMapStore(
        (state) => state.setComparisonCountry,
    );

    const handleClick = useCallback(
        (e: MapMouseEvent) => {
            const map = mapRef.current;
            if (!map) return;
            const {
                showStreetViewPicker,
                showDistanceMeasure,
                measurementStart,
                selectedMeasurement,
                showCountryComparison,
            } = useMapStore.getState();

            if (showDistanceMeasure) {
                const point = {
                    latitude: e.lngLat.lat,
                    longitude: e.lngLat.lng,
                };

                if (selectedMeasurement) {
                    setMeasurementStart(point);
                    return;
                }

                if (!measurementStart) {
                    setMeasurementStart(point);
                    return;
                }

                const { distanceMeters, distanceKilometers } =
                    calculateProjectedDistance(measurementStart, point);

                setSelectedMeasurement({
                    start: measurementStart,
                    end: point,
                    distanceMeters,
                    distanceKilometers,
                });
                return;
            }

            if (showStreetViewPicker) {
                setSelectedLocation({
                    latitude: e.lngLat.lat,
                    longitude: e.lngLat.lng,
                });
                return;
            }

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
                setSelectedAirport({
                    city: airport?.city,
                    code: airport?.code,
                    country: airport?.country,
                    homeLink: airport?.home_link,
                    name: airport?.name || "Unknown Airport",
                    type: airport?.type,
                    wikipediaLink: airport?.wikipedia_link,
                });
                return;
            }

            const features = map.queryRenderedFeatures(e.point, {
                layers: ["countries-fill"],
            });

            if (features.length === 0) {
                setSelectedLocation({
                    latitude: e.lngLat.lat,
                    longitude: e.lngLat.lng,
                });
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
                continent: CONTINENT,
                continents: [CONTINENT],
            };

            if (showCountryComparison) {
                setComparisonCountry(enrichedProperties);
                return;
            }

            setSelectedCountry(enrichedProperties);
        },
        [
            mapRef,
            setComparisonCountry,
            setSelectedAirport,
            setSelectedCountry,
            setMeasurementStart,
            setSelectedLocation,
            setSelectedMeasurement,
        ],
    );

    const removePopup = useCallback(() => {}, []);

    return { handleClick, removePopup };
}
