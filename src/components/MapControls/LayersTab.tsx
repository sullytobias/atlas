import { useLoadingStore, useMapStore } from "../../store/loadingStore";

type Layer = {
    label: string;
    icon: string;
    checked: boolean;
    onChange: () => void;
    color: string;
    key: string;
};

export default function LayersTab() {
    const { loadingStates } = useLoadingStore();
    const {
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showHeatmap,
        toggleCoastlines,
        toggleSatellite,
        toggleCapitals,
        toggleContinents,
        toggleHeatmap,
    } = useMapStore();

    const layers: Layer[] = [
        {
            label: "Coastlines",
            icon: "🌊",
            checked: showCoastlines,
            onChange: toggleCoastlines,
            color: "#06b6d4",
            key: "coastlines",
        },
        {
            label: "Capitals",
            icon: "🏛️",
            checked: showCapitals,
            onChange: toggleCapitals,
            color: "#ef4444",
            key: "capitals",
        },
        {
            label: "Satellite",
            icon: "🛰️",
            checked: showSatellite,
            onChange: toggleSatellite,
            color: "#f59e0b",
            key: "satellite",
        },
        {
            label: "Population",
            icon: "🔥",
            checked: showHeatmap,
            onChange: toggleHeatmap,
            color: "#f97316",
            key: "heatmap",
        },
        {
            label: "Continents",
            icon: "🗺️",
            checked: showContinents,
            onChange: toggleContinents,
            color: "#10b981",
            key: "continents",
        },
    ];

    const handleSelectAll = () => {
        layers.forEach((layer) => {
            if (!layer.checked) {
                layer.onChange();
            }
        });
    };

    const handleClearAll = () => {
        layers.forEach((layer) => {
            if (layer.checked) {
                layer.onChange();
            }
        });
    };

    return (
        <div className="tab-content">
            <div className="section-header">
                <h3 className="section-title">🗺️ Map Layers</h3>
                <div className="section-controls">
                    <button
                        onClick={handleSelectAll}
                        className="control-button primary"
                    >
                        All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="control-button outline"
                    >
                        None
                    </button>
                </div>
            </div>

            <div className="layer-list">
                {layers.map((layer) => {
                    const isLoading = loadingStates[layer.key] || false;
                    return (
                        <button
                            key={layer.label}
                            className={`layer-item ${
                                layer.checked ? "active" : ""
                            } ${isLoading ? "loading" : ""}`}
                            onClick={layer.onChange}
                            disabled={isLoading}
                            style={
                                {
                                    "--layer-color": layer.color,
                                } as React.CSSProperties
                            }
                        >
                            <span className="layer-icon">{layer.icon}</span>
                            <span className="layer-label">{layer.label}</span>
                            <div
                                className={`layer-checkbox ${
                                    layer.checked ? "active" : ""
                                }`}
                            >
                                {isLoading ? (
                                    <span className="spinner"></span>
                                ) : (
                                    layer.checked && (
                                        <span className="checkmark">✓</span>
                                    )
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
