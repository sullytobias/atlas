import { useLoadingStore, useMapStore } from "../../store/loadingStore";
import React, { useMemo, useCallback } from "react";

enum AirportKey {
    Large = "large",
    Medium = "medium",
    Small = "small",
    Heliport = "heliport",
    Seaplane = "seaplane",
    Closed = "closed",
    Balloonport = "balloonport",
}

type AirportType = {
    key: AirportKey;
    label: string;
    color: string;
    size: number;
    icon: string;
    count: number;
};

const AIRPORT_TYPES: AirportType[] = [
    {
        key: AirportKey.Large,
        label: "Large Airport",
        color: "#ef9a84",
        size: 12,
        icon: "✈️",
        count: 955,
    },
    {
        key: AirportKey.Medium,
        label: "Medium Airport",
        color: "#f2c878",
        size: 9,
        icon: "🛬",
        count: 4241,
    },
    {
        key: AirportKey.Small,
        label: "Small Airport",
        color: "#88c7e8",
        size: 6,
        icon: "🛩️",
        count: 42540,
    },
    {
        key: AirportKey.Heliport,
        label: "Heliport",
        color: "#99d7ac",
        size: 5,
        icon: "🚁",
        count: 22436,
    },
    {
        key: AirportKey.Seaplane,
        label: "Seaplane Base",
        color: "#71cabf",
        size: 5,
        icon: "🛥️",
        count: 1248,
    },
    {
        key: AirportKey.Balloonport,
        label: "Balloonport",
        color: "#ef9ab2",
        size: 4,
        icon: "🎈",
        count: 60,
    },
    {
        key: AirportKey.Closed,
        label: "Closed",
        color: "#b3c3c8",
        size: 4,
        icon: "🚫",
        count: 12929,
    },
];

interface LayerButtonProps {
    label: string;
    description: string;
    icon: React.ReactNode;
    active: boolean;
    loading: boolean;
    onClick: () => void;
    color: string;
    ariaLabel: string;
}

const LayerButton: React.FC<LayerButtonProps> = ({
    label,
    description,
    icon,
    active,
    loading,
    onClick,
    color,
    ariaLabel,
}) => (
    <button
        className={`layer-item${active ? " active" : ""}${
            loading ? " loading" : ""
        }`}
        onClick={onClick}
        disabled={loading}
        style={{ "--layer-color": color } as React.CSSProperties}
        aria-pressed={active}
        aria-label={ariaLabel}
    >
        <span className="layer-icon">{icon}</span>
        <span className="layer-body">
            <span className="layer-text">
                <span className="layer-label">{label}</span>
                <span className="layer-description">{description}</span>
            </span>
            <span className={`layer-status${active ? " active" : ""}`}>
                {loading ? "Updating" : active ? "On" : "Off"}
            </span>
        </span>
        <div className={`layer-checkbox${active ? " active" : ""}`}>
            {loading ? (
                <span className="spinner"></span>
            ) : (
                active && <span className="checkmark">✓</span>
            )}
        </div>
    </button>
);

interface AirportCardProps {
    airport: AirportType;
    isActive: boolean;
    isLoading: boolean;
    onClick: () => void;
}

const AirportCard: React.FC<AirportCardProps> = ({
    airport,
    isActive,
    isLoading,
    onClick,
}) => (
    <button
        className={`filter-card${isActive ? " active" : ""}${
            isLoading ? " loading" : ""
        }`}
        onClick={onClick}
        disabled={isLoading}
        style={
            {
                "--card-color": airport.color,
            } as React.CSSProperties
        }
        aria-pressed={isActive}
        aria-label={airport.label}
    >
        <span className="card-icon">{airport.icon}</span>
        <div className="card-content">
            <div className={`card-title${isActive ? " active" : ""}`}>
                {airport.label}
            </div>
            <div className="card-meta">
                <span
                    className="card-indicator"
                    style={{
                        width: `${airport.size}px`,
                        height: `${airport.size}px`,
                        backgroundColor: airport.color,
                    }}
                />
                <span className="card-count">
                    {airport.count.toLocaleString()}
                </span>
            </div>
        </div>
        <div className={`card-checkbox${isActive ? " active" : ""}`}>
            {isLoading ? (
                <span className="spinner"></span>
            ) : (
                isActive && <span className="card-checkmark">✓</span>
            )}
        </div>
    </button>
);

