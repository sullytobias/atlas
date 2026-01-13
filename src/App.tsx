import { useState } from "react";
import Map from "./components/Map";
import LayerToggles from "./components/LayerToggle/LayerToggle";
import Legend from "./components/Legend/Legend";
import AdvancedFilters from "./components/AdvancedFilters/AdvancedFilters";
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

    const continentsOffset = 0;
    const heatmapOffset = showContinents ? 1 : 0;

    return (
        <>
            <Legend
                title="Continents"
                isVisible={showContinents}
                offset={continentsOffset}
                closedIcon={"🗺️"}
            >
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
                                    padding: "8px 10px",
                                    borderRadius: "6px",
                                    backgroundColor: "rgba(0,0,0,0.03)",
                                    transition: "background-color 0.15s ease",
                                    textDecoration: "none",
                                }}
                                href={continent.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.08)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.03)";
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "16px",
                                        height: "16px",
                                        backgroundColor: continent.color,
                                        borderRadius: "3px",
                                        marginRight: "10px",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                ></span>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        marginRight: "auto",
                                    }}
                                >
                                    {continent.name}
                                </span>
                                🔗
                            </a>
                        )
                    )}
                </div>
            </Legend>

            <Legend
                title="Population"
                isVisible={showHeatmap}
                offset={heatmapOffset}
                closedIcon={"🔥"}
            >
                {colors.map((item) => (
                    <div
                        key={item.label}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                        }}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: item.color,
                                borderRadius: "4px",
                            }}
                        />
                        <span style={{ fontSize: "12px" }}>{item.label}</span>
                    </div>
                ))}
            </Legend>

            <LayerToggles
                onToggleHeatmap={setShowHeatmap}
                showHeatmap={showHeatmap}
                showContinents={showContinents}
                onToggleContinents={setShowContinents}
                showCoastlines={showCoastlines}
                onToggleCoastlines={setShowCoastlines}
                showSatellite={showSatellite}
                onToggleSatellite={setShowSatellite}
                showCapitals={showCapitals}
                onToggleCapitals={setShowCapitals}
            />

            <AdvancedFilters
                showAirports={showAirports}
                onToggleAirports={setShowAirports}
                showTerrain={showTerrain}
                onToggleTerrain={setShowTerrain}
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
            />

            <button
                onClick={() => setShowGlobe(!showGlobe)}
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    backgroundColor: showGlobe ? "#4169E1" : "#fff",
                    color: showGlobe ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "50%",
                    width: "56px",
                    height: "56px",
                    fontSize: "24px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                        "translateX(-50%) scale(1.1) translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                        "translateX(-50%) scale(1) translateY(0)";
                    e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0, 0, 0, 0.2)";
                }}
                title={
                    showGlobe ? "Switch to Flat Map" : "Switch to Globe View"
                }
            >
                {showGlobe ? "🗺️" : "🌍"}
            </button>
        </>
    );
}
