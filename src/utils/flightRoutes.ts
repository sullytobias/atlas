import type { FeatureCollection, LineString } from "geojson";

type Airport = { lon: number; lat: number };

const K = 4;
const N_SEGMENTS = 24;

const airportsUrl = new URL("../data/airports.json", import.meta.url).href;

function haversineKm(lon1: number, lat1: number, lon2: number, lat2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function toCartesian(lon: number, lat: number): [number, number, number] {
    const phi = (lat * Math.PI) / 180;
    const lam = (lon * Math.PI) / 180;
    return [Math.cos(phi) * Math.cos(lam), Math.cos(phi) * Math.sin(lam), Math.sin(phi)];
}

function toLatLon(v: [number, number, number]): [number, number] {
    return [(Math.atan2(v[1], v[0]) * 180) / Math.PI, (Math.asin(v[2]) * 180) / Math.PI];
}

function slerp(
    a: [number, number, number],
    b: [number, number, number],
    t: number,
): [number, number, number] {
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const omega = Math.acos(dot);
    if (omega < 1e-10) return a;
    const s = Math.sin(omega);
    const fa = Math.sin((1 - t) * omega) / s;
    const fb = Math.sin(t * omega) / s;
    return [fa * a[0] + fb * b[0], fa * a[1] + fb * b[1], fa * a[2] + fb * b[2]];
}

function unwrapLongitudes(coords: Array<[number, number]>): Array<[number, number]> {
    const result: Array<[number, number]> = [coords[0]];
    for (let i = 1; i < coords.length; i++) {
        let [lon, lat] = coords[i];
        const prevLon = result[i - 1][0];
        while (lon - prevLon > 180) lon -= 360;
        while (prevLon - lon > 180) lon += 360;
        result.push([lon, lat]);
    }
    return result;
}

function arcCoords(
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number,
): Array<[number, number]> {
    const a = toCartesian(lon1, lat1);
    const b = toCartesian(lon2, lat2);
    const coords: Array<[number, number]> = [];
    for (let i = 0; i <= N_SEGMENTS; i++) {
        coords.push(toLatLon(slerp(a, b, i / N_SEGMENTS)));
    }
    return unwrapLongitudes(coords);
}

function computeRoutes(airports: Airport[]): FeatureCollection<LineString> {
    const edgeSet = new Set<string>();
    const features: FeatureCollection<LineString>["features"] = [];

    airports.forEach((src, i) => {
        airports
            .map((dst, j) => ({
                j,
                dist: i === j ? Infinity : haversineKm(src.lon, src.lat, dst.lon, dst.lat),
            }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, K)
            .forEach(({ j }) => {
                const key = i < j ? `${i}:${j}` : `${j}:${i}`;
                if (!edgeSet.has(key)) {
                    edgeSet.add(key);
                    const dst = airports[j];
                    features.push({
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: arcCoords(src.lon, src.lat, dst.lon, dst.lat),
                        },
                    });
                }
            });
    });

    return { type: "FeatureCollection", features };
}

let cached: FeatureCollection<LineString> | null = null;

export async function getFlightRoutesGeoJson(): Promise<FeatureCollection<LineString>> {
    if (cached) return cached;

    const resp = await fetch(airportsUrl);
    const data = (await resp.json()) as {
        features: {
            properties: { type: string };
            geometry: { coordinates: number[] };
        }[];
    };

    const airports: Airport[] = data.features
        .filter((f) => f.properties.type === "large_airport")
        .map((f) => ({ lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1] }));

    cached = computeRoutes(airports);
    return cached;
}
