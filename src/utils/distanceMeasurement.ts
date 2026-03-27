import type { FeatureCollection, LineString, Point } from "geojson";

const EARTH_RADIUS_METERS = 6378137;
const MAX_MERCATOR_LATITUDE = 85.05112878;

export type Coordinate = {
    latitude: number;
    longitude: number;
};

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}

function projectLongitude(longitude: number): number {
    return EARTH_RADIUS_METERS * toRadians(longitude);
}

function projectLatitude(latitude: number): number {
    const clampedLatitude = Math.max(
        Math.min(latitude, MAX_MERCATOR_LATITUDE),
        -MAX_MERCATOR_LATITUDE
    );

    return (
        EARTH_RADIUS_METERS *
        Math.log(Math.tan(Math.PI / 4 + toRadians(clampedLatitude) / 2))
    );
}

export function calculateProjectedDistance(
    start: Coordinate,
    end: Coordinate
): { distanceMeters: number; distanceKilometers: number } {
    const deltaX = projectLongitude(end.longitude) - projectLongitude(start.longitude);
    const deltaY = projectLatitude(end.latitude) - projectLatitude(start.latitude);
    const distanceMeters = Math.hypot(deltaX, deltaY);

    return {
        distanceMeters,
        distanceKilometers: distanceMeters / 1000,
    };
}

export function formatDistance(distanceMeters: number): string {
    if (!Number.isFinite(distanceMeters)) {
        return "N/A";
    }

    if (distanceMeters >= 1000) {
        return `${(distanceMeters / 1000).toFixed(2)} km`;
    }

    return `${distanceMeters.toFixed(0)} m`;
}

export function buildMeasurementLineGeoJson(
    start: Coordinate | null,
    end: Coordinate | null
): FeatureCollection<LineString, Record<string, never>> {
    if (!start || !end) {
        return {
            type: "FeatureCollection",
            features: [],
        };
    }

    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [start.longitude, start.latitude],
                        [end.longitude, end.latitude],
                    ],
                },
            },
        ],
    };
}

export function buildMeasurementPointsGeoJson(
    start: Coordinate | null,
    end: Coordinate | null
): FeatureCollection<Point, Record<string, never>> {
    const points = [start, end].filter((point): point is Coordinate => point !== null);

    return {
        type: "FeatureCollection",
        features: points.map((point) => ({
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [point.longitude, point.latitude],
            },
        })),
    };
}

export function buildMeasurementLabelGeoJson(
    start: Coordinate | null,
    end: Coordinate | null,
    distanceMeters: number | null
): FeatureCollection<Point, { label: string }> {
    if (!start || !end || distanceMeters === null) {
        return {
            type: "FeatureCollection",
            features: [],
        };
    }

    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {
                    label: formatDistance(distanceMeters),
                },
                geometry: {
                    type: "Point",
                    coordinates: [
                        (start.longitude + end.longitude) / 2,
                        (start.latitude + end.latitude) / 2,
                    ],
                },
            },
        ],
    };
}
