import { useState } from "react";
import "./AdvancedFilters.css";

type Props = {
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
};

type AirportType = {
    key: keyof Props["showAirports"];
    label: string;
    color: string;
    size: number;
    icon: string;
    count: number;
};

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

export default function AdvancedFilters({
    showAirports,
    onToggleAirports,

    showTerrain = false,
    onToggleTerrain,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAirportToggle = (type: keyof typeof showAirports) => {
        onToggleAirports({
            ...showAirports,
            [type]: !showAirports[type],
        });
    };

    const activeCount =
        Object.values(showAirports).filter(Boolean).length +
        (showTerrain ? 1 : 0);

    const handleSelectAll3D = () => {
        if (onToggleTerrain) onToggleTerrain(true);
    };

    const handleClearAll3D = () => {
        if (onToggleTerrain) onToggleTerrain(false);
    };

    const handleSelectAllAirports = () => {
        onToggleAirports({
            large: true,
            medium: true,
            small: true,
            heliport: true,
            seaplane: true,
            closed: true,
            balloonport: true,
        });
    };

    const handleClearAllAirports = () => {
        onToggleAirports({
            large: false,
            medium: false,
            small: false,
            heliport: false,
            seaplane: false,
            closed: false,
            balloonport: false,
        });
    };

    const handleClearEverything = () => {
        handleClearAll3D();
        handleClearAllAirports();
    };

    return (
        <>
            <button className="fab-button" onClick={() => setIsOpen(!isOpen)}>
                <div className="fab-icon">
                    <span>{isOpen ? "✕" : "⚙️"}</span>
                    {activeCount > 0 && !isOpen && (
                        <span className="badge">{activeCount}</span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div
                    className="drawer-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`drawer ${isOpen ? "open" : "closed"}`}>
                <div
                    className="drawer-handle"
                    onClick={() => setIsOpen(false)}
                />

                <div className="drawer-content">
                    <h2 className="drawer-title">Advanced Filters</h2>
                    <p className="drawer-subtitle">
                        Customize what you see on the map
                    </p>

                    {/* 3D Visualization Section */}
                    {onToggleTerrain && (
                        <div className="section">
                            <div className="section-header">
                                <h3 className="section-title">
                                    🌍 3D Visualization
                                </h3>
                                <div className="section-controls">
                                    <button
                                        onClick={handleSelectAll3D}
                                        className="control-button secondary"
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={handleClearAll3D}
                                        className="control-button outline"
                                    >
                                        None
                                    </button>
                                </div>
                            </div>

                            <div className="card-grid">                        
                                {onToggleTerrain && (
                                    <button
                                        className={`filter-card ${
                                            showTerrain ? "active" : ""
                                        }`}
                                        onClick={() =>
                                            onToggleTerrain(!showTerrain)
                                        }
                                        style={
                                            {
                                                "--card-color": "#2ecc71",
                                                "--card-color-rgb":
                                                    "46, 204, 113",
                                            } as React.CSSProperties
                                        }
                                    >
                                        <span className="card-icon">⛰️</span>
                                        <div className="card-content">
                                            <div
                                                className={`card-title ${
                                                    showTerrain ? "active" : ""
                                                }`}
                                            >
                                                3D Terrain Relief
                                            </div>
                                            <div className="card-description">
                                                View mountains and elevation in
                                                3D
                                            </div>
                                        </div>
                                        <div
                                            className={`card-checkbox ${
                                                showTerrain ? "active" : ""
                                            }`}
                                        >
                                            {showTerrain && (
                                                <span className="card-checkmark">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Airports Section */}
                    <div className="section">
                        <div className="section-header">
                            <h3 className="section-title">
                                ✈️ Airports & Aviation Facilities
                            </h3>
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
                                return (
                                    <button
                                        key={airport.key}
                                        className={`filter-card ${
                                            isActive ? "active" : ""
                                        }`}
                                        onClick={() =>
                                            handleAirportToggle(airport.key)
                                        }
                                        style={
                                            {
                                                "--card-color": airport.color,
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
                                                        backgroundColor:
                                                            airport.color,
                                                    }}
                                                />
                                                <span className="card-count">
                                                    {airport.count.toLocaleString()}{" "}
                                                    facilities
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`card-checkbox ${
                                                isActive ? "active" : ""
                                            }`}
                                        >
                                            {isActive && (
                                                <span className="card-checkmark">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Global Clear All Button */}
                    <div className="clear-all-section">
                        <button
                            onClick={handleClearEverything}
                            className="clear-all-button"
                        >
                            <span className="clear-all-icon">🗑️</span>
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}