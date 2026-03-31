import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
    controlsId: string;
    tabId: string;
}

const TabButton: React.FC<TabButtonProps> = ({
    label,
    icon,
    active,
    badge,
    onClick,
    ariaLabel,
    controlsId,
    tabId,
}) => (
    <button
        className={`tab-button${active ? " active" : ""}`}
        onClick={onClick}
        id={tabId}
        role="tab"
        aria-selected={active}
        aria-controls={controlsId}
        aria-label={ariaLabel}
        tabIndex={0}
        type="button"
    >
        <span className="tab-icon">{icon}</span>
        <span className="tab-label">{label}</span>
        {badge && badge > 0 && <span className="tab-badge">{badge}</span>}
    </button>
);

export default function MapControls() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"layers" | "advanced">("layers");
    const contentRef = useRef<HTMLDivElement | null>(null);
    const {
        showCoastlines,
        showNightLights,
        showWeather,
        showSatellite,
        showCapitals,
        showContinents,
        showTimezones,
        showDensity,
        showHeatmap,
        showAirports,
        showCountryComparison,
        showDistanceMeasure,
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
                showNightLights,
                showWeather,
                showSatellite,
                showCapitals,
                showContinents,
                showTimezones,
                showDensity,
                showHeatmap,
            ].filter(Boolean).length,
        [
            showCoastlines,
            showNightLights,
            showWeather,
            showSatellite,
            showCapitals,
            showContinents,
            showTimezones,
            showDensity,
            showHeatmap,
        ],
    );

    const activeAirportsCount = useMemo(
        () => Object.values(showAirports).filter(Boolean).length,
        [showAirports]
    );
    const active3DCount = useMemo(
        () =>
            (showTerrain ? 1 : 0) +
            (showGlobe ? 1 : 0) +
            (showCountryComparison ? 1 : 0) +
            (showDistanceMeasure ? 1 : 0) +
            (showStreetViewPicker ? 1 : 0),
        [
            showTerrain,
            showGlobe,
            showCountryComparison,
            showDistanceMeasure,
            showStreetViewPicker,
        ],
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

    useEffect(() => {
        if (!isOpen) return;

        setActiveTab("layers");
        contentRef.current?.scrollTo({ top: 0, behavior: "auto" });

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
                    <div className="controls-heading">
                        <h2 className="controls-title">Map Controls</h2>
                        <p className="controls-subtitle">
                            Turn layers and tools on only when you need them.
                        </p>
                    </div>
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
                <div className="controls-summary" aria-label="Active settings">
                    <span className="summary-pill">
                        {activeLayersCount} layer
                        {activeLayersCount === 1 ? "" : "s"}
                    </span>
                    <span className="summary-pill">
                        {activeAirportsCount} airport filter
                        {activeAirportsCount === 1 ? "" : "s"}
                    </span>
                    <span className="summary-pill">
                        {active3DCount} advanced tool
                        {active3DCount === 1 ? "" : "s"}
                    </span>
                </div>

                <div className="controls-tabs" role="tablist" aria-label="Settings tabs">
                    <TabButton
                        label="Layers"
                        icon={null}
                        active={activeTab === "layers"}
                        badge={activeLayersCount}
                        onClick={handleLayersTabClick}
                        ariaLabel="Show layers tab"
                        controlsId="layers-panel"
                        tabId="layers-tab"
                    />
                    <TabButton
                        label="Advanced"
                        icon={null}
                        active={activeTab === "advanced"}
                        badge={activeAirportsCount + active3DCount}
                        onClick={handleAdvancedTabClick}
                        ariaLabel="Show advanced tab"
                        controlsId="advanced-panel"
                        tabId="advanced-tab"
                    />
                </div>

                <div
                    className="controls-content"
                    ref={contentRef}
                    role="tabpanel"
                    id={activeTab === "layers" ? "layers-panel" : "advanced-panel"}
                    aria-labelledby={
                        activeTab === "layers" ? "layers-tab" : "advanced-tab"
                    }
                >
                    {activeTab === "layers" ? <LayersTab /> : <AdvancedTab />}
                </div>
            </div>
        </>
    );
}
