import { describe, expect, it } from "vitest";
import {
    getSearchResults,
    type CountryDataItem,
} from "./searchResults";

const countries: CountryDataItem[] = [
    {
        properties: {
            capital: "Paris",
            country: "France",
            population: 68000000,
            flag: "fr.svg",
            flagAlt: "France flag",
            cca3: "FRA",
        },
        geometry: {
            type: "Point",
            coordinates: [2.35, 48.85],
        },
    },
    {
        properties: {
            capital: "Libreville",
            country: "Gabon",
            population: 2400000,
            flag: "ga.svg",
            flagAlt: "Gabon flag",
            cca3: "GAB",
        },
        geometry: {
            type: "Point",
            coordinates: [9.45, 0.39],
        },
    },
    {
        properties: {
            capital: "Panama City",
            country: "Panama",
            population: 4500000,
            flag: "pa.svg",
            flagAlt: "Panama flag",
            cca3: "PAN",
        },
        geometry: {
            type: "Point",
            coordinates: [-79.52, 8.98],
        },
    },
];

describe("getSearchResults", () => {
    it("prioritizes exact country matches over other results", () => {
        const results = getSearchResults(countries, "France");

        expect(results[0]).toMatchObject({
            country: "France",
            matchType: "country",
        });
    });

    it("returns capital matches when the capital contains the query", () => {
        const results = getSearchResults(countries, "pari");

        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({
            country: "France",
            capital: "Paris",
            matchType: "capital",
        });
    });

    it("limits the result count to ten items", () => {
        const manyCountries = Array.from({ length: 12 }, (_, index) => ({
            properties: {
                capital: `Capital ${index}`,
                country: `Land ${index}`,
                population: index,
                flag: `${index}.svg`,
                flagAlt: `Flag ${index}`,
                cca3: `C${index}`,
            },
            geometry: {
                type: "Point" as const,
                coordinates: [index, index] as [number, number],
            },
        }));

        const results = getSearchResults(manyCountries, "land");

        expect(results).toHaveLength(10);
    });
});
