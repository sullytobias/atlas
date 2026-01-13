import { useState, useCallback } from "react";
import Map from "./components/Map";
import MapControls from "./components/MapControls/MapControls";
import Legend from "./components/Legend/Legend";
import { CONTINENTS } from "./constants/continents";

const colors = [
    { color: "#87CEEB", label: "< 1M" },
    { color: "#4169E1", label: "1-10M" },
    { color: "#FFA500", label: "10-50M" },
    { color: "#FF4500", label: "50-100M" },
    { color: "#DC143C", label: "100-500M" },
    { color: "#8B008B", label: "> 500M" },
];

export default function App() {
    const [showCoastlines, setShowCoastlines] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [showCapitals, setShowCapitals] = useState(false);
    const [showContinents, setShowContinents] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [showTerrain, setShowTerrain] = useState(false);
    const [showAirports, setShowAirports] = useState({
        large: false,
        medium: false,
        small: false,
        heliport: false,
        seaplane: false,
        closed: false,
        balloonport: false,
    });
    const [showGlobe, setShowGlobe] = useState(false);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );

    const handleLoadingComplete = useCallback((key: string) => {
        if (key === "all") {
            setLoadingStates({});
        } else {
            setLoadingStates((prev) => ({ ...prev, [key]: false }));
        }
    }, []);

    const handleToggleWithLoading = (
        key: string,
        toggleFn: (value: boolean) => void,
        currentValue: boolean
    ) => {
        setLoadingStates((prev) => ({ ...prev, [key]: true }));
        toggleFn(!currentValue);
    };

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
            <Legend sections={legendSections} />

            <MapControls
                showCoastlines={showCoastlines}
                onToggleCoastlines={() =>
                    handleToggleWithLoading(
                        "coastlines",
                        setShowCoastlines,
                        showCoastlines
                    )
                }
                showSatellite={showSatellite}
                onToggleSatellite={() =>
                    handleToggleWithLoading(
                        "satellite",
                        setShowSatellite,
                        showSatellite
                    )
                }
                showCapitals={showCapitals}
                onToggleCapitals={() =>
                    handleToggleWithLoading(
                        "capitals",
                        setShowCapitals,
                        showCapitals
                    )
                }
                showContinents={showContinents}
                onToggleContinents={() =>
                    handleToggleWithLoading(
                        "continents",
                        setShowContinents,
                        showContinents
                    )
                }
                showHeatmap={showHeatmap}
                onToggleHeatmap={() =>
                    handleToggleWithLoading(
                        "heatmap",
                        setShowHeatmap,
                        showHeatmap
                    )
                }
                showAirports={showAirports}
                onToggleAirports={setShowAirports}
                showTerrain={showTerrain}
                onToggleTerrain={() =>
                    handleToggleWithLoading(
                        "terrain",
                        setShowTerrain,
                        showTerrain
                    )
                }
                loadingStates={loadingStates}
                setLoadingStates={setLoadingStates}
            />

            <Map
                showCoastlines={showCoastlines}
                showSatellite={showSatellite}
                showCapitals={showCapitals}
                showContinents={showContinents}
                showHeatmap={showHeatmap}
                showGlobe={showGlobe}
                showAirports={showAirports}
                showTerrain={showTerrain}
                onLoadingComplete={handleLoadingComplete}
            />

            <button
                onClick={() => setShowGlobe(!showGlobe)}
                style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    fontSize: "50px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "50%",
                    width: "56px",
                    height: "56px",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                }}
            >
                {showGlobe ? "🗺️" : "🌍"}
            </button>
        </>
    );
}
