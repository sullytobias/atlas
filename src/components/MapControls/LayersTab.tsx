import { useLoadingStore, useMapStore } from "../../store/loadingStore";
import React, { useMemo, useCallback, useState } from "react";

enum LayerKey {
    Coastlines = "coastlines",
    Capitals = "capitals",
    Satellite = "satellite",
    Density = "density",
    Gdp = "gdp",
    Heatmap = "heatmap",
    Continents = "continents",
    Timezones = "timezones",
    NightLights = "nightLights",
    Weather = "weather",
    Earthquakes = "earthquakes",
    Volcanoes = "volcanoes",
}

type CategoryKey = "base" | "data" | "nature" | "geo";

const CATEGORIES: {
    key: CategoryKey;
    label: string;
    layers: LayerKey[];
}[] = [
    {
        key: "base",
        label: "Base",
        layers: [LayerKey.Satellite, LayerKey.Coastlines, LayerKey.NightLights],
    },
    {
        key: "data",
        label: "Data",
        layers: [
            LayerKey.Heatmap,
            LayerKey.Density,
            LayerKey.Gdp,
            LayerKey.Continents,
        ],
    },
    {
        key: "nature",
        label: "Nature",
        layers: [LayerKey.Weather, LayerKey.Earthquakes, LayerKey.Volcanoes],
    },
    {
        key: "geo",
        label: "Geo",
        layers: [LayerKey.Timezones, LayerKey.Capitals],
    },
];

