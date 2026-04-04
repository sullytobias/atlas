import { create } from 'zustand';

interface LoadingState {
    loadingStates: Record<string, boolean>;
    setLoading: (key: string, isLoading: boolean) => void;
    clearLoading: (key: string) => void;
    clearAllLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    loadingStates: {},
    setLoading: (key, isLoading) =>
        set((state) => ({
            loadingStates: { ...state.loadingStates, [key]: isLoading },
        })),
    clearLoading: (key) =>
        set((state) => {
            const { [key]: _, ...rest } = state.loadingStates;
            return { loadingStates: rest };
        }),
    clearAllLoading: () => set({ loadingStates: {} }),
}));

interface AirportState {
    large: boolean;
    medium: boolean;
    small: boolean;
    heliport: boolean;
    seaplane: boolean;
    closed: boolean;
    balloonport: boolean;
}

export interface SelectedCountry {
    area: number;
    capital: string;
    car: { side: string };
    cca3: string;
    continent?: string;
    country: string;
    currencies: string;
    flag: string;
    flagAlt: string;
    languages: string;
    population: number;
    populationDensity?: number;
    timezoneInfo?: {
        cityLabel: string;
        currentTime: string;
        isDstActive: boolean;
        observesDst: boolean;
        offsetLabel: string;
        tzid: string;
    };
}

export interface SelectedAirport {
    city?: string;
    code?: string;
    country?: string;
    homeLink?: string;
    name: string;
    type?: string;
    wikipediaLink?: string;
}

export interface SelectedEarthquake {
    id: string;
    mag: number;
    place: string;
    time: number;
    depth: number;
    url: string;
    lat: number;
    lng: number;
}

export interface SelectedVolcano {
    name: string;
    country: string;
    type: string;
    lastEruption: string;
    elevation: number;
    lat: number;
    lng: number;
}

export interface SelectedLocation {
    latitude: number;
    longitude: number;
    timezoneInfo?: {
        cityLabel: string;
        currentTime: string;
        isDstActive: boolean;
        observesDst: boolean;
        offsetLabel: string;
        tzid: string;
    };
}

export interface MeasurementPoint {
    latitude: number;
    longitude: number;
}

export interface SelectedMeasurement {
    start: MeasurementPoint;
    end: MeasurementPoint;
    distanceMeters: number;
    distanceKilometers: number;
}

export type ComparisonSlot = 0 | 1;

function normalizeComparisonCountries(
    countries: [SelectedCountry | null, SelectedCountry | null],
): [SelectedCountry | null, SelectedCountry | null] {
    const uniqueCountries = countries.filter(
        (country, index, allCountries): country is SelectedCountry =>
            country !== null &&
            allCountries.findIndex(
                (candidate) => candidate?.cca3 === country.cca3,
            ) === index,
    );

    return [uniqueCountries[0] ?? null, uniqueCountries[1] ?? null];
}

interface MapState {
    pendingFlyTo: [number, number] | null;
    layerOpacities: Record<string, number>;
    showCoastlines: boolean;
    showNightLights: boolean;
    showWeather: boolean;
    showSatellite: boolean;
    showCapitals: boolean;
    showContinents: boolean;
    showTimezones: boolean;
    showDensity: boolean;
    showGdp: boolean;
    showHeatmap: boolean;
    showFlightRoutes: boolean;
    showEarthquakes: boolean;
    showVolcanoes: boolean;
    showStreetViewPicker: boolean;
    showDistanceMeasure: boolean;
    showCountryComparison: boolean;
    showTerrain: boolean;
    showGlobe: boolean;
    showAirports: AirportState;
    selectedAirport: SelectedAirport | null;
    selectedEarthquake: SelectedEarthquake | null;
    selectedVolcano: SelectedVolcano | null;
    selectedCountry: SelectedCountry | null;
    selectedLocation: SelectedLocation | null;
    measurementStart: MeasurementPoint | null;
    selectedMeasurement: SelectedMeasurement | null;
    comparisonCountries: [SelectedCountry | null, SelectedCountry | null];
    hoveredComparisonCountry: SelectedCountry | null;
    theme: "dark" | "light";
    visitedCountries: string[];
    searchHistory: string[];

