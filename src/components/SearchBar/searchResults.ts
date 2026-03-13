export type CountryDataItem = {
    properties: {
        capital?: string;
        country: string;
        population: number;
        flag: string;
        flagAlt: string;
        cca3: string;
    };
    geometry: {
        type: string;
        coordinates: [number, number] | null[];
    };
};

export type SearchResult = {
    country: string;
    capital: string;
    flag: string;
    flagAlt?: string;
    coordinates: [number, number];
    matchType: "country" | "capital";
};

export function getSearchResults(
    countries: CountryDataItem[],
    searchTerm: string
): SearchResult[] {
    if (!searchTerm.trim()) return [];

    const searchLower = searchTerm.toLowerCase();
    const filteredResults: SearchResult[] = [];

    countries.forEach((country) => {
        const { properties, geometry } = country;
        if (
            !properties.capital ||
            !geometry.coordinates ||
            geometry.coordinates.length !== 2
        ) {
            return;
        }

        const countryName = properties.country.toLowerCase();
        const capitalName = properties.capital.toLowerCase();
        const coords = geometry.coordinates as [number, number];

        if (countryName.includes(searchLower)) {
            filteredResults.push({
                country: properties.country,
                capital: properties.capital,
                flag: properties.flag,
                flagAlt: properties.flagAlt,
                coordinates: coords,
                matchType: "country",
            });
        } else if (capitalName.includes(searchLower)) {
            filteredResults.push({
                country: properties.country,
                capital: properties.capital,
                flag: properties.flag,
                flagAlt: properties.flagAlt,
                coordinates: coords,
                matchType: "capital",
            });
        }
    });

    filteredResults.sort((a, b) => {
        const aCountry = a.country.toLowerCase();
        const bCountry = b.country.toLowerCase();
        const aCapital = a.capital.toLowerCase();
        const bCapital = b.capital.toLowerCase();

        if (aCountry === searchLower && bCountry !== searchLower) return -1;
        if (bCountry === searchLower && aCountry !== searchLower) return 1;
        if (aCapital === searchLower && bCapital !== searchLower) return -1;
        if (bCapital === searchLower && aCapital !== searchLower) return 1;
        if (a.matchType === "country" && b.matchType === "capital") return -1;
        if (a.matchType === "capital" && b.matchType === "country") return 1;

        return aCountry.localeCompare(bCountry);
    });

    return filteredResults.slice(0, 10);
}
