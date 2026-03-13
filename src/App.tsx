import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import type { MapRef } from "./components/Map";
import { buildLegendSections } from "./components/Legend/LegendSections";
import { useLoadingStore, useMapStore } from "./store/loadingStore";

const Map = lazy(() => import("./components/Map"));
const MapControls = lazy(() => import("./components/MapControls/MapControls"));
const Legend = lazy(() => import("./components/Legend/Legend"));
const SearchBar = lazy(() => import("./components/SearchBar/SearchBar"));

export default function App() {
    const { clearLoading } = useLoadingStore();
    const { showContinents, showHeatmap, theme } = useMapStore();
    const mapRef = useRef<MapRef>(null);

    const handleLoadingComplete = useCallback(
        (key: string) => {
            clearLoading(key);
        },
        [clearLoading]
    );

    const handleLocationSelect = useCallback(
        (coordinates: [number, number], zoom?: number) => {
            if (mapRef.current) {
                mapRef.current.flyToLocation(coordinates, zoom);
            }
        },
        []
    );

    const legendSections = buildLegendSections(showContinents, showHeatmap);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    return (
        <>
            <Suspense fallback={null}>
                <SearchBar onLocationSelect={handleLocationSelect} />
                <Legend sections={legendSections} />
                <MapControls />
                <Map
                    ref={mapRef}
                    onLoadingComplete={handleLoadingComplete}
                />
            </Suspense>
        </>
    );
}
