import { useLoadingStore, useMapStore } from "../../store/loadingStore";
import React, { useMemo, useCallback } from "react";

enum LayerKey {
    Coastlines = "coastlines",
    Capitals = "capitals",
    Satellite = "satellite",
    Density = "density",
    Heatmap = "heatmap",
    Continents = "continents",
    Timezones = "timezones",
}

type Layer = {
    label: string;
    description: string;
    icon: string;
    checked: boolean;
    onChange: () => void;
    color: string;
    key: LayerKey;
};

interface LayerButtonProps {
    label: string;
    description: string;
    icon: string;
    checked: boolean;
    loading: boolean;
    onClick: () => void;
    color: string;
    ariaLabel: string;
}

const LayerButton: React.FC<LayerButtonProps> = ({
    label,
    description,
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
        <span className="layer-body">
            <span className="layer-text">
                <span className="layer-label">{label}</span>
                <span className="layer-description">{description}</span>
            </span>
            <span className={`layer-status${checked ? " active" : ""}`}>
                {loading ? "Updating" : checked ? "On" : "Off"}
            </span>
        </span>
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
        showTimezones,
        showDensity,
        showHeatmap,
        toggleCoastlines,
        toggleSatellite,
        toggleCapitals,
        toggleContinents,
        toggleTimezones,
        toggleDensity,
        toggleHeatmap,
    } = useMapStore();

    const layers = useMemo<Layer[]>(
        () => [
            {
                label: "Coastlines",
                description: "Add country boundary outlines for quick shape reading.",
                icon: "",
                checked: showCoastlines,
                onChange: toggleCoastlines,
                color: "#7ccddd",
                key: LayerKey.Coastlines,
            },
            {
                label: "Capitals",
                description: "Show capital markers and labels on the map.",
                icon: "",
                checked: showCapitals,
                onChange: toggleCapitals,
                color: "#ef9a84",
                key: LayerKey.Capitals,
            },
            {
                label: "Satellite",
                description: "Switch the base map from streets to imagery.",
                icon: "",
                checked: showSatellite,
                onChange: toggleSatellite,
                color: "#f2cf84",
                key: LayerKey.Satellite,
            },
            {
                label: "Density",
                description: "Color countries by population density.",
                icon: "",
                checked: showDensity,
                onChange: toggleDensity,
                color: "#84d2aa",
                key: LayerKey.Density,
            },
            {
                label: "Population",
                description: "Color countries by total population.",
                icon: "",
                checked: showHeatmap,
                onChange: toggleHeatmap,
                color: "#f0ac7e",
                key: LayerKey.Heatmap,
            },
            {
                label: "Continents",
                description: "Shade continent areas for region-level context.",
                icon: "",
                checked: showContinents,
                onChange: toggleContinents,
                color: "#9adfcf",
                key: LayerKey.Continents,
            },
            {
                label: "Timezones",
                description: "Overlay simplified UTC bands and labels.",
                icon: "",
                checked: showTimezones,
                onChange: toggleTimezones,
                color: "#7ecfda",
                key: LayerKey.Timezones,
            },
        ],
        [
            showCoastlines,
            showCapitals,
            showSatellite,
            showDensity,
            showHeatmap,
            showContinents,
            showTimezones,
            toggleCoastlines,
            toggleCapitals,
            toggleSatellite,
            toggleDensity,
            toggleHeatmap,
            toggleContinents,
            toggleTimezones,
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
                <div>
                    <h3 className="section-title">Map Layers</h3>
                    <p className="section-description">
                        Core overlays for reading geography, population, and time.
                    </p>
                </div>
                <div className="section-controls">
                    <button
                        onClick={handleSelectAll}
                        className="control-button primary"
                        aria-label="Show all layers"
                        type="button"
                    >
                        All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="control-button outline"
                        aria-label="Hide all layers"
                        type="button"
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
                        description={layer.description}
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
