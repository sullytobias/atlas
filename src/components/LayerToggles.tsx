import { useState } from "react";

type Props = {
    showCoastlines: boolean;
    onToggleCoastlines: (value: boolean) => void;
    showSatellite: boolean;
    onToggleSatellite: (value: boolean) => void;
    showCapitals: boolean;
    onToggleCapitals: (value: boolean) => void;
};

export default function LayerToggles({
    showCoastlines,
    onToggleCoastlines,
    showSatellite,
    onToggleSatellite,
    showCapitals,
    onToggleCapitals,
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
                    backgroundColor: "white",
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}
            >
                <span>{isOpen ? "✕" : "☰"}</span>
                <span>Layers</span>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "80px",
                        left: "20px",
                        zIndex: 1000,
                        backgroundColor: "white",
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        minWidth: "200px",
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showCoastlines}
                            onChange={(e) =>
                                onToggleCoastlines(e.target.checked)
                            }
                            style={{ marginRight: "8px", cursor: "pointer" }}
                        />
                        Show Coastlines
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showSatellite}
                            onChange={(e) =>
                                onToggleSatellite(e.target.checked)
                            }
                            style={{ marginRight: "8px", cursor: "pointer" }}
                        />
                        Satellite View
                    </label>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={showCapitals}
                            onChange={(e) => onToggleCapitals(e.target.checked)}
                            style={{ marginRight: "8px", cursor: "pointer" }}
                        />
                        Show Capitals
                    </label>
                </div>
            )}
        </>
    );
}
