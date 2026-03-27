import { describe, expect, it } from "vitest";
import {
    buildMeasurementLabelGeoJson,
    buildMeasurementLineGeoJson,
    buildMeasurementPointsGeoJson,
    calculateProjectedDistance,
    formatDistance,
} from "./distanceMeasurement";

describe("distanceMeasurement", () => {
    it("returns zero for identical coordinates", () => {
        const result = calculateProjectedDistance(
            { latitude: 48.85837, longitude: 2.294481 },
            { latitude: 48.85837, longitude: 2.294481 }
        );

        expect(result.distanceMeters).toBe(0);
        expect(result.distanceKilometers).toBe(0);
    });

    it("calculates projected distance between two points", () => {
        const result = calculateProjectedDistance(
            { latitude: 48.85837, longitude: 2.294481 },
            { latitude: 51.500729, longitude: -0.124625 }
        );

        expect(result.distanceMeters).toBeGreaterThan(500000);
        expect(result.distanceMeters).toBeLessThan(600000);
        expect(result.distanceKilometers).toBeCloseTo(
            result.distanceMeters / 1000,
            6
        );
    });

    it("formats distances in meters and kilometers", () => {
        expect(formatDistance(250)).toBe("250 m");
        expect(formatDistance(1234)).toBe("1.23 km");
    });

    it("builds a line between two measurement points", () => {
        const geoJson = buildMeasurementLineGeoJson(
            { latitude: 48.85837, longitude: 2.294481 },
            { latitude: 51.500729, longitude: -0.124625 }
        );

        expect(geoJson.features).toHaveLength(1);
        expect(geoJson.features[0].geometry.type).toBe("LineString");
    });

    it("builds point markers for available measurement points", () => {
        const geoJson = buildMeasurementPointsGeoJson(
            { latitude: 48.85837, longitude: 2.294481 },
            null
        );

        expect(geoJson.features).toHaveLength(1);
        expect(geoJson.features[0].geometry.type).toBe("Point");
    });

    it("builds a midpoint label for completed measurements", () => {
        const geoJson = buildMeasurementLabelGeoJson(
            { latitude: 48.85837, longitude: 2.294481 },
            { latitude: 51.500729, longitude: -0.124625 },
            1234
        );

        expect(geoJson.features).toHaveLength(1);
        expect(geoJson.features[0].properties?.label).toBe("1.23 km");
    });
});
