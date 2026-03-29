import { describe, expect, it, vi } from "vitest";
import type { MapGeoJSONFeature } from "maplibre-gl";
import { getCountryFeaturesAtPoint } from "./countryFeatureQueries";

function createFeature(
    overrides: Partial<MapGeoJSONFeature> = {},
): MapGeoJSONFeature {
    return {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: [],
        },
        properties: {},
        source: "countries",
        sourceLayer: "countries",
        state: {},
        layer: {
            id: "countries-fill",
            type: "fill",
            source: "countries",
        },
        ...overrides,
    } as MapGeoJSONFeature;
}

describe("getCountryFeaturesAtPoint", () => {
    it("returns direct country layer matches when available", () => {
        const countryFeature = createFeature();
        const queryRenderedFeatures = vi
            .fn()
            .mockReturnValueOnce([countryFeature]);
        const map = { queryRenderedFeatures } as never;

        const result = getCountryFeaturesAtPoint(map, { x: 10, y: 12 });

        expect(result).toEqual([countryFeature]);
        expect(queryRenderedFeatures).toHaveBeenCalledTimes(1);
    });

    it("falls back to all rendered features and filters countries", () => {
        const timezoneFeature = createFeature({
            source: "timezones",
            sourceLayer: "timezones",
            layer: {
                id: "timezones-fill",
                type: "fill",
                source: "timezones",
            },
        });
        const countryFeature = createFeature({
            id: 42,
            layer: {
                id: "countries-tint",
                type: "fill",
                source: "countries",
            },
        });
        const queryRenderedFeatures = vi
            .fn()
            .mockReturnValueOnce([])
            .mockReturnValueOnce([timezoneFeature, countryFeature]);
        const map = { queryRenderedFeatures } as never;

        const result = getCountryFeaturesAtPoint(map, { x: 10, y: 12 });

        expect(result).toEqual([countryFeature]);
        expect(queryRenderedFeatures).toHaveBeenCalledTimes(2);
    });
});
