import { useLoadingStore, useMapStore } from "../../store/loadingStore";
import React, { useMemo, useCallback } from "react";

enum LayerKey {
    Coastlines = "coastlines",
    Capitals = "capitals",
    Satellite = "satellite",
    Heatmap = "heatmap",
    Continents = "continents",
}

type Layer = {
    label: string;
    icon: string;
    checked: boolean;
    onChange: () => void;
    color: string;
    key: LayerKey;
};

interface LayerButtonProps {
    label: string;
    icon: string;
    checked: boolean;
    loading: boolean;
    onClick: () => void;
    color: string;
    ariaLabel: string;
}

const LayerButton: React.FC<LayerButtonProps> = ({
    label,
    icon,
    checked,
    loading,
    onClick,
    color,
    ariaLabel,
}) => (
    <button
        className={`layer-item${checked ? " active" : ""}${
            loading ? " loading" : ""
        }`}
        onClick={onClick}
        disabled={loading}
        style={{ "--layer-color": color } as React.CSSProperties}
        aria-pressed={checked}
        aria-label={ariaLabel}
    >
        <span className="layer-icon">{icon}</span>
        <span className="layer-label">{label}</span>
        <div className={`layer-checkbox${checked ? " active" : ""}`}>
            {loading ? (
                <span className="spinner"></span>
            ) : (
                checked && <span className="checkmark">✓</span>
            )}
        </div>
    </button>
);

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

    const layers = useMemo<Layer[]>(
        () => [
            {
                label: "Coastlines",
                icon: "",
                checked: showCoastlines,
                onChange: toggleCoastlines,
                color: "#06b6d4",
                key: LayerKey.Coastlines,
            },
            {
                label: "Capitals",
                icon: "",
                checked: showCapitals,
                onChange: toggleCapitals,
                color: "#ef4444",
                key: LayerKey.Capitals,
            },
            {
                label: "Satellite",
                icon: "",
                checked: showSatellite,
                onChange: toggleSatellite,
                color: "#f59e0b",
                key: LayerKey.Satellite,
            },
            {
                label: "Population",
                icon: "",
                checked: showHeatmap,
                onChange: toggleHeatmap,
                color: "#f97316",
                key: LayerKey.Heatmap,
            },
            {
                label: "Continents",
                icon: "",
                checked: showContinents,
                onChange: toggleContinents,
                color: "#10b981",
                key: LayerKey.Continents,
            },
        ],
        [
            showCoastlines,
            showCapitals,
            showSatellite,
            showHeatmap,
            showContinents,
            toggleCoastlines,
            toggleCapitals,
            toggleSatellite,
            toggleHeatmap,
            toggleContinents,
        ]
    );

    const handleSelectAll = useCallback(() => {
        layers.forEach((layer) => {
            if (!layer.checked) {
                layer.onChange();
            }
        });
    }, [layers]);

    const handleClearAll = useCallback(() => {
        layers.forEach((layer) => {
            if (layer.checked) {
                layer.onChange();
            }
        });
    }, [layers]);

    return (
        <div className="tab-content">
            <div className="section-header">
                <h3 className="section-title">Map Layers</h3>
                <div className="section-controls">
                    <button
                        onClick={handleSelectAll}
                        className="control-button primary"
                        aria-label="Show all layers"
                    >
                        All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="control-button outline"
                        aria-label="Hide all layers"
                    >
                        None
                    </button>
                </div>
            </div>
            <div className="layer-list">
                {layers.map((layer) => (
                    <LayerButton
                        key={layer.key}
                        label={layer.label}
                        icon={layer.icon}
                        checked={layer.checked}
                        loading={!!loadingStates[layer.key]}
                        onClick={layer.onChange}
                        color={layer.color}
                        ariaLabel={`Toggle ${layer.label}`}
                    />
                ))}
            </div>
        </div>
    );
}
