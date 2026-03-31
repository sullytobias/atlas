import { useCallback } from "react";
import { useMapStore, type SelectedCountry } from "../../store/loadingStore";
import countryData from "../../data/data.json";
import "./RandomCountryButton.css";

type CountryFeature = {
    geometry: { coordinates: [number, number] };
    properties: SelectedCountry;
};

const features = (countryData as { features: CountryFeature[] }).features;

export default function RandomCountryButton() {
    const { setSelectedCountry, setPendingFlyTo } = useMapStore();

    const handleClick = useCallback(() => {
        const feature = features[Math.floor(Math.random() * features.length)];
        setSelectedCountry(feature.properties);
        const [lng, lat] = feature.geometry.coordinates;
        setPendingFlyTo([lng, lat]);
    }, [setSelectedCountry, setPendingFlyTo]);

    return (
        <button
            className="random-country-btn"
            onClick={handleClick}
            aria-label="Fly to a random country"
            title="Random country"
        >
            ⚄
        </button>
    );
}
