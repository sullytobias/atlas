import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateCapitals() {
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,capitalInfo,population,flags,currencies,area,car,languages,cca3"
    );
    const countries = await response.json();

    const features = countries
        .filter((c: any) => c.capital && c.capitalInfo?.latlng)
        .map((c: any) => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [c.capitalInfo.latlng[1], c.capitalInfo.latlng[0]],
            },
            properties: {
                capital: c.capital[0],
                country: c.name.common,
                population: c.population,
                flag: c.flags.svg || c.flags.png,
                flagAlt: c.flags.alt || `Flag of ${c.name.common}`,
                currencies: c.currencies
                    ? Object.values(c.currencies)
                          .map((cur: any) => cur.name)
                          .join(", ")
                    : "N/A",
                area: c.area,
                languages: c.languages
                    ? Object.values(c.languages).join(", ")
                    : "N/A",
                car: {
                    signs: c.car?.signs || [],
                    side: c.car?.side || "right",
                },
                cca3: c.cca3 || "N/A",
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

generateCapitals();