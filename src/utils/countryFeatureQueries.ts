import type {
    Map as MLMap,
    MapGeoJSONFeature,
    PointLike,
} from "maplibre-gl";

const COUNTRY_QUERY_LAYERS = [
    "countries-fill",
    "countries-tint",
    "density-choropleth",
    "population-choropleth",
    "continents-fill",
    "coastline",
] as const;

function isCountryFeature(feature: MapGeoJSONFeature): boolean {
    return (
        feature.source === "countries" && feature.sourceLayer === "countries"
    );
}

export function getCountryFeaturesAtPoint(
    map: MLMap,
    point: PointLike,
): MapGeoJSONFeature[] {
    const layerMatches = map
        .queryRenderedFeatures(point, {
            layers: [...COUNTRY_QUERY_LAYERS],
        })
        .filter(isCountryFeature);

    if (layerMatches.length > 0) {
        return layerMatches;
    }

    return map.queryRenderedFeatures(point).filter(isCountryFeature);
}
