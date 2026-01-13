import fs from 'fs';
import csv from 'csv-parser';

const airports = {
  type: "FeatureCollection",
  features: []
};

fs.createReadStream('airports.csv')
  .pipe(csv())
  .on('data', (row) => {
    const lat = parseFloat(row.latitude_deg);
    const lon = parseFloat(row.longitude_deg);
    
    if (!isNaN(lat) && !isNaN(lon)) {
      airports.features.push({
        type: "Feature",
        properties: {
          id: row.id,
          ident: row.ident,
          type: row.type,
          name: row.name,
          latitude_deg: lat,
          longitude_deg: lon,
          elevation_ft: row.elevation_ft ? parseFloat(row.elevation_ft) : null,
          continent: row.continent,
          iso_country: row.iso_country,
          iso_region: row.iso_region,
          municipality: row.municipality,
          scheduled_service: row.scheduled_service,
          gps_code: row.gps_code,
          iata_code: row.iata_code,
          local_code: row.local_code,
          home_link: row.home_link,
          wikipedia_link: row.wikipedia_link,
          keywords: row.keywords
        },
        geometry: {
          type: "Point",
          coordinates: [lon, lat]
        }
      });
    }
  })
  .on('end', () => {
    fs.writeFileSync('src/data/airports.json', JSON.stringify(airports, null, 2));
    console.log(`✅ Converted ${airports.features.length} airports`);
    
    const typeCounts = airports.features.reduce((acc, feature) => {
      const type = feature.properties.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    console.log('\n📊 Airport types distribution:');
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count.toLocaleString()}`);
      });
    
    const countryCounts = airports.features.reduce((acc, feature) => {
      const country = feature.properties.iso_country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    console.log('\n🌍 Top 10 countries by airport count:');
    Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([country, count]) => {
        console.log(`  ${country}: ${count.toLocaleString()}`);
      });
  });