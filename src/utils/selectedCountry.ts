import type { MapGeoJSONFeature } from "maplibre-gl";
import countryData from "../data/data.json";
import { REVERSE_CODE_MAPPING } from "./countryCodeMappings";
import type { SelectedCountry } from "../store/loadingStore";

type CountryFeature = {
    properties: Omit<SelectedCountry, "continent" | "timezoneInfo">;
};

export function getSelectedCountryFromFeature(
    feature: MapGeoJSONFeature,
): SelectedCountry | null {
    const { ADM0_A3, CONTINENT } = feature.properties || {};

    if (typeof ADM0_A3 !== "string") {
        return null;
    }

    const mappedCode = REVERSE_CODE_MAPPING[ADM0_A3] || ADM0_A3;
    if (!mappedCode) {
        return null;
    }

    const countryFeature = (countryData as { features: CountryFeature[] }).features
        .find((country) => country.properties.cca3 === mappedCode);

    if (!countryFeature) {
        console.warn(`No country data found for: ${ADM0_A3}`);
        return null;
    }

    return {
        ...countryFeature.properties,
        continent: typeof CONTINENT === "string" ? CONTINENT : undefined,
    };
}