export default function AdvancedTab() {
    const { loadingStates } = useLoadingStore();
    const {
        showAirports,
        showFlightRoutes,
        showCountryComparison,
        showDistanceMeasure,
        showStreetViewPicker,
        showTerrain,
        showGlobe,
        layerOpacities,
        toggleAirport,
        toggleFlightRoutes,
        toggleCountryComparison,
        toggleDistanceMeasure,
        toggleStreetViewPicker,
        toggleTerrain,
        toggleGlobe,
        setAllAirports,
        setLayerOpacity,
    } = useMapStore();

    const handleAirportToggle = useCallback(
        (type: AirportKey) => {
            toggleAirport(type);
        },
        [toggleAirport]
    );

    const handleSelectAllAirports = useCallback(() => {
        setAllAirports(true);
    }, [setAllAirports]);

    const handleClearAllAirports = useCallback(() => {
        setAllAirports(false);
    }, [setAllAirports]);

    const airportTypesMemo = useMemo(() => AIRPORT_TYPES, []);

    return (
        <div className="tab-content">
            {/* 3D Visualization */}
            <div className="section">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">3D View</h3>
                        <p className="section-description">
                            Perspective and projection controls for terrain-heavy exploration.
                        </p>
                    </div>
                </div>
                <div className="layer-list">
                    <LayerButton
                        label="3D Terrain"
                        description="Use elevation shading and terrain exaggeration."
                        icon={null}
                        active={showTerrain}
                        loading={!!loadingStates["terrain"]}
                        onClick={toggleTerrain}
                        color="#84d2aa"
                        ariaLabel="Toggle 3D Terrain"
                    />
                    <LayerButton
                        label="Globe Projection"
                        description="Wrap the map into a globe for world-scale browsing."
                        icon={null}
                        active={showGlobe}
                        loading={!!loadingStates["globe"]}
                        onClick={toggleGlobe}
                        color="#90bae9"
                        ariaLabel="Toggle Globe Projection"
                    />
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">Map Tools</h3>
                        <p className="section-description">
                            Interaction tools for measuring and external street-level views.
                        </p>
                    </div>
                </div>
                <div className="layer-list">
                    <LayerButton
                        label="Compare Countries"
                        description="Pick two countries from the map or search to compare them."
                        icon={null}
                        active={showCountryComparison}
                        loading={false}
                        onClick={toggleCountryComparison}
                        color="#efb29b"
                        ariaLabel="Toggle country comparison"
                    />
                    <LayerButton
                        label="Measure Distance"
                        description="Click points on the map to measure travel distance."
                        icon={null}
                        active={showDistanceMeasure}
                        loading={false}
                        onClick={toggleDistanceMeasure}
                        color="#6ebea8"
                        ariaLabel="Toggle distance measurement"
                    />
                    <LayerButton
                        label="Street View Picker"
                        description="Open Google Street View from a clicked location."
                        icon={null}
                        active={showStreetViewPicker}
                        loading={false}
                        onClick={toggleStreetViewPicker}
                        color="#88c0ea"
                        ariaLabel="Toggle Street View picker"
                    />
                </div>
            </div>

            {/* Airports */}
            <div className="section">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">Airports</h3>
                        <p className="section-description">
                            Filter airport markers by size and type.
                        </p>
                    </div>
                    <div className="section-controls">
                        <button
                            onClick={handleSelectAllAirports}
                            className="control-button primary"
                            aria-label="Show all airport types"
                            type="button"
                        >
                            All
                        </button>
                        <button
                            onClick={handleClearAllAirports}
                            className="control-button outline"
                            aria-label="Hide all airport types"
                            type="button"
                        >
                            None
                        </button>
                    </div>
                </div>
                <div
                    className="layer-item-wrapper"
                    style={
                        {
                            "--layer-color": "#a8d8f0",
                            marginBottom: "12px",
                        } as React.CSSProperties
                    }
                >
                    <LayerButton
                        label="Flight Routes"
                        description="Great-circle arcs between major airports worldwide."
                        icon={null}
                        active={showFlightRoutes}
                        loading={!!loadingStates["flightRoutes"]}
                        onClick={toggleFlightRoutes}
                        color="#a8d8f0"
                        ariaLabel="Toggle flight routes"
                    />
                    {showFlightRoutes && (
                        <div className="layer-opacity-control">
                            <span className="layer-opacity-label">Opacity</span>
                            <input
                                type="range"
                                className="layer-opacity-slider"
                                min={0.1}
                                max={1}
                                step={0.05}
                                value={layerOpacities.flightRoutes ?? 0.55}
                                onChange={(e) =>
                                    setLayerOpacity(
                                        "flightRoutes",
                                        parseFloat(e.target.value),
                                    )
                                }
                                aria-label="Flight routes opacity"
                            />
                            <span className="layer-opacity-value">
                                {Math.round(
                                    (layerOpacities.flightRoutes ?? 0.55) * 100,
                                )}
                                %
                            </span>
                        </div>
                    )}
                </div>
                <div className="card-grid">
                    {airportTypesMemo.map((airport) => (
                        <AirportCard
                            key={airport.key}
                            airport={airport}
                            isActive={!!showAirports[airport.key]}
                            isLoading={
                                !!loadingStates[`airport-${airport.key}`]
                            }
                            onClick={() => handleAirportToggle(airport.key)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
