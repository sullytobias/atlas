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

interface MapState {
    showCoastlines: boolean;
    showSatellite: boolean;
    showCapitals: boolean;
    showContinents: boolean;
    showHeatmap: boolean;
    showTerrain: boolean;
    showGlobe: boolean;
    showAirports: AirportState;
    
    toggleCoastlines: () => void;
    toggleSatellite: () => void;
    toggleCapitals: () => void;
    toggleContinents: () => void;
    toggleHeatmap: () => void;
    toggleTerrain: () => void;
    toggleGlobe: () => void;
    toggleAirport: (type: keyof AirportState) => void;
    setAllAirports: (value: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
    showCoastlines: false,
    showSatellite: false,
    showCapitals: false,
    showContinents: false,
    showHeatmap: false,
    showTerrain: false,
    showGlobe: false,
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
    toggleHeatmap: () => {
        useLoadingStore.getState().setLoading('heatmap', true);
        set((state) => ({ showHeatmap: !state.showHeatmap }));
    },
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
}));
