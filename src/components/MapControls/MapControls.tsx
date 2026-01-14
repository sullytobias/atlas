import { useState } from "react";
import LayersTab from "./LayersTab";
import AdvancedTab from "./AdvancedTab";
import { useMapStore } from "../../store/loadingStore";
import "./MapControls.css";

export default function MapControls() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layers" | "advanced">("layers");
    const {
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showHeatmap,
        showAirports,
        showTerrain,
        showGlobe,
    } = useMapStore();

    const activeLayersCount = [
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showHeatmap,
    ].filter(Boolean).length;

    const activeAirportsCount =
        Object.values(showAirports).filter(Boolean).length;
    const active3DCount = (showTerrain ? 1 : 0) + (showGlobe ? 1 : 0);
    const totalActiveCount =
        activeLayersCount + activeAirportsCount + active3DCount;

    return (
        <>
            <button
                className={`controls-trigger ${isOpen ? "open" : "closed"}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="controls-icon">{isOpen ? "✕" : "⚙"}</span>
                {totalActiveCount > 0 && !isOpen && (
                    <span className="controls-badge">{totalActiveCount}</span>
                )}
            </button>

            {isOpen && (
                <div
                    className="controls-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`controls-panel ${isOpen ? "open" : "closed"}`}>
                <div className="controls-header">
                    <h2 className="controls-title">Map Controls</h2>
                    <button
                        className="controls-close"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="controls-tabs">
                    <button
                        className={`tab-button ${
                            activeTab === "layers" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("layers")}
                    >
                        <span className="tab-icon">🗺️</span>
                        <span className="tab-label">Layers</span>
                        {activeLayersCount > 0 && (
                            <span className="tab-badge">
                                {activeLayersCount}
                            </span>
                        )}
                    </button>
                    <button
                        className={`tab-button ${
                            activeTab === "advanced" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("advanced")}
                    >
                        <span className="tab-icon">✈️</span>
                        <span className="tab-label">Advanced</span>
                        {activeAirportsCount + active3DCount > 0 && (
                            <span className="tab-badge">
                                {activeAirportsCount + active3DCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="controls-content">
                    {activeTab === "layers" ? <LayersTab /> : <AdvancedTab />}
                </div>
            </div>
        </>
    );
}