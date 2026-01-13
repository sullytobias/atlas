import fs from 'fs';
import csv from 'csv-parser';

const airports = {
  type: "FeatureCollection",
  features: []
};

fs.createReadStream("airports.csv")
    .pipe(csv())
    .on("data", (row) => {
        const lat = parseFloat(row.latitude_deg);
        const lon = parseFloat(row.longitude_deg);

        if (!isNaN(lat) && !isNaN(lon)) {
            airports.features.push({
                type: "Feature",
                properties: {
                    code: row.iata_code || row.ident,
                    name: row.name,
                    city: row.municipality,
                    country: row.iso_country,
                    type: row.type,
                    wikipedia_link: row.wikipedia_link,
                    home_link: row.home_link,
                },
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat],
                },
            });
        }
    })
    .on("end", () => {
        fs.writeFileSync(
            "src/data/airports.json",
            JSON.stringify(airports, null, 2)
        );
        console.log(`✅ Converted ${airports.features.length} airports`);

        const typeCounts = airports.features.reduce((acc, feature) => {
            const type = feature.properties.type;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        console.log("Airport types:", typeCounts);
    });