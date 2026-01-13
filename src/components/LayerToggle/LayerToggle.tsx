import { useState } from "react";
import "./LayerToggle.css";

type Props = {
    showCoastlines: boolean;
    onToggleCoastlines: (show: boolean) => void;
    showSatellite: boolean;
    onToggleSatellite: (show: boolean) => void;
    showCapitals: boolean;
    onToggleCapitals: (show: boolean) => void;
    showContinents: boolean;
    onToggleContinents: (show: boolean) => void;
    showHeatmap: boolean;
    onToggleHeatmap: (show: boolean) => void;
};

type LayerItem = {
    label: string;
    icon: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    color: string;
};

export default function LayerToggles({
    showCoastlines,
    onToggleCoastlines,
    showSatellite,
    onToggleSatellite,
    showCapitals,
    onToggleCapitals,
    showContinents,
    onToggleContinents,
    showHeatmap,
    onToggleHeatmap,
}: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const layers: LayerItem[] = [
        {
            label: "Coastlines",
            icon: "🌊",
            checked: showCoastlines,
            onChange: onToggleCoastlines,
            color: "#198EC8",
        },
        {
            label: "Satellite",
            icon: "🛰️",
            checked: showSatellite,
            onChange: onToggleSatellite,
            color: "#8B4513",
        },
        {
            label: "Capitals",
            icon: "🏛️",
            checked: showCapitals,
            onChange: onToggleCapitals,
            color: "#DC143C",
        },
        {
            label: "Continents",
            icon: "🗺️",
            checked: showContinents,
            onChange: onToggleContinents,
            color: "#9370DB",
        },
        {
            label: "Population",
            icon: "🔥",
            checked: showHeatmap,
            onChange: onToggleHeatmap,
            color: "#FF4500",
        },
    ];

    return (
        <div className="layer-toggle-container">
            {isExpanded && (
                <div
                    className="layer-backdrop"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {isExpanded &&
                layers.map((layer, index) => {
                    return (
                        <button
                            key={layer.label}
                            className={`layer-bubble ${
                                layer.checked ? "active" : "inactive"
                            }`}
                            data-label={layer.label}
                            onClick={() => layer.onChange(!layer.checked)}
                            style={
                                {
                                    top: `${(index + 1.2) * 64}px`,
                                    animation: `slideIn 0.3s ease-out ${
                                        index * 0.05
                                    }s forwards`,
                                    "--layer-color": layer.color,
                                    "--layer-shadow": `${layer.color}60`,
                                    "--layer-shadow-hover": `${layer.color}70`,
                                } as React.CSSProperties
                            }
                        >
                            <span>{layer.icon}</span>
                        </button>
                    );
                })}

            <button
                className={`main-toggle-button ${
                    isExpanded ? "expanded" : "collapsed"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="main-toggle-icon">
                    {isExpanded ? "✕" : "⚙️"}
                </span>
            </button>
        </div>
    );
}