type Layer = {
    label: string;
    description: string;
    icon: string;
    checked: boolean;
    onChange: () => void;
    color: string;
    key: LayerKey;
    opacity?: number;
    onOpacityChange?: (value: number) => void;
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
    opacity?: number;
    onOpacityChange?: (value: number) => void;
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
    opacity,
    onOpacityChange,
}) => {
    const showSlider = checked && opacity !== undefined && onOpacityChange !== undefined;
    return (
        <div
            className="layer-item-wrapper"
            style={{ "--layer-color": color } as React.CSSProperties}
        >
            <button
                className={`layer-item${checked ? " active" : ""}${
                    loading ? " loading" : ""
                }${showSlider ? " has-slider" : ""}`}
                onClick={onClick}
                disabled={loading}
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
            {showSlider && (
                <div className="layer-opacity-control">
                    <span className="layer-opacity-label">Opacity</span>
                    <input
                        type="range"
                        className="layer-opacity-slider"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={opacity}
                        onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                        aria-label={`${label} opacity`}
                    />
                    <span className="layer-opacity-value">
                        {Math.round(opacity * 100)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default function LayersTab() {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>("base");
    const { loadingStates } = useLoadingStore();
    const {
        showCoastlines,
        showNightLights,
        showSatellite,
        showCapitals,
        showContinents,
        showTimezones,
        showDensity,
        showGdp,
        showHeatmap,
        showWeather,
        showEarthquakes,
        showVolcanoes,
        layerOpacities,
        toggleCoastlines,
        toggleNightLights,
        toggleSatellite,
        toggleCapitals,
        toggleContinents,
        toggleTimezones,
        toggleDensity,
        toggleGdp,
        toggleHeatmap,
        toggleWeather,
        toggleEarthquakes,
        toggleVolcanoes,
        setLayerOpacity,
    } = useMapStore();

    const allLayers = useMemo<Layer[]>(
        () => [
            {
                label: "Satellite",
                description: "Switch the base map from streets to imagery.",
                icon: "",
                checked: showSatellite,
                onChange: toggleSatellite,
                color: "#f2cf84",
                key: LayerKey.Satellite,
                opacity: layerOpacities.satellite,
                onOpacityChange: (v) => setLayerOpacity("satellite", v),
            },
            {
                label: "Coastlines",
                description: "Add country boundary outlines for quick shape reading.",
                icon: "",
                checked: showCoastlines,
                onChange: toggleCoastlines,
                color: "#7ccddd",
                key: LayerKey.Coastlines,
                opacity: layerOpacities.coastlines,
                onOpacityChange: (v) => setLayerOpacity("coastlines", v),
            },
            {
                label: "Night Lights",
                description: "NASA Black Marble — Earth lit up after dark.",
                icon: "",
                checked: showNightLights,
                onChange: toggleNightLights,
                color: "#f5c842",
                key: LayerKey.NightLights,
                opacity: layerOpacities.nightLights,
                onOpacityChange: (v) => setLayerOpacity("nightLights", v),
            },
            {
                label: "Population",
                description: "Color countries by total population.",
                icon: "",
                checked: showHeatmap,
                onChange: toggleHeatmap,
                color: "#f0ac7e",
                key: LayerKey.Heatmap,
                opacity: layerOpacities.heatmap,
                onOpacityChange: (v) => setLayerOpacity("heatmap", v),
            },
            {
                label: "Density",
                description: "Color countries by population density.",
                icon: "",
                checked: showDensity,
                onChange: toggleDensity,
                color: "#84d2aa",
                key: LayerKey.Density,
                opacity: layerOpacities.density,
                onOpacityChange: (v) => setLayerOpacity("density", v),
            },
            {
                label: "GDP",
                description: "Color countries by gross domestic product.",
                icon: "",
                checked: showGdp,
                onChange: toggleGdp,
                color: "#fbbf24",
                key: LayerKey.Gdp,
                opacity: layerOpacities.gdp,
                onOpacityChange: (v) => setLayerOpacity("gdp", v),
            },
            {
                label: "Continents",
                description: "Shade continent areas for region-level context.",
                icon: "",
                checked: showContinents,
                onChange: toggleContinents,
                color: "#9adfcf",
                key: LayerKey.Continents,
                opacity: layerOpacities.continents,
                onOpacityChange: (v) => setLayerOpacity("continents", v),
            },
            {
                label: "Weather Radar",
                description: "Live precipitation radar from RainViewer.",
                icon: "",
                checked: showWeather,
                onChange: toggleWeather,
                color: "#60a5fa",
                key: LayerKey.Weather,
                opacity: layerOpacities.weather,
                onOpacityChange: (v) => setLayerOpacity("weather", v),
            },
            {
                label: "Earthquakes",
                description: "Recent M2.5+ earthquakes from the USGS live feed.",
                icon: "",
                checked: showEarthquakes,
                onChange: toggleEarthquakes,
                color: "#f97316",
                key: LayerKey.Earthquakes,
                opacity: layerOpacities.earthquakes,
                onOpacityChange: (v) => setLayerOpacity("earthquakes", v),
            },
            {
                label: "Volcanoes",
                description: "Major active and historically significant volcanoes.",
                icon: "",
                checked: showVolcanoes,
                onChange: toggleVolcanoes,
                color: "#ef4444",
                key: LayerKey.Volcanoes,
                opacity: layerOpacities.volcanoes,
                onOpacityChange: (v) => setLayerOpacity("volcanoes", v),
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
            {
                label: "Capitals",
                description: "Show capital markers and labels on the map.",
                icon: "",
                checked: showCapitals,
                onChange: toggleCapitals,
                color: "#ef9a84",
                key: LayerKey.Capitals,
            },
        ],
        [
            showCoastlines,
            showNightLights,
            showWeather,
            showEarthquakes,
            showVolcanoes,
            showCapitals,
            showSatellite,
            showDensity,
            showGdp,
            showHeatmap,
            showContinents,
            showTimezones,
            layerOpacities,
            toggleCoastlines,
            toggleNightLights,
            toggleWeather,
            toggleEarthquakes,
            toggleVolcanoes,
            toggleCapitals,
            toggleSatellite,
            toggleDensity,
            toggleGdp,
            toggleHeatmap,
            toggleContinents,
            toggleTimezones,
            setLayerOpacity,
        ],
    );

    const layerByKey = useMemo(
        () => new Map(allLayers.map((l) => [l.key, l])),
        [allLayers],
    );

    const visibleLayers = useMemo(() => {
        const cat = CATEGORIES.find((c) => c.key === activeCategory);
        return (cat?.layers ?? []).map((k) => layerByKey.get(k)).filter(Boolean) as Layer[];
    }, [activeCategory, layerByKey]);

    const categoryActiveCount = useCallback(
        (cat: CategoryKey) => {
            const c = CATEGORIES.find((c) => c.key === cat);
            return (c?.layers ?? []).filter((k) => layerByKey.get(k)?.checked).length;
        },
        [layerByKey],
    );

    const handleSelectAll = useCallback(() => {
        visibleLayers.forEach((layer) => {
            if (!layer.checked) layer.onChange();
        });
    }, [visibleLayers]);

    const handleClearAll = useCallback(() => {
        visibleLayers.forEach((layer) => {
            if (layer.checked) layer.onChange();
        });
    }, [visibleLayers]);

    return (
        <div className="tab-content">
            <div className="layer-subtabs">
                {CATEGORIES.map((cat) => {
                    const count = categoryActiveCount(cat.key);
                    return (
                        <button
                            key={cat.key}
                            type="button"
                            className={`layer-subtab${activeCategory === cat.key ? " active" : ""}`}
                            onClick={() => setActiveCategory(cat.key)}
                            aria-pressed={activeCategory === cat.key}
                        >
                            {cat.label}
                            {count > 0 && (
                                <span className="layer-subtab-badge">{count}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="section-header">
                <div className="section-controls">
                    <button
                        onClick={handleSelectAll}
                        className="control-button primary"
                        aria-label="Show all layers in category"
                        type="button"
                    >
                        All
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="control-button outline"
                        aria-label="Hide all layers in category"
                        type="button"
                    >
                        None
                    </button>
                </div>
            </div>

            <div className="layer-list">
                {visibleLayers.map((layer) => (
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
                        opacity={layer.opacity}
                        onOpacityChange={layer.onOpacityChange}
                    />
                ))}
            </div>
        </div>
    );
}
