import fs from "node:fs";

function roundCoordinate(value) {
    return Math.round(value * 1000) / 1000;
}

function hashString(value) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

function hslToHex(hue, saturation, lightness) {
    const normalizedHue = hue / 360;
    const normalizedSaturation = saturation / 100;
    const normalizedLightness = lightness / 100;

    if (normalizedSaturation === 0) {
        const value = Math.round(normalizedLightness * 255)
            .toString(16)
            .padStart(2, "0");
        return `#${value}${value}${value}`;
    }

    const hueToRgb = (p, q, t) => {
        let adjustedTime = t;

        if (adjustedTime < 0) {
            adjustedTime += 1;
        }

        if (adjustedTime > 1) {
            adjustedTime -= 1;
        }

        if (adjustedTime < 1 / 6) {
            return p + (q - p) * 6 * adjustedTime;
        }

        if (adjustedTime < 1 / 2) {
            return q;
        }

        if (adjustedTime < 2 / 3) {
            return p + (q - p) * (2 / 3 - adjustedTime) * 6;
        }

        return p;
    };

    const q =
        normalizedLightness < 0.5
            ? normalizedLightness * (1 + normalizedSaturation)
            : normalizedLightness + normalizedSaturation - normalizedLightness * normalizedSaturation;
    const p = 2 * normalizedLightness - q;
    const red = hueToRgb(p, q, normalizedHue + 1 / 3);
    const green = hueToRgb(p, q, normalizedHue);
    const blue = hueToRgb(p, q, normalizedHue - 1 / 3);

    return `#${[red, green, blue]
        .map((channel) =>
            Math.round(channel * 255)
                .toString(16)
                .padStart(2, "0"),
        )
        .join("")}`;
}

function buildTimezoneColors(tzid) {
    const hash = hashString(tzid);
    const hue = hash % 360;
    const fillColor = hslToHex(hue, 58, 80);
    const outlineColor = hslToHex(hue, 46, 58);
    const textColor = hslToHex(hue, 38, 24);

    return {
        fillColor,
        outlineColor,
        textColor,
    };
}

function roundGeometryCoordinates(coordinates) {
    if (!Array.isArray(coordinates[0])) {
        return coordinates.map((value) => roundCoordinate(value));
    }

    return coordinates.map((nested) => roundGeometryCoordinates(nested));
}

function calculateRingArea(ring) {
    let area = 0;

    for (let index = 0; index < ring.length - 1; index += 1) {
        const [x1, y1] = ring[index];
        const [x2, y2] = ring[index + 1];
        area += x1 * y2 - x2 * y1;
    }

    return area / 2;
}

function calculateRingCentroid(ring) {
    const area = calculateRingArea(ring);

    if (area === 0) {
        return ring[0];
    }

    let centroidX = 0;
    let centroidY = 0;

    for (let index = 0; index < ring.length - 1; index += 1) {
        const [x1, y1] = ring[index];
        const [x2, y2] = ring[index + 1];
        const factor = x1 * y2 - x2 * y1;
        centroidX += (x1 + x2) * factor;
        centroidY += (y1 + y2) * factor;
    }

    return [centroidX / (6 * area), centroidY / (6 * area)];
}

function getRepresentativeCoordinate(geometry) {
    const polygons =
        geometry.type === "Polygon"
            ? [geometry.coordinates]
            : geometry.coordinates;

    let largestArea = -Infinity;
    let representativeCoordinate = [0, 0];

    polygons.forEach((polygon) => {
        const outerRing = polygon[0];
        const area = Math.abs(calculateRingArea(outerRing));

        if (area > largestArea) {
            largestArea = area;
            representativeCoordinate = calculateRingCentroid(outerRing);
        }
    });

    return representativeCoordinate;
}

function parseUtcOffsetLabel(label) {
    if (label === "UTC") {
        return 0;
    }

    const match = label.match(/^UTC([+-])(\d{1,2})(?::(\d{2}))?$/);

    if (!match) {
        return Number.POSITIVE_INFINITY;
    }

    const [, sign, hours, minutes = "0"] = match;
    const totalMinutes = Number(hours) * 60 + Number(minutes);

    return sign === "-" ? -totalMinutes : totalMinutes;
}

function getUtcOffsetLabel(tzid, date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tzid,
        timeZoneName: "shortOffset",
        hour: "2-digit",
        minute: "2-digit",
    });
    const part = formatter
        .formatToParts(date)
        .find(({ type }) => type === "timeZoneName");

    return part?.value.replace("GMT", "UTC") ?? "UTC";
}

function buildTimezoneLabel(tzid) {
    const currentYear = new Date().getUTCFullYear();
    const referenceDates = [
        new Date(Date.UTC(currentYear, 0, 1)),
        new Date(Date.UTC(currentYear, 6, 1)),
    ];
    const offsetLabels = [...new Set(referenceDates.map((date) => getUtcOffsetLabel(tzid, date)))].sort(
        (left, right) => parseUtcOffsetLabel(left) - parseUtcOffsetLabel(right),
    );

    return offsetLabels.join(" / ");
}

function buildLabelFeature(tzid, geometry) {
    const [longitude, latitude] = getRepresentativeCoordinate(geometry);
    const colors = buildTimezoneColors(tzid);

    return {
        type: "Feature",
        properties: {
            tzid,
            label: buildTimezoneLabel(tzid),
            cityLabel: tzid.split("/").pop()?.replaceAll("_", " ") ?? tzid,
            ...colors,
        },
        geometry: {
            type: "Point",
            coordinates: [
                roundCoordinate(longitude),
                roundCoordinate(latitude),
            ],
        },
    };
}

function main() {
    const [, , inputPath, polygonsOutputPath, labelsOutputPath] = process.argv;

    if (!inputPath || !polygonsOutputPath || !labelsOutputPath) {
        console.error(
            "Usage: node scripts/generateTimezones.mjs <input.json> <polygons-output.json> <labels-output.json>",
        );
        process.exit(1);
    }

    const raw = fs.readFileSync(inputPath, "utf8");
    const parsed = JSON.parse(raw);

    const polygonFeatures = parsed.features.map((feature) => {
        const tzid = feature.properties.tzid;

        return {
            type: "Feature",
            properties: {
                tzid,
                ...buildTimezoneColors(tzid),
            },
            geometry: {
                type: feature.geometry.type,
                coordinates: roundGeometryCoordinates(feature.geometry.coordinates),
            },
        };
    });

    const labelFeatures = polygonFeatures.map((feature) =>
        buildLabelFeature(feature.properties.tzid, feature.geometry),
    );

    fs.writeFileSync(
        polygonsOutputPath,
        JSON.stringify({
            type: "FeatureCollection",
            features: polygonFeatures,
        }),
    );
    fs.writeFileSync(
        labelsOutputPath,
        JSON.stringify({
            type: "FeatureCollection",
            features: labelFeatures,
        }),
    );
}

main();