    toggleCoastlines: () => void;
    toggleNightLights: () => void;
    toggleWeather: () => void;
    toggleVisited: (cca3: string) => void;
    toggleSatellite: () => void;
    toggleCapitals: () => void;
    toggleContinents: () => void;
    toggleTimezones: () => void;
    toggleDensity: () => void;
    toggleGdp: () => void;
    toggleHeatmap: () => void;
    toggleFlightRoutes: () => void;
    toggleEarthquakes: () => void;
    toggleVolcanoes: () => void;
    setSelectedEarthquake: (earthquake: SelectedEarthquake | null) => void;
    setSelectedVolcano: (volcano: SelectedVolcano | null) => void;
    toggleStreetViewPicker: () => void;
    toggleDistanceMeasure: () => void;
    toggleCountryComparison: () => void;
    toggleTerrain: () => void;
    toggleGlobe: () => void;
    toggleAirport: (type: keyof AirportState) => void;
    setAllAirports: (value: boolean) => void;
    setSelectedAirport: (airport: SelectedAirport | null) => void;
    setSelectedCountry: (country: SelectedCountry | null) => void;
    setSelectedLocation: (location: SelectedLocation | null) => void;
    setMeasurementStart: (point: MeasurementPoint | null) => void;
    setSelectedMeasurement: (measurement: SelectedMeasurement | null) => void;
    setComparisonCountry: (
        country: SelectedCountry,
        slot?: ComparisonSlot
    ) => void;
    setHoveredComparisonCountry: (country: SelectedCountry | null) => void;
    clearComparisonSlot: (slot: ComparisonSlot) => void;
    clearComparison: () => void;
    clearMeasurement: () => void;
    toggleTheme: () => void;
    setPendingFlyTo: (coords: [number, number] | null) => void;
    setLayerOpacity: (key: string, opacity: number) => void;
    addToSearchHistory: (cca3: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
    pendingFlyTo: null,
    layerOpacities: {
        coastlines: 1.0,
        satellite: 1.0,
        density: 0.5,
        gdp: 0.5,
        heatmap: 0.5,
        continents: 0.4,
        nightLights: 0.9,
        weather: 0.7,
        flightRoutes: 0.55,
        earthquakes: 0.8,
        volcanoes: 0.9,
    },
    showCoastlines: false,
    showNightLights: false,
    showWeather: false,
    showSatellite: false,
    showCapitals: false,
    showContinents: false,
    showTimezones: false,
    showDensity: false,
    showGdp: false,
    showHeatmap: false,
    showFlightRoutes: false,
    showEarthquakes: false,
    showVolcanoes: false,
    showStreetViewPicker: false,
    showDistanceMeasure: false,
    showCountryComparison: false,
    showTerrain: false,
    showGlobe: false,
    selectedAirport: null,
    selectedEarthquake: null,
    selectedVolcano: null,
    selectedCountry: null,
    selectedLocation: null,
    measurementStart: null,
    selectedMeasurement: null,
    comparisonCountries: [null, null],
    hoveredComparisonCountry: null,
    theme: "dark",
    searchHistory: (() => {
        try {
            const raw = localStorage.getItem("atlas-history");
            return raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
            return [];
        }
    })(),
    visitedCountries: (() => {
        try {
            const raw = localStorage.getItem("atlas-visited");
            return raw ? (JSON.parse(raw) as string[]) : [];
        } catch {
            return [];
        }
    })(),
    showAirports: {
        large: false,
        medium: false,
        small: false,
        heliport: false,
        seaplane: false,
        closed: false,
        balloonport: false,
    },

    toggleCoastlines: () => {
        useLoadingStore.getState().setLoading("coastlines", true);
        set((state) => ({ showCoastlines: !state.showCoastlines }));
    },
    toggleNightLights: () => {
        useLoadingStore.getState().setLoading("nightLights", true);
        set((state) => ({ showNightLights: !state.showNightLights }));
    },
    toggleWeather: () => {
        useLoadingStore.getState().setLoading("weather", true);
        set((state) => ({ showWeather: !state.showWeather }));
    },
    toggleVisited: (cca3) =>
        set((state) => {
            const next = state.visitedCountries.includes(cca3)
                ? state.visitedCountries.filter((c) => c !== cca3)
                : [...state.visitedCountries, cca3];
            try {
                localStorage.setItem("atlas-visited", JSON.stringify(next));
            } catch {}
            return { visitedCountries: next };
        }),
    toggleSatellite: () => {
        useLoadingStore.getState().setLoading("satellite", true);
        set((state) => ({ showSatellite: !state.showSatellite }));
    },
    toggleCapitals: () => {
        useLoadingStore.getState().setLoading("capitals", true);
        set((state) => ({ showCapitals: !state.showCapitals }));
    },
    toggleContinents: () => {
        useLoadingStore.getState().setLoading("continents", true);
        set((state) => ({ showContinents: !state.showContinents }));
    },
    toggleTimezones: () => {
        useLoadingStore.getState().setLoading("timezones", true);
        set((state) => ({ showTimezones: !state.showTimezones }));
    },
    toggleDensity: () => {
        useLoadingStore.getState().setLoading("density", true);
        set((state) => ({ showDensity: !state.showDensity }));
    },
    toggleGdp: () => {
        useLoadingStore.getState().setLoading("gdp", true);
        set((state) => ({ showGdp: !state.showGdp }));
    },
    toggleHeatmap: () => {
        useLoadingStore.getState().setLoading("heatmap", true);
        set((state) => ({ showHeatmap: !state.showHeatmap }));
    },
    toggleFlightRoutes: () => {
        useLoadingStore.getState().setLoading("flightRoutes", true);
        set((state) => ({ showFlightRoutes: !state.showFlightRoutes }));
    },
    toggleEarthquakes: () => {
        useLoadingStore.getState().setLoading("earthquakes", true);
        set((state) => ({ showEarthquakes: !state.showEarthquakes }));
    },
    toggleVolcanoes: () => {
        useLoadingStore.getState().setLoading("volcanoes", true);
        set((state) => ({ showVolcanoes: !state.showVolcanoes }));
    },
    setSelectedEarthquake: (earthquake) =>
        set((state) => ({
            selectedEarthquake: earthquake,
            selectedVolcano: earthquake ? null : state.selectedVolcano,
            selectedAirport: earthquake ? null : state.selectedAirport,
            selectedCountry: earthquake ? null : state.selectedCountry,
            selectedLocation: earthquake ? null : state.selectedLocation,
            measurementStart: earthquake ? null : state.measurementStart,
            selectedMeasurement: earthquake ? null : state.selectedMeasurement,
        })),
    setSelectedVolcano: (volcano) =>
        set((state) => ({
            selectedVolcano: volcano,
            selectedEarthquake: volcano ? null : state.selectedEarthquake,
            selectedAirport: volcano ? null : state.selectedAirport,
            selectedCountry: volcano ? null : state.selectedCountry,
            selectedLocation: volcano ? null : state.selectedLocation,
            measurementStart: volcano ? null : state.measurementStart,
            selectedMeasurement: volcano ? null : state.selectedMeasurement,
        })),
    toggleStreetViewPicker: () =>
        set((state) => ({
            showStreetViewPicker: !state.showStreetViewPicker,
            showDistanceMeasure: !state.showStreetViewPicker
                ? false
                : state.showDistanceMeasure,
            measurementStart: !state.showStreetViewPicker
                ? null
                : state.measurementStart,
            selectedMeasurement: !state.showStreetViewPicker
                ? null
                : state.selectedMeasurement,
        })),
    toggleDistanceMeasure: () =>
        set((state) => ({
            showDistanceMeasure: !state.showDistanceMeasure,
            showStreetViewPicker: !state.showDistanceMeasure
                ? false
                : state.showStreetViewPicker,
            measurementStart: null,
            selectedMeasurement: null,
        })),
    toggleCountryComparison: () =>
        set((state) => ({
            showCountryComparison: !state.showCountryComparison,
            comparisonCountries: !state.showCountryComparison
                ? state.comparisonCountries
                : [null, null],
            hoveredComparisonCountry: null,
            selectedCountry: null,
        })),
    toggleTerrain: () => {
        useLoadingStore.getState().setLoading("terrain", true);
        set((state) => ({ showTerrain: !state.showTerrain }));
    },
    toggleGlobe: () => {
        useLoadingStore.getState().setLoading("globe", true);
        set((state) => ({ showGlobe: !state.showGlobe }));
    },
    toggleAirport: (type) => {
        useLoadingStore.getState().setLoading(`airport-${type}`, true);
        set((state) => ({
            showAirports: {
                ...state.showAirports,
                [type]: !state.showAirports[type],
            },
        }));
    },
    setAllAirports: (value) => {
        const types: (keyof AirportState)[] = [
            "large",
            "medium",
            "small",
            "heliport",
            "seaplane",
            "closed",
            "balloonport",
        ];
        types.forEach((type) => {
            useLoadingStore.getState().setLoading(`airport-${type}`, true);
        });
        set(() => ({
            showAirports: {
                large: value,
                medium: value,
                small: value,
                heliport: value,
                seaplane: value,
                closed: value,
                balloonport: value,
            },
        }));
    },
    setSelectedAirport: (airport) =>
        set((state) => ({
            selectedAirport: airport,
            selectedEarthquake: airport ? null : state.selectedEarthquake,
            selectedVolcano: airport ? null : state.selectedVolcano,
            selectedCountry: airport ? null : state.selectedCountry,
            selectedLocation: airport ? null : state.selectedLocation,
            measurementStart: airport ? null : state.measurementStart,
            selectedMeasurement: airport ? null : state.selectedMeasurement,
            hoveredComparisonCountry: airport
                ? null
                : state.hoveredComparisonCountry,
        })),
    setSelectedCountry: (country) =>
        set((state) => ({
            selectedAirport: country ? null : state.selectedAirport,
            selectedEarthquake: country ? null : state.selectedEarthquake,
            selectedVolcano: country ? null : state.selectedVolcano,
            selectedCountry: country,
            selectedLocation: country ? null : state.selectedLocation,
            measurementStart: country ? null : state.measurementStart,
            selectedMeasurement: country ? null : state.selectedMeasurement,
            hoveredComparisonCountry: country
                ? null
                : state.hoveredComparisonCountry,
        })),
    setSelectedLocation: (location) =>
        set((state) => ({
            selectedAirport: location ? null : state.selectedAirport,
            selectedCountry: location ? null : state.selectedCountry,
            selectedLocation: location,
            measurementStart: location ? null : state.measurementStart,
            selectedMeasurement: location ? null : state.selectedMeasurement,
            hoveredComparisonCountry: location
                ? null
                : state.hoveredComparisonCountry,
        })),
    setMeasurementStart: (point) =>
        set((state) => ({
            selectedAirport: point ? null : state.selectedAirport,
            selectedCountry: point ? null : state.selectedCountry,
            selectedLocation: point ? null : state.selectedLocation,
            measurementStart: point,
            selectedMeasurement: point ? null : state.selectedMeasurement,
            hoveredComparisonCountry: point
                ? null
                : state.hoveredComparisonCountry,
        })),
    setSelectedMeasurement: (measurement) =>
        set((state) => ({
            selectedAirport: measurement ? null : state.selectedAirport,
            selectedCountry: measurement ? null : state.selectedCountry,
            selectedLocation: measurement ? null : state.selectedLocation,
            measurementStart: measurement ? null : state.measurementStart,
            selectedMeasurement: measurement,
            hoveredComparisonCountry: measurement
                ? null
                : state.hoveredComparisonCountry,
        })),
    setComparisonCountry: (country, slot) =>
        set((state) => {
            const comparisonCountries: [SelectedCountry | null, SelectedCountry | null] =
                [...state.comparisonCountries] as [
                    SelectedCountry | null,
                    SelectedCountry | null,
                ];

            if (slot !== undefined) {
                comparisonCountries[slot] = country;
            } else if (!comparisonCountries[0]) {
                comparisonCountries[0] = country;
            } else if (!comparisonCountries[1]) {
                comparisonCountries[1] = country;
            } else {
                comparisonCountries[1] = country;
            }

            return {
                showCountryComparison: true,
                comparisonCountries:
                    normalizeComparisonCountries(comparisonCountries),
                hoveredComparisonCountry: null,
                selectedAirport: null,
                selectedCountry: null,
                selectedLocation: null,
                measurementStart: null,
                selectedMeasurement: null,
            };
        }),
    setHoveredComparisonCountry: (country) =>
        set((state) => ({
            hoveredComparisonCountry: state.showCountryComparison
                ? country
                : null,
        })),
    clearComparisonSlot: (slot) =>
        set((state) => {
            const comparisonCountries: [SelectedCountry | null, SelectedCountry | null] =
                [...state.comparisonCountries] as [
                    SelectedCountry | null,
                    SelectedCountry | null,
                ];
            comparisonCountries[slot] = null;

            if (!comparisonCountries[0] && comparisonCountries[1]) {
                comparisonCountries[0] = comparisonCountries[1];
                comparisonCountries[1] = null;
            }

            return {
                comparisonCountries,
                hoveredComparisonCountry: null,
                showCountryComparison:
                    comparisonCountries[0] !== null ||
                    comparisonCountries[1] !== null,
            };
        }),
    clearComparison: () =>
        set({
            comparisonCountries: [null, null],
            hoveredComparisonCountry: null,
            showCountryComparison: false,
        }),
    clearMeasurement: () =>
        set({
            measurementStart: null,
            selectedMeasurement: null,
            hoveredComparisonCountry: null,
        }),
    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
        })),
    addToSearchHistory: (cca3) =>
        set((state) => {
            const next = [
                cca3,
                ...state.searchHistory.filter((c) => c !== cca3),
            ].slice(0, 5);
            try {
                localStorage.setItem("atlas-history", JSON.stringify(next));
            } catch {}
            return { searchHistory: next };
        }),
    setPendingFlyTo: (coords) => set({ pendingFlyTo: coords }),
    setLayerOpacity: (key, opacity) =>
        set((state) => ({
            layerOpacities: { ...state.layerOpacities, [key]: opacity },
        })),
}));
