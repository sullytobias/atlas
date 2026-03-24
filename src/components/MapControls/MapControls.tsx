import React, { useState, useMemo, useCallback } from "react";
import LayersTab from "./LayersTab";
import AdvancedTab from "./AdvancedTab";
import { useMapStore } from "../../store/loadingStore";
import "./MapControls.css";

interface TabButtonProps {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    badge?: number;
    onClick: () => void;
    ariaLabel: string;
}

const TabButton: React.FC<TabButtonProps> = ({
    label,
    icon,
    active,
    badge,
    onClick,
    ariaLabel,
}) => (
    <button
        className={`tab-button${active ? " active" : ""}`}
        onClick={onClick}
        aria-selected={active}
        aria-label={ariaLabel}
        tabIndex={0}
    >
        <span className="tab-icon">{icon}</span>
        <span className="tab-label">{label}</span>
        {badge && badge > 0 && <span className="tab-badge">{badge}</span>}
    </button>
);

export default function MapControls() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layers" | "advanced">("layers");
    const {
        showCoastlines,
        showSatellite,
        showCapitals,
        showContinents,
        showDensity,
        showHeatmap,
        showAirports,
        showStreetViewPicker,
        showTerrain,
        showGlobe,
        theme,
        toggleTheme,
    } = useMapStore();

    const activeLayersCount = useMemo(
        () =>
            [
                showCoastlines,
                showSatellite,
                showCapitals,
                showContinents,
                showDensity,
                showHeatmap,
            ].filter(Boolean).length,
        [
            showCoastlines,
            showSatellite,
            showCapitals,
            showContinents,
            showDensity,
            showHeatmap,
        ]
    );

    const activeAirportsCount = useMemo(
        () => Object.values(showAirports).filter(Boolean).length,
        [showAirports]
    );
    const active3DCount = useMemo(
        () =>
            (showTerrain ? 1 : 0) +
            (showGlobe ? 1 : 0) +
            (showStreetViewPicker ? 1 : 0),
        [showTerrain, showGlobe, showStreetViewPicker]
    );
    const totalActiveCount = useMemo(
        () => activeLayersCount + activeAirportsCount + active3DCount,
        [activeLayersCount, activeAirportsCount, active3DCount]
    );

    const handleTriggerClick = useCallback(
        () => setIsOpen((prev) => !prev),
        []
    );
    const handleOverlayClick = useCallback(() => setIsOpen(false), []);
    const handleCloseClick = useCallback(() => setIsOpen(false), []);
    const handleLayersTabClick = useCallback(() => setActiveTab("layers"), []);
    const handleAdvancedTabClick = useCallback(
        () => setActiveTab("advanced"),
        []
    );

    React.useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <button
                className={`controls-trigger${isOpen ? " open" : " closed"}`}
                onClick={handleTriggerClick}
                aria-label={isOpen ? "Close map controls" : "Open map controls"}
                aria-expanded={isOpen}
            >
                <span className="controls-icon">{isOpen ? "✕" : "⚙"}</span>
                {totalActiveCount > 0 && !isOpen && (
                    <span className="controls-badge">{totalActiveCount}</span>
                )}
            </button>

            {isOpen && (
                <div
                    className="controls-overlay"
                    onClick={handleOverlayClick}
                    aria-label="Close map controls overlay"
                    tabIndex={-1}
                    role="presentation"
                />
            )}

            <div className={`controls-panel${isOpen ? " open" : " closed"}`}>
                <div className="controls-header">
                    <h2 className="controls-title">Map Controls</h2>
                    <div className="controls-actions">
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${
                                theme === "dark" ? "light" : "dark"
                            } theme`}
                        >
                            <span className="theme-toggle-track">
                                <span
                                    className={`theme-toggle-thumb theme-${theme}`}
                                />
                            </span>
                            <span className="theme-toggle-label">
                                {theme === "dark" ? "Dark" : "Light"}
                            </span>
                        </button>
                        <button
                            className="controls-close"
                            onClick={handleCloseClick}
                            aria-label="Close map controls"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="controls-tabs">
                    <TabButton
                        label="Layers"
                        icon={null}
                        active={activeTab === "layers"}
                        badge={activeLayersCount}
                        onClick={handleLayersTabClick}
                        ariaLabel="Show layers tab"
                    />
                    <TabButton
                        label="Advanced"
                        icon={null}
                        active={activeTab === "advanced"}
                        badge={activeAirportsCount + active3DCount}
                        onClick={handleAdvancedTabClick}
                        ariaLabel="Show advanced tab"
                    />
                </div>

                <div className="controls-content">
                    {activeTab === "layers" ? <LayersTab /> : <AdvancedTab />}
                </div>
            </div>
        </>
    );
}
