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
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: 1000,
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 20px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,0.2)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0,0,0,0.15)";
                }}
            >
                <span style={{ fontSize: "20px" }}>{isOpen ? "✕" : "☰"}</span>
                <span>Layers</span>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "85px",
                        left: "20px",
                        zIndex: 1000,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        minWidth: "220px",
                        animation: "slideIn 0.2s ease",
                    }}
                >
                    <h3
                        style={{
                            margin: "0 0 16px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#333",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Map Layers
                    </h3>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "14px",
                            cursor: "pointer",
                            fontSize: "15px",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "transparent";
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showCoastlines}
                            onChange={(e) =>
                                onToggleCoastlines(e.target.checked)
                            }
                            style={{
                                marginRight: "12px",
                                cursor: "pointer",
                                width: "18px",
                                height: "18px",
                                accentColor: "#198EC8",
                            }}
                        />
                        <span>🌊 Coastlines</span>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "14px",
                            cursor: "pointer",
                            fontSize: "15px",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "transparent";
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showSatellite}
                            onChange={(e) =>
                                onToggleSatellite(e.target.checked)
                            }
                            style={{
                                marginRight: "12px",
                                cursor: "pointer",
                                width: "18px",
                                height: "18px",
                                accentColor: "#198EC8",
                            }}
                        />
                        <span>🛰️ Satellite</span>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "14px",
                            cursor: "pointer",
                            fontSize: "15px",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "transparent";
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showCapitals}
                            onChange={(e) => onToggleCapitals(e.target.checked)}
                            style={{
                                marginRight: "12px",
                                cursor: "pointer",
                                width: "18px",
                                height: "18px",
                                accentColor: "#198EC8",
                            }}
                        />
                        <span>🏛️ Capitals</span>
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            fontSize: "15px",
                            padding: "8px",
                            borderRadius: "6px",
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "rgba(0,0,0,0.05)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "transparent";
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showContinents}
                            onChange={(e) =>
                                onToggleContinents(e.target.checked)
                            }
                            style={{
                                marginRight: "12px",
                                cursor: "pointer",
                                width: "18px",
                                height: "18px",
                                accentColor: "#198EC8",
                            }}
                        />
                        <span>🗺️ Continents</span>
                    </label>
                </div>
            )}
        </>
    );
}
