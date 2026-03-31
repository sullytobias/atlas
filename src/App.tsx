import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import type { MapRef } from "./components/Map";
import { buildLegendSections } from "./components/Legend/LegendSections";
import {
    useLoadingStore,
    useMapStore,
    type SelectedCountry,
} from "./store/loadingStore";
import countryData from "./data/data.json";
import { useUrlSync } from "./hooks/useUrlSync";
import RandomCountryButton from "./components/RandomCountryButton/RandomCountryButton";

const Map = lazy(() => import("./components/Map"));
const MapControls = lazy(() => import("./components/MapControls/MapControls"));
const Legend = lazy(() => import("./components/Legend/Legend"));
const SearchBar = lazy(() => import("./components/SearchBar/SearchBar"));
const CountryDetailsPanel = lazy(
    () => import("./components/CountryDetailsPanel/CountryDetailsPanel")
);
const CountryComparisonPanel = lazy(
    () => import("./components/CountryComparisonPanel/CountryComparisonPanel")
);

type CountryFeature = {
    properties: {
        area: number;
        capital: string;
        car: { side: string };
        cca3: string;
        country: string;
        currencies: string;
        flag: string;
        flagAlt: string;
        languages: string;
        population: number;
        populationDensity?: number;
    };
};

export default function App() {
    const { clearLoading } = useLoadingStore();
    const {
        showContinents,
        showDensity,
        showHeatmap,
        showTimezones,
        theme,
        showCountryComparison,
        setComparisonCountry,
        setSelectedCountry,
    } =
        useMapStore();
    const mapRef = useRef<MapRef>(null);
    const { onMapMove } = useUrlSync();

    const handleLoadingComplete = useCallback(
        (key: string) => {
            clearLoading(key);
        },
        [clearLoading]
    );

    const handleLocationSelect = useCallback(
        (
            coordinates: [number, number],
            countryCode: string,
            zoom?: number
        ) => {
            const countries = (countryData as { features: CountryFeature[] })
                .features;
            const selectedCountry =
                countries.find(
                    (country) => country.properties.cca3 === countryCode
                )?.properties || null;

            if (selectedCountry && showCountryComparison) {
                setComparisonCountry(selectedCountry as SelectedCountry);
            } else {
                setSelectedCountry(selectedCountry);
            }

            if (mapRef.current) {
                mapRef.current.flyToLocation(coordinates, zoom);
            }
        },
        [setComparisonCountry, setSelectedCountry, showCountryComparison]
    );

    const legendSections = buildLegendSections(
        showContinents,
        showHeatmap,
        showDensity,
        showTimezones
    );

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
        <>
            <Suspense fallback={null}>
                <SearchBar onLocationSelect={handleLocationSelect} />
                <Legend sections={legendSections} />
                <MapControls />
                <CountryDetailsPanel />
                <CountryComparisonPanel />
                <Map
                    ref={mapRef}
                    onLoadingComplete={handleLoadingComplete}
                    onMapMove={onMapMove}
                />
                <RandomCountryButton />
            </Suspense>
        </>
    );
}
