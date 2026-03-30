import { beforeEach, describe, expect, it } from "vitest";
import {
    useLoadingStore,
    useMapStore,
    type MeasurementPoint,
    type SelectedAirport,
    type SelectedCountry,
    type SelectedLocation,
    type SelectedMeasurement,
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

const measurementStart: MeasurementPoint = {
    latitude: 48.85837,
    longitude: 2.294481,
};

const selectedMeasurement: SelectedMeasurement = {
    start: measurementStart,
    end: {
        latitude: 51.500729,
        longitude: -0.124625,
    },
    distanceMeters: 537821.32,
    distanceKilometers: 537.82132,
};

beforeEach(() => {
    useLoadingStore.setState({ loadingStates: {} });
    useMapStore.setState({
        showCoastlines: false,
        showSatellite: false,
        showCapitals: false,
        showContinents: false,
        showTimezones: false,
        showDensity: false,
        showHeatmap: false,
        showStreetViewPicker: false,
        showDistanceMeasure: false,
        showCountryComparison: false,
        showTerrain: false,
        showGlobe: false,
        selectedAirport: null,
        theme: "dark",
        selectedCountry: null,
        selectedLocation: null,
        measurementStart: null,
        selectedMeasurement: null,
        comparisonCountries: [null, null],
        hoveredComparisonCountry: null,
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

    it("toggles the timezone layer and marks it as loading", () => {
        useMapStore.getState().toggleTimezones();

        expect(useMapStore.getState().showTimezones).toBe(true);
        expect(useLoadingStore.getState().loadingStates.timezones).toBe(true);
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

    it("toggles the distance measurement tool and disables Street View", () => {
        useMapStore.getState().toggleStreetViewPicker();
        useMapStore.getState().toggleDistanceMeasure();

        expect(useMapStore.getState().showDistanceMeasure).toBe(true);
        expect(useMapStore.getState().showStreetViewPicker).toBe(false);
    });

    it("toggles country comparison mode", () => {
        useMapStore.getState().toggleCountryComparison();

        expect(useMapStore.getState().showCountryComparison).toBe(true);
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

    it("stores a measurement start and clears other selections", () => {
        useMapStore.getState().setSelectedCountry(selectedCountry);
        useMapStore.getState().setMeasurementStart(measurementStart);

        expect(useMapStore.getState().measurementStart).toEqual(
            measurementStart,
        );
        expect(useMapStore.getState().selectedCountry).toBeNull();
        expect(useMapStore.getState().selectedMeasurement).toBeNull();
    });

    it("stores a completed measurement and clears the pending start", () => {
        useMapStore.getState().setMeasurementStart(measurementStart);
        useMapStore.getState().setSelectedMeasurement(selectedMeasurement);

        expect(useMapStore.getState().selectedMeasurement).toEqual(
            selectedMeasurement,
        );
        expect(useMapStore.getState().measurementStart).toBeNull();
    });

    it("fills comparison slots in order", () => {
        useMapStore.getState().setComparisonCountry(selectedCountry);
        useMapStore.getState().setComparisonCountry({
            ...selectedCountry,
            cca3: "ESP",
            country: "Spain",
            capital: "Madrid",
        });

        expect(useMapStore.getState().comparisonCountries[0]?.cca3).toBe("FRA");
        expect(useMapStore.getState().comparisonCountries[1]?.cca3).toBe("ESP");
    });

    it("stores a hovered comparison preview only while compare mode is active", () => {
        useMapStore.getState().setHoveredComparisonCountry(selectedCountry);
        expect(useMapStore.getState().hoveredComparisonCountry).toBeNull();

        useMapStore.getState().toggleCountryComparison();
        useMapStore.getState().setHoveredComparisonCountry(selectedCountry);

        expect(useMapStore.getState().hoveredComparisonCountry?.cca3).toBe(
            "FRA"
        );
    });

    it("clears the hovered comparison preview after committing a comparison country", () => {
        useMapStore.getState().toggleCountryComparison();
        useMapStore.getState().setHoveredComparisonCountry(selectedCountry);
        useMapStore.getState().setComparisonCountry(selectedCountry);

        expect(useMapStore.getState().hoveredComparisonCountry).toBeNull();
    });

    it("clears a comparison slot and compacts remaining countries", () => {
        useMapStore.getState().setComparisonCountry(selectedCountry);
        useMapStore.getState().setComparisonCountry({
            ...selectedCountry,
            cca3: "ESP",
            country: "Spain",
            capital: "Madrid",
        });
        useMapStore.getState().clearComparisonSlot(0);

        expect(useMapStore.getState().comparisonCountries[0]?.cca3).toBe("ESP");
        expect(useMapStore.getState().comparisonCountries[1]).toBeNull();
    });

    it("clears measurement state when Street View is enabled", () => {
        useMapStore.getState().toggleDistanceMeasure();
        useMapStore.getState().setMeasurementStart(measurementStart);
        useMapStore.getState().toggleStreetViewPicker();

        expect(useMapStore.getState().showStreetViewPicker).toBe(true);
        expect(useMapStore.getState().showDistanceMeasure).toBe(false);
        expect(useMapStore.getState().measurementStart).toBeNull();
        expect(useMapStore.getState().selectedMeasurement).toBeNull();
    });

    it("clears completed measurements explicitly", () => {
        useMapStore.getState().setSelectedMeasurement(selectedMeasurement);
        useMapStore.getState().clearMeasurement();

        expect(useMapStore.getState().measurementStart).toBeNull();
        expect(useMapStore.getState().selectedMeasurement).toBeNull();
    });
});
