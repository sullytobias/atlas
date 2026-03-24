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

export interface SelectedLocation {
    latitude: number;
    longitude: number;
}

interface MapState {
    showCoastlines: boolean;
    showSatellite: boolean;
    showCapitals: boolean;
    showContinents: boolean;
    showDensity: boolean;
    showHeatmap: boolean;
    showStreetViewPicker: boolean;
    showTerrain: boolean;
    showGlobe: boolean;
    showAirports: AirportState;
    selectedAirport: SelectedAirport | null;
    selectedCountry: SelectedCountry | null;
    selectedLocation: SelectedLocation | null;
    theme: "dark" | "light";
    
    toggleCoastlines: () => void;
    toggleSatellite: () => void;
    toggleCapitals: () => void;
    toggleContinents: () => void;
    toggleDensity: () => void;
    toggleHeatmap: () => void;
    toggleStreetViewPicker: () => void;
    toggleTerrain: () => void;
    toggleGlobe: () => void;
    toggleAirport: (type: keyof AirportState) => void;
    setAllAirports: (value: boolean) => void;
    setSelectedAirport: (airport: SelectedAirport | null) => void;
    setSelectedCountry: (country: SelectedCountry | null) => void;
    setSelectedLocation: (location: SelectedLocation | null) => void;
    toggleTheme: () => void;
}

export const useMapStore = create<MapState>((set) => ({
    showCoastlines: false,
    showSatellite: false,
    showCapitals: false,
    showContinents: false,
    showDensity: false,
    showHeatmap: false,
    showStreetViewPicker: false,
    showTerrain: false,
    showGlobe: false,
    selectedAirport: null,
    selectedCountry: null,
    selectedLocation: null,
    theme: "dark",
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
        useLoadingStore.getState().setLoading('coastlines', true);
        set((state) => ({ showCoastlines: !state.showCoastlines }));
    },
    toggleSatellite: () => {
        useLoadingStore.getState().setLoading('satellite', true);
        set((state) => ({ showSatellite: !state.showSatellite }));
    },
    toggleCapitals: () => {
        useLoadingStore.getState().setLoading('capitals', true);
        set((state) => ({ showCapitals: !state.showCapitals }));
    },
    toggleContinents: () => {
        useLoadingStore.getState().setLoading('continents', true);
        set((state) => ({ showContinents: !state.showContinents }));
    },
    toggleDensity: () => {
        useLoadingStore.getState().setLoading('density', true);
        set((state) => ({ showDensity: !state.showDensity }));
    },
    toggleHeatmap: () => {
        useLoadingStore.getState().setLoading('heatmap', true);
        set((state) => ({ showHeatmap: !state.showHeatmap }));
    },
    toggleStreetViewPicker: () =>
        set((state) => ({
            showStreetViewPicker: !state.showStreetViewPicker,
        })),
    toggleTerrain: () => {
        useLoadingStore.getState().setLoading('terrain', true);
        set((state) => ({ showTerrain: !state.showTerrain }));
    },
    toggleGlobe: () => {
        useLoadingStore.getState().setLoading('globe', true);
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
        const types: (keyof AirportState)[] = ['large', 'medium', 'small', 'heliport', 'seaplane', 'closed', 'balloonport'];
        types.forEach(type => {
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
        set({
            selectedAirport: airport,
            selectedCountry: airport ? null : useMapStore.getState().selectedCountry,
            selectedLocation: airport ? null : useMapStore.getState().selectedLocation,
        }),
    setSelectedCountry: (country) =>
        set({
            selectedAirport: country ? null : useMapStore.getState().selectedAirport,
            selectedCountry: country,
            selectedLocation: country ? null : useMapStore.getState().selectedLocation,
        }),
    setSelectedLocation: (location) =>
        set({
            selectedAirport: location ? null : useMapStore.getState().selectedAirport,
            selectedCountry: location ? null : useMapStore.getState().selectedCountry,
            selectedLocation: location,
        }),
    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
        })),
}));
