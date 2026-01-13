import { useState } from "react";
import LayersTab from "./LayersTab";
import AdvancedTab from "./AdvancedTab";
import "./MapControls.css";

type Props = {
    // Layer toggles
    showCoastlines: boolean;
    onToggleCoastlines: (show: boolean) => void;
    showSatellite: boolean;
    onToggleSatellite: (show: boolean) => void;
    showCapitals: boolean;
    onToggleCapitals: (show: boolean) => void;
    showContinents: boolean;
    onToggleContinents: (show: boolean) => void;
    showHeatmap: boolean;
    onToggleHeatmap: (show: boolean) => void;

    // Advanced filters
    showAirports: {
        large: boolean;
        medium: boolean;
        small: boolean;
        heliport: boolean;
        seaplane: boolean;
        closed: boolean;
        balloonport: boolean;
    };
    onToggleAirports: (airports: Props["showAirports"]) => void;
    showTerrain?: boolean;
    onToggleTerrain?: (show: boolean) => void;
    loadingStates?: Record<string, boolean>;
    setLoadingStates?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export default function MapControls({
    showCoastlines,
    onToggleCoastlines,
    showSatellite,
    onToggleSatellite,
    showCapitals,
    onToggleCapitals,
    showContinents,
    onToggleContinents,
    showHeatmap,
    onToggleHeatmap,
    showAirports,
    onToggleAirports,
    showTerrain,
    onToggleTerrain,
    loadingStates = {},
    setLoadingStates,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layers" | "advanced">("layers");

    const activeLayersCount = [
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showHeatmap,
    ].filter(Boolean).length;

    const activeAirportsCount = Object.values(showAirports).filter(Boolean).length;
    const active3DCount = showTerrain ? 1 : 0;
    const totalActiveCount = activeLayersCount + activeAirportsCount + active3DCount;

    const handleToggleWithLoading = (
        key: string,
        toggleFn: (value: boolean) => void,
        currentValue: boolean
    ) => {
        if (setLoadingStates) {
            setLoadingStates(prev => ({ ...prev, [key]: true }));
        }
        toggleFn(!currentValue);
    };

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

            {isOpen && <div className="controls-overlay" onClick={() => setIsOpen(false)} />}

            <div className={`controls-panel ${isOpen ? "open" : "closed"}`}>
                <div className="controls-header">
                    <h2 className="controls-title">Map Controls</h2>
                    <button className="controls-close" onClick={() => setIsOpen(false)}>
                        ✕
                    </button>
                </div>

                <div className="controls-tabs">
                    <button
                        className={`tab-button ${activeTab === "layers" ? "active" : ""}`}
                        onClick={() => setActiveTab("layers")}
                    >
                        <span className="tab-icon">🗺️</span>
                        <span className="tab-label">Layers</span>
                        {activeLayersCount > 0 && (
                            <span className="tab-badge">{activeLayersCount}</span>
                        )}
                    </button>
                    <button
                        className={`tab-button ${activeTab === "advanced" ? "active" : ""}`}
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
                    {activeTab === "layers" ? (
                        <LayersTab
                            showCoastlines={showCoastlines}
                            onToggleCoastlines={() => handleToggleWithLoading('coastlines', onToggleCoastlines, showCoastlines)}
                            showSatellite={showSatellite}
                            onToggleSatellite={() => handleToggleWithLoading('satellite', onToggleSatellite, showSatellite)}
                            showCapitals={showCapitals}
                            onToggleCapitals={() => handleToggleWithLoading('capitals', onToggleCapitals, showCapitals)}
                            showContinents={showContinents}
                            onToggleContinents={() => handleToggleWithLoading('continents', onToggleContinents, showContinents)}
                            showHeatmap={showHeatmap}
                            onToggleHeatmap={() => handleToggleWithLoading('heatmap', onToggleHeatmap, showHeatmap)}
                            loadingStates={loadingStates}
                        />
                    ) : (
                        <AdvancedTab
                            showAirports={showAirports}
                            onToggleAirports={onToggleAirports}
                            showTerrain={showTerrain}
                            onToggleTerrain={onToggleTerrain}
                            loadingStates={loadingStates}
                            setLoadingStates={setLoadingStates}
                        />
                    )}
                </div>
            </div>
        </>
    );
}