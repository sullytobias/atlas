import { beforeEach, describe, expect, it } from "vitest";
import {
    useLoadingStore,
    useMapStore,
    type SelectedAirport,
    type SelectedCountry,
    type SelectedLocation,
} from "./loadingStore";

const initialAirports = {
    large: false,
    medium: false,
    small: false,
    heliport: false,
    seaplane: false,
    closed: false,
    balloonport: false,
};

const selectedCountry: SelectedCountry = {
    area: 551695,
    capital: "Paris",
    car: { side: "right" },
    cca3: "FRA",
    continent: "Europe",
    country: "France",
    currencies: "Euro",
    flag: "fr.svg",
    flagAlt: "Flag of France",
    languages: "French",
    population: 68000000,
    populationDensity: 123,
};

const selectedAirport: SelectedAirport = {
    city: "Paris",
    code: "CDG",
    country: "FR",
    homeLink: "https://www.parisaeroport.fr/",
    name: "Charles de Gaulle Airport",
    type: "large_airport",
    wikipediaLink: "https://en.wikipedia.org/wiki/Charles_de_Gaulle_Airport",
};

const selectedLocation: SelectedLocation = {
    latitude: 48.85837,
    longitude: 2.294481,
};

beforeEach(() => {
    useLoadingStore.setState({ loadingStates: {} });
    useMapStore.setState({
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
        theme: "dark",
        selectedCountry: null,
        selectedLocation: null,
        showAirports: initialAirports,
    });
});

describe("useMapStore", () => {
    it("sets a loading key when toggling a base layer", () => {
        useMapStore.getState().toggleHeatmap();

        expect(useMapStore.getState().showHeatmap).toBe(true);
        expect(useLoadingStore.getState().loadingStates.heatmap).toBe(true);
    });

    it("toggles the density layer and marks it as loading", () => {
        useMapStore.getState().toggleDensity();

        expect(useMapStore.getState().showDensity).toBe(true);
        expect(useLoadingStore.getState().loadingStates.density).toBe(true);
    });

    it("toggles individual airport filters and marks them as loading", () => {
        useMapStore.getState().toggleAirport("large");

        expect(useMapStore.getState().showAirports.large).toBe(true);
        expect(useLoadingStore.getState().loadingStates["airport-large"]).toBe(
            true
        );
    });

    it("toggles the Street View picker", () => {
        useMapStore.getState().toggleStreetViewPicker();

        expect(useMapStore.getState().showStreetViewPicker).toBe(true);
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

    it("stores the selected country payload", () => {
        useMapStore.getState().setSelectedCountry(selectedCountry);

        expect(useMapStore.getState().selectedCountry).toEqual(selectedCountry);
        expect(useMapStore.getState().selectedAirport).toBeNull();
    });

    it("stores the selected airport payload", () => {
        useMapStore.getState().setSelectedAirport(selectedAirport);

        expect(useMapStore.getState().selectedAirport).toEqual(selectedAirport);
        expect(useMapStore.getState().selectedCountry).toBeNull();
        expect(useMapStore.getState().selectedLocation).toBeNull();
    });

    it("stores the selected location payload", () => {
        useMapStore.getState().setSelectedLocation(selectedLocation);

        expect(useMapStore.getState().selectedLocation).toEqual(
            selectedLocation
        );
        expect(useMapStore.getState().selectedAirport).toBeNull();
        expect(useMapStore.getState().selectedCountry).toBeNull();
    });
});
