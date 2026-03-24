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
        color: "#e74c3c",
        size: 12,
        icon: "✈️",
        count: 955,
    },
    {
        key: AirportKey.Medium,
        label: "Medium Airport",
        color: "#f39c12",
        size: 9,
        icon: "🛬",
        count: 4241,
    },
    {
        key: AirportKey.Small,
        label: "Small Airport",
        color: "#3498db",
        size: 6,
        icon: "🛩️",
        count: 42540,
    },
    {
        key: AirportKey.Heliport,
        label: "Heliport",
        color: "#9b59b6",
        size: 5,
        icon: "🚁",
        count: 22436,
    },
    {
        key: AirportKey.Seaplane,
        label: "Seaplane Base",
        color: "#1abc9c",
        size: 5,
        icon: "🛥️",
        count: 1248,
    },
    {
        key: AirportKey.Balloonport,
        label: "Balloonport",
        color: "#e91e63",
        size: 4,
        icon: "🎈",
        count: 60,
    },
    {
        key: AirportKey.Closed,
        label: "Closed",
        color: "#95a5a6",
        size: 4,
        icon: "🚫",
        count: 12929,
    },
];

interface LayerButtonProps {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    loading: boolean;
    onClick: () => void;
    color: string;
    ariaLabel: string;
}

const LayerButton: React.FC<LayerButtonProps> = ({
    label,
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
        <span className="layer-label">{label}</span>
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
        showStreetViewPicker,
        showTerrain,
        showGlobe,
        toggleAirport,
        toggleStreetViewPicker,
        toggleTerrain,
        toggleGlobe,
        setAllAirports,
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
                    <h3 className="section-title">3D View</h3>
                </div>
                <div className="layer-list">
                    <LayerButton
                        label="3D Terrain"
                        icon={null}
                        active={showTerrain}
                        loading={!!loadingStates["terrain"]}
                        onClick={toggleTerrain}
                        color="#10b981"
                        ariaLabel="Toggle 3D Terrain"
                    />
                    <LayerButton
                        label="Globe Projection"
                        icon={null}
                        active={showGlobe}
                        loading={!!loadingStates["globe"]}
                        onClick={toggleGlobe}
                        color="#3b82f6"
                        ariaLabel="Toggle Globe Projection"
                    />
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h3 className="section-title">Map Tools</h3>
                </div>
                <div className="layer-list">
                    <LayerButton
                        label="Street View Picker"
                        icon={null}
                        active={showStreetViewPicker}
                        loading={false}
                        onClick={toggleStreetViewPicker}
                        color="#2563eb"
                        ariaLabel="Toggle Street View picker"
                    />
                </div>
            </div>

            {/* Airports */}
            <div className="section">
                <div className="section-header">
                    <h3 className="section-title">Airports</h3>
                    <div className="section-controls">
                        <button
                            onClick={handleSelectAllAirports}
                            className="control-button primary"
                            aria-label="Show all airport types"
                        >
                            All
                        </button>
                        <button
                            onClick={handleClearAllAirports}
                            className="control-button outline"
                            aria-label="Hide all airport types"
                        >
                            None
                        </button>
                    </div>
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
