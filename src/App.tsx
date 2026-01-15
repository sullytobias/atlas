import { useCallback, useRef } from "react";
import Map, { MapRef } from "./components/Map";
import MapControls from "./components/MapControls/MapControls";
import Legend from "./components/Legend/Legend";
import SearchBar from "./components/SearchBar/SearchBar";
import { CONTINENTS } from "./constants/continents";
import { useLoadingStore, useMapStore } from "./store/loadingStore";

const colors = [
    { color: "#87CEEB", label: "< 1M" },
    { color: "#4169E1", label: "1-10M" },
    { color: "#FFA500", label: "10-50M" },
    { color: "#FF4500", label: "50-100M" },
    { color: "#DC143C", label: "100-500M" },
    { color: "#8B008B", label: "> 500M" },
];

export default function App() {
    const { clearLoading, clearAllLoading } = useLoadingStore();
    const { showContinents, showHeatmap } = useMapStore();
    const mapRef = useRef<MapRef>(null);

    const handleLoadingComplete = useCallback(
        (key: string) => {
            if (key === "all") {
                clearAllLoading();
            } else {
                clearLoading(key);
            }
        },
        [clearLoading, clearAllLoading]
    );

    const handleLocationSelect = useCallback(
        (coordinates: [number, number], zoom?: number) => {
            if (mapRef.current) {
                mapRef.current.flyToLocation(coordinates, zoom);
            }
        },
        []
    );

    const legendSections = [
        {
            title: "Continents",
            icon: "🗺️",
            isVisible: showContinents,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {CONTINENTS.filter((c) => c.name !== "Antarctica").map(
                        (continent) => (
                            <a
                                key={continent.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: "#f9fafb",
                                    transition: "all 0.2s ease",
                                    textDecoration: "none",
                                    border: "1px solid #e5e7eb",
                                }}
                                href={continent.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "18px",
                                        height: "18px",
                                        backgroundColor: continent.color,
                                        borderRadius: "4px",
                                        marginRight: "12px",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                ></span>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        marginRight: "auto",
                                        color: "#374151",
                                    }}
                                >
                                    {continent.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        color: "#6b7280",
                                    }}
                                >
                                    🔗
                                </span>
                            </a>
                        )
                    )}
                </div>
            ),
        },
        {
            title: "Population Density",
            icon: "🔥",
            isVisible: showHeatmap,
            content: (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    {colors.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <div
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: item.color,
                                    borderRadius: "6px",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    flexShrink: 0,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "13px",
                                    color: "#374151",
                                    fontWeight: "500",
                                }}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <>
            <SearchBar onLocationSelect={handleLocationSelect} />

            <Legend sections={legendSections} />

            <MapControls />

            <Map ref={mapRef} onLoadingComplete={handleLoadingComplete} />
        </>
    );
}
