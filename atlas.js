// urbexAnalyser.js
// Usage: node urbexAnalyser.js Paris 20
//        node urbexAnalyser.js Lyon 25
//        node urbexAnalyser.js Paris 20 Lyon 25

const fs = require("fs");

const CITY_CENTERS = {
  paris: { lat: 48.8566, lon: 2.3522 },
  lyon: { lat: 45.764, lon: 4.8357 },
  marseille: { lat: 43.2965, lon: 5.3698 },
  lille: { lat: 50.6292, lon: 3.0573 },
  toulouse: { lat: 43.6047, lon: 1.4442 },
  bordeaux: { lat: 44.8378, lon: -0.5792 },
  nantes: { lat: 47.2184, lon: -1.5536 },
  strasbourg: { lat: 48.5734, lon: 7.7521 },
  montpellier: { lat: 43.6108, lon: 3.8767 },
  rennes: { lat: 48.1173, lon: -1.6778 },
};

function bboxFromCenterKm(lat, lon, radiusKm) {
  const dLat = radiusKm / 111;
  const dLon = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  const south = lat - dLat;
  const north = lat + dLat;
  const west = lon - dLon;
  const east = lon + dLon;
  return `${south},${west},${north},${east}`;
}

async function overpass(bbox) {
  const query = `
[out:json][timeout:120];
(
  nwr["ruins"="yes"](${bbox});
  nwr["building"="ruins"](${bbox});
  nwr["abandoned"](${bbox});
  nwr["disused"](${bbox});
  nwr["abandoned:building"](${bbox});
  nwr["disused:building"](${bbox});
  nwr["railway"="abandoned"](${bbox});
  nwr["railway"="disused"](${bbox});
  nwr["landuse"="industrial"](${bbox});
);
out center tags;
`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ data: query }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Overpass error: ${res.status} ${txt}`);
  }
  return res.json();
}

function score(tags = {}) {
  let s = 0;
  const r = [];

  if (tags.ruins === "yes" || tags.building === "ruins") { s += 3; r.push("ruins"); }
  if ("abandoned" in tags || "abandoned:building" in tags || tags.railway === "abandoned") {
    s += 3; r.push("abandoned");
  }
  if ("disused" in tags || "disused:building" in tags || tags.railway === "disused") {
    s += 2; r.push("disused");
  }
  if (tags.landuse === "industrial") { s += 1; r.push("industrial"); }

  return { s, r };
}

function usage() {
  console.log(`Usage:
  node urbexAnalyser.js Paris 20
  node urbexAnalyser.js Lyon 25
  node urbexAnalyser.js Paris 20 Lyon 25

Cities built-in: ${Object.keys(CITY_CENTERS).join(", ")}
(If your city isn't in the list, add it in CITY_CENTERS with lat/lon.)
`);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.length % 2 !== 0) return usage();

  const results = [];

  for (let i = 0; i < args.length; i += 2) {
    const city = String(args[i]).toLowerCase();
    const radiusKm = Number(args[i + 1]);

    if (!CITY_CENTERS[city]) {
      console.error(`❌ Unknown city: "${args[i]}". Add it to CITY_CENTERS.`);
      continue;
    }
    if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
      console.error(`❌ Invalid radius: "${args[i + 1]}" (km)`);
      continue;
    }

    const { lat, lon } = CITY_CENTERS[city];
    const bbox = bboxFromCenterKm(lat, lon, radiusKm);

    console.log(`🔍 Analyse ${args[i]} (radius ${radiusKm} km)`);
    const data = await overpass(bbox);

    for (const el of data.elements) {
      const lat2 = el.lat ?? el.center?.lat;
      const lon2 = el.lon ?? el.center?.lon;
      if (!lat2 || !lon2) continue;

      const { s, r } = score(el.tags);
      if (s < 2) continue;

      const name = el.tags?.name || el.tags?.old_name || `${el.type} ${el.id}`;

      results.push({
        city: args[i],
        name,
        score: s,
        reasons: r,
        lat: lat2,
        lon: lon2,
        googleMaps: `https://www.google.com/maps?q=${lat2},${lon2}`,
        osm: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  fs.writeFileSync("urbex_results.json", JSON.stringify(results, null, 2));
  console.log(`✅ ${results.length} candidats → urbex_results.json`);

  results.slice(0, 10).forEach((c, i) => {
    console.log(`${i + 1}. [${c.score}] ${c.name} (${c.city}) → ${c.googleMaps}`);
  });
})().catch((e) => {
  console.error("💥", e.message);
  process.exit(1);
});