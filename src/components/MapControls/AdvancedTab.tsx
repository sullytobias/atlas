import { useLoadingStore, useMapStore } from "../../store/loadingStore";

type AirportType = {
    key:
        | "large"
        | "medium"
        | "small"
        | "heliport"
        | "seaplane"
        | "closed"
        | "balloonport";
    label: string;
    color: string;
    size: number;
    icon: string;
    count: number;
};

export default function AdvancedTab() {
    const { loadingStates } = useLoadingStore();
    const {
        showAirports,
        showTerrain,
        showGlobe,
        toggleAirport,
        toggleTerrain,
        toggleGlobe,
        setAllAirports,
    } = useMapStore();

    const AIRPORT_TYPES: AirportType[] = [
        {
            key: "large",
            label: "Large Airport",
            color: "#e74c3c",
            size: 12,
            icon: "✈️",
            count: 955,
        },
        {
            key: "medium",
            label: "Medium Airport",
            color: "#f39c12",
            size: 9,
            icon: "🛬",
            count: 4241,
        },
        {
            key: "small",
            label: "Small Airport",
            color: "#3498db",
            size: 6,
            icon: "🛩️",
            count: 42540,
        },
        {
            key: "heliport",
            label: "Heliport",
            color: "#9b59b6",
            size: 5,
            icon: "🚁",
            count: 22436,
        },
        {
            key: "seaplane",
            label: "Seaplane Base",
            color: "#1abc9c",
            size: 5,
            icon: "🛥️",
            count: 1248,
        },
        {
            key: "balloonport",
            label: "Balloonport",
            color: "#e91e63",
            size: 4,
            icon: "🎈",
            count: 60,
        },
        {
            key: "closed",
            label: "Closed",
            color: "#95a5a6",
            size: 4,
            icon: "🚫",
            count: 12929,
        },
    ];

    const handleAirportToggle = (type: keyof typeof showAirports) => {
        toggleAirport(type);
    };

    const handleSelectAllAirports = () => {
        setAllAirports(true);
    };

    const handleClearAllAirports = () => {
        setAllAirports(false);
    };

    const hexToRgba = (hex: string, opacity: number = 0.2) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return (
        <div className="tab-content">
            {/* 3D Visualization */}
            <div className="section">
                <div className="section-header">
                    <h3 className="section-title">🌍 3D Visualization</h3>
                </div>

                <div className="layer-list">
                    <button
                        className={`layer-item ${showTerrain ? "active" : ""} ${
                            loadingStates["terrain"] ? "loading" : ""
                        }`}
                        onClick={toggleTerrain}
                        disabled={loadingStates["terrain"]}
                        style={
                            {
                                "--layer-color": "#10b981",
                            } as React.CSSProperties
                        }
                    >
                        <span className="layer-icon">⛰️</span>
                        <span className="layer-label">3D Terrain</span>
                        <div
                            className={`layer-checkbox ${
                                showTerrain ? "active" : ""
                            }`}
                        >
                            {loadingStates["terrain"] ? (
                                <span className="spinner"></span>
                            ) : (
                                showTerrain && (
                                    <span className="checkmark">✓</span>
                                )
                            )}
                        </div>
                    </button>
                    <button
                        className={`layer-item ${showGlobe ? "active" : ""} ${
                            loadingStates["globe"] ? "loading" : ""
                        }`}
                        onClick={toggleGlobe}
                        disabled={loadingStates["globe"]}
                        style={
                            {
                                "--layer-color": "#3b82f6",
                            } as React.CSSProperties
                        }
                    >
                        <span className="layer-icon">
                            {showGlobe ? "🗺️" : "🌍"}
                        </span>
                        <span className="layer-label">Globe Projection</span>
                        <div
                            className={`layer-checkbox ${
                                showGlobe ? "active" : ""
                            }`}
                        >
                            {loadingStates["globe"] ? (
                                <span className="spinner"></span>
                            ) : (
                                showGlobe && (
                                    <span className="checkmark">✓</span>
                                )
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Airports */}
            <div className="section">
                <div className="section-header">
                    <h3 className="section-title">✈️ Airports</h3>
                    <div className="section-controls">
                        <button
                            onClick={handleSelectAllAirports}
                            className="control-button primary"
                        >
                            All
                        </button>
                        <button
                            onClick={handleClearAllAirports}
                            className="control-button outline"
                        >
                            None
                        </button>
                    </div>
                </div>

                <div className="card-grid">
                    {AIRPORT_TYPES.map((airport) => {
                        const isActive = showAirports[airport.key];
                        const isLoading = loadingStates
                            ? loadingStates[`airport-${airport.key}`] || false
                            : false;
                        return (
                            <button
                                key={airport.key}
                                className={`filter-card ${
                                    isActive ? "active" : ""
                                } ${isLoading ? "loading" : ""}`}
                                onClick={() => handleAirportToggle(airport.key)}
                                disabled={isLoading}
                                style={
                                    {
                                        "--card-color": airport.color,
                                        "--card-shadow": hexToRgba(
                                            airport.color,
                                            0.2
                                        ),
                                    } as React.CSSProperties
                                }
                            >
                                <span className="card-icon">
                                    {airport.icon}
                                </span>
                                <div className="card-content">
                                    <div
                                        className={`card-title ${
                                            isActive ? "active" : ""
                                        }`}
                                    >
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
                                <div
                                    className={`card-checkbox ${
                                        isActive ? "active" : ""
                                    }`}
                                >
                                    {isLoading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        isActive && (
                                            <span className="card-checkmark">
                                                ✓
                                            </span>
                                        )
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
