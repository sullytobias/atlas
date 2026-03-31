import { useEffect, useCallback } from "react";
import { useMapStore, type SelectedCountry } from "../store/loadingStore";
import countryData from "../data/data.json";

type CountryFeature = {
    geometry: { coordinates: [number, number] };
    properties: SelectedCountry;
};

const LAYER_KEYS = [
    "coastlines",
    "nightLights",
    "satellite",
    "capitals",
    "continents",
    "density",
    "heatmap",
    "terrain",
    "globe",
    "timezones",
] as const;

type LayerKey = (typeof LAYER_KEYS)[number];

const LAYER_TOGGLE_MAP: Record<LayerKey, () => void> = {
    get coastlines() { return useMapStore.getState().toggleCoastlines; },
    get nightLights() { return useMapStore.getState().toggleNightLights; },
    get satellite() { return useMapStore.getState().toggleSatellite; },
    get capitals() { return useMapStore.getState().toggleCapitals; },
    get continents() { return useMapStore.getState().toggleContinents; },
    get density() { return useMapStore.getState().toggleDensity; },
    get heatmap() { return useMapStore.getState().toggleHeatmap; },
    get terrain() { return useMapStore.getState().toggleTerrain; },
    get globe() { return useMapStore.getState().toggleGlobe; },
    get timezones() { return useMapStore.getState().toggleTimezones; },
};

const LAYER_SHOW_MAP: Record<LayerKey, (s: ReturnType<typeof useMapStore.getState>) => boolean> = {
    coastlines: (s) => s.showCoastlines,
    nightLights: (s) => s.showNightLights,
    satellite: (s) => s.showSatellite,
    capitals: (s) => s.showCapitals,
    continents: (s) => s.showContinents,
    density: (s) => s.showDensity,
    heatmap: (s) => s.showHeatmap,
    terrain: (s) => s.showTerrain,
    globe: (s) => s.showGlobe,
    timezones: (s) => s.showTimezones,
};

function buildUrlParams(
    state: ReturnType<typeof useMapStore.getState>,
    pos: { lat: number; lng: number; zoom: number },
): string {
    const params = new URLSearchParams();

    params.set("lat", pos.lat.toFixed(4));
    params.set("lng", pos.lng.toFixed(4));
    params.set("zoom", pos.zoom.toFixed(2));

    const activeLayers = LAYER_KEYS.filter((key) => LAYER_SHOW_MAP[key](state));
    if (activeLayers.length > 0) {
        params.set("layers", activeLayers.join(","));
    }

    if (state.selectedCountry) {
        params.set("country", state.selectedCountry.cca3);
    }

    return params.toString();
}

export function useUrlSync() {
    const {
        showCoastlines,
        showNightLights,
        showSatellite,
        showCapitals,
        showContinents,
        showDensity,
        showHeatmap,
        showTerrain,
        showGlobe,
        showTimezones,
        selectedCountry,
    } = useMapStore();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const layersParam = params.get("layers");
        if (layersParam) {
            const requested = new Set(layersParam.split(",") as LayerKey[]);
            const state = useMapStore.getState();
            for (const key of LAYER_KEYS) {
                if (requested.has(key) && !LAYER_SHOW_MAP[key](state)) {
                    LAYER_TOGGLE_MAP[key]();
                }
            }
        }

        const countryCode = params.get("country");
        if (countryCode) {
            const features = (countryData as unknown as { features: CountryFeature[] }).features;
            const found = features.find((f) => f.properties.cca3 === countryCode);
            if (found) {
                useMapStore.getState().setSelectedCountry(found.properties);
                const [lng, lat] = found.geometry.coordinates;
                useMapStore.getState().setPendingFlyTo([lng, lat]);
            }
        }
    }, []);

    useEffect(() => {
        const state = useMapStore.getState();
        const urlParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(urlParams.get("lat") ?? "");
        const lng = parseFloat(urlParams.get("lng") ?? "");
        const zoom = parseFloat(urlParams.get("zoom") ?? "");
        const pos = {
            lat: !isNaN(lat) ? lat : 48,
            lng: !isNaN(lng) ? lng : 8,
            zoom: !isNaN(zoom) ? zoom : 0,
        };
        const qs = buildUrlParams(state, pos);
        history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, [
        showCoastlines,
        showNightLights,
        showSatellite,
        showCapitals,
        showContinents,
        showDensity,
        showHeatmap,
        showTerrain,
        showGlobe,
        showTimezones,
        selectedCountry,
    ]);

    const onMapMove = useCallback((lat: number, lng: number, zoom: number) => {
        const state = useMapStore.getState();
        const qs = buildUrlParams(state, { lat, lng, zoom });
        history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, []);

    return { onMapMove };
}
