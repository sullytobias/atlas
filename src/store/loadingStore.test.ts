import { beforeEach, describe, expect, it } from "vitest";
import { useLoadingStore, useMapStore } from "./loadingStore";

const initialAirports = {
    large: false,
    medium: false,
    small: false,
    heliport: false,
    seaplane: false,
    closed: false,
    balloonport: false,
};

beforeEach(() => {
    useLoadingStore.setState({ loadingStates: {} });
    useMapStore.setState({
        showCoastlines: false,
        showSatellite: false,
        showCapitals: false,
        showContinents: false,
        showHeatmap: false,
        showTerrain: false,
        showGlobe: false,
        theme: "dark",
        showAirports: initialAirports,
    });
});

describe("useMapStore", () => {
    it("sets a loading key when toggling a base layer", () => {
        useMapStore.getState().toggleHeatmap();

        expect(useMapStore.getState().showHeatmap).toBe(true);
        expect(useLoadingStore.getState().loadingStates.heatmap).toBe(true);
    });

    it("toggles individual airport filters and marks them as loading", () => {
        useMapStore.getState().toggleAirport("large");

        expect(useMapStore.getState().showAirports.large).toBe(true);
        expect(useLoadingStore.getState().loadingStates["airport-large"]).toBe(
            true
        );
    });

    it("sets all airport filters together", () => {
        useMapStore.getState().setAllAirports(true);

        expect(Object.values(useMapStore.getState().showAirports)).toEqual(
            Array(7).fill(true)
        );
        expect(
            useLoadingStore.getState().loadingStates["airport-balloonport"]
        ).toBe(true);
    });

    it("toggles the theme state", () => {
        useMapStore.getState().toggleTheme();

        expect(useMapStore.getState().theme).toBe("light");
    });
});
