import { useState } from "react";

type Props = {
    showCoastlines: boolean;
    onToggleCoastlines: (value: boolean) => void;
    showSatellite: boolean;
    onToggleSatellite: (value: boolean) => void;
    showCapitals: boolean;
    onToggleCapitals: (value: boolean) => void;
    showContinents: boolean;
    onToggleContinents: (value: boolean) => void;
    showHeatmap: boolean;
    onToggleHeatmap: (value: boolean) => void;
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
        <div
            style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    
                    .layer-orb {
                        position: relative;
                    }
                    
                    .layer-orb::before {
                        content: attr(data-label);
                        position: absolute;
                        left: 58px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.85);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 8px;
                        font-size: 13px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s ease;
                        font-weight: 500;
                        backdrop-filter: blur(10px);
                    }
                    
                    .layer-orb:hover::before {
                        opacity: 1;
                    }
                `}
            </style>

            {layers.map((layer, index) => (
                <button
                    key={layer.label}
                    className="layer-orb"
                    data-label={layer.label}
                    onClick={() => layer.onChange(!layer.checked)}
                    style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: layer.checked
                            ? layer.color
                            : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        border: layer.checked
                            ? `2px solid ${layer.color}`
                            : "2px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "20px",
                        boxShadow: layer.checked
                            ? `0 4px 20px ${layer.color}60, 0 0 40px ${layer.color}30`
                            : "0 4px 12px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        animation: layer.checked
                            ? `pulse 2s ease-in-out ${index * 0.2}s infinite`
                            : "none",
                        filter: layer.checked ? "none" : "grayscale(0.3)",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "scale(1.15)";
                        e.currentTarget.style.boxShadow = layer.checked
                            ? `0 6px 24px ${layer.color}70, 0 0 50px ${layer.color}40`
                            : "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = layer.checked
                            ? `0 4px 20px ${layer.color}60, 0 0 40px ${layer.color}30`
                            : "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                >
                    <span
                        style={{
                            filter: layer.checked
                                ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                                : "none",
                        }}
                    >
                        {layer.icon}
                    </span>
                </button>
            ))}
        </div>
    );
}
