import { useCallback } from "react";
import type { Map as MLMap, MapMouseEvent } from "maplibre-gl";
import { getCountryFeaturesAtPoint } from "../utils/countryFeatureQueries";
import { useMapStore } from "../store/loadingStore";
import { calculateProjectedDistance } from "../utils/distanceMeasurement";
import { buildTimezoneInfo } from "../utils/timezoneInfo";
import { getSelectedCountryFromFeature } from "../utils/selectedCountry";

function getTimezoneInfoAtPoint(map: MLMap, point: MapMouseEvent["point"]) {
    const timezoneFeature = map.queryRenderedFeatures(point, {
        layers: ["timezones-fill"],
    })[0];
    const tzid = timezoneFeature?.properties?.tzid;

    if (typeof tzid !== "string") {
        return undefined;
    }

    return buildTimezoneInfo(tzid);
}

export function useMapPopups(
    mapRef: React.RefObject<MLMap | null>
) {
    const setSelectedCountry = useMapStore((state) => state.setSelectedCountry);
    const addToSearchHistory = useMapStore((state) => state.addToSearchHistory);
    const setSelectedAirport = useMapStore((state) => state.setSelectedAirport);
    const setSelectedEarthquake = useMapStore((state) => state.setSelectedEarthquake);
    const setSelectedVolcano = useMapStore((state) => state.setSelectedVolcano);
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
                    timezoneInfo: getTimezoneInfoAtPoint(map, e.point),
                });
                return;
            }

            const earthquakeFeatures = map.queryRenderedFeatures(e.point, {
                layers: ["earthquakes-circles"],
            });
            if (earthquakeFeatures.length > 0) {
                const props = earthquakeFeatures[0].properties;
                const geo = earthquakeFeatures[0].geometry;
                const coords = geo.type === "Point" ? geo.coordinates : [0, 0, 0];
                setSelectedEarthquake({
                    id: String(props?.id ?? earthquakeFeatures[0].id ?? ""),
                    mag: Number(props?.mag ?? 0),
                    place: String(props?.place ?? "Unknown location"),
                    time: Number(props?.time ?? 0),
                    depth: Number(coords[2] ?? 0),
                    url: String(props?.url ?? ""),
                    lat: Number(coords[1] ?? 0),
                    lng: Number(coords[0] ?? 0),
                });
                return;
            }

            const volcanoFeatures = map.queryRenderedFeatures(e.point, {
                layers: ["volcanoes-circles"],
            });
            if (volcanoFeatures.length > 0) {
                const props = volcanoFeatures[0].properties;
                const geo = volcanoFeatures[0].geometry;
                const coords = geo.type === "Point" ? geo.coordinates : [0, 0];
                setSelectedVolcano({
                    name: String(props?.name ?? "Unknown Volcano"),
                    country: String(props?.country ?? ""),
                    type: String(props?.type ?? ""),
                    lastEruption: String(props?.lastEruption ?? "Unknown"),
                    elevation: Number(props?.elevation ?? 0),
                    lat: Number(coords[1] ?? 0),
                    lng: Number(coords[0] ?? 0),
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

            const features = getCountryFeaturesAtPoint(map, e.point);
            const timezoneInfo = getTimezoneInfoAtPoint(map, e.point);

            if (features.length === 0) {
                setSelectedLocation({
                    latitude: e.lngLat.lat,
                    longitude: e.lngLat.lng,
                    timezoneInfo,
                });
                return;
            }

            const selectedCountry = getSelectedCountryFromFeature(features[0]);
            if (!selectedCountry) {
                return;
            }
            const enrichedProperties = {
                ...selectedCountry,
                timezoneInfo,
            };

            if (showCountryComparison) {
                setComparisonCountry(enrichedProperties);
                addToSearchHistory(enrichedProperties.cca3);
                return;
            }

            setSelectedCountry(enrichedProperties);
            addToSearchHistory(enrichedProperties.cca3);
        },
        [
            mapRef,
            setComparisonCountry,
            setSelectedAirport,
            setSelectedEarthquake,
            setSelectedVolcano,
            setSelectedCountry,
            setMeasurementStart,
            setSelectedLocation,
            setSelectedMeasurement,
            addToSearchHistory,
        ],
    );

    const removePopup = useCallback(() => {}, []);

    return { handleClick, removePopup };
}
