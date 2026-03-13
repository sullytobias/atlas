import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type RestCountryCurrency = {
    name: string;
};

type RestCountry = {
    name: {
        common: string;
    };
    capital?: string[];
    capitalInfo?: {
        latlng?: [number, number];
    };
    population: number;
    flags: {
        svg?: string;
        png?: string;
        alt?: string;
    };
    currencies?: Record<string, RestCountryCurrency>;
    area: number;
    car?: {
        signs?: string[];
        side?: "left" | "right";
    };
    languages?: Record<string, string>;
    cca3?: string;
};

type CountryFeature = {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: {
        capital: string;
        country: string;
        population: number;
        flag: string;
        flagAlt: string;
        currencies: string;
        area: number;
        populationDensity: number;
        languages: string;
        car: {
            signs: string[];
            side: "left" | "right";
        };
        cca3: string;
    };
};

async function generateData() {
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,capitalInfo,population,flags,currencies,area,car,languages,cca3"
    );
    if (!response.ok) {
        throw new Error(
            `REST Countries request failed with status ${response.status}`
        );
    }

    const countries = (await response.json()) as RestCountry[];

    const features = countries
        .filter(
            (
                country
            ): country is RestCountry & {
                capital: [string, ...string[]];
                capitalInfo: { latlng: [number, number] };
            } => Boolean(country.capital?.[0] && country.capitalInfo?.latlng)
        )
        .map((country): CountryFeature => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [
                    country.capitalInfo.latlng[1],
                    country.capitalInfo.latlng[0],
                ],
            },
            properties: {
                capital: country.capital[0],
                country: country.name.common,
                population: country.population,
                flag: country.flags.svg || country.flags.png || "",
                flagAlt:
                    country.flags.alt || `Flag of ${country.name.common}`,
                currencies: country.currencies
                    ? Object.values(country.currencies)
                          .map((currency) => currency.name)
                          .join(", ")
                    : "N/A",
                area: country.area,
                populationDensity: country.area
                    ? Math.round(country.population / country.area)
                    : 0,
                languages: country.languages
                    ? Object.values(country.languages).join(", ")
                    : "N/A",
                car: {
                    signs: country.car?.signs || [],
                    side: country.car?.side || "right",
                },
                cca3: country.cca3 || "N/A",
            },
        }));

    const geojson = {
        type: "FeatureCollection",
        features,
    };

    const outputPath = path.join(__dirname, "../src/data/data.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));

    console.log(`Generated ${features.length} capitals`);
    console.log(`Saved to ${outputPath}`);
}

generateData().catch((error: unknown) => {
    const message =
        error instanceof Error ? error.message : "Unknown data generation error";
    console.error(message);
    process.exitCode = 1;
});
