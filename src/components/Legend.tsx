import { useState } from "react";

type Props = {
    isVisible: boolean;
    children: React.ReactNode;
    title?: string;
};

export default function Legend({ isVisible, children, title }: Props) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isVisible) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "absolute",
                    bottom: "20px",
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
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                }}
            >
                <span style={{ fontSize: "20px" }}>🗺️</span>
                <span>{title || "Legend"}</span>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "85px",
                        left: "20px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        padding: "20px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        zIndex: 1000,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        minWidth: "220px",
                        animation: "slideIn 0.2s ease",
                    }}
                >
                    <h3
                        style={{
                            margin: "0 0 12px 0",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#333",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {title || "Continents"}
                    </h3>
                    {children}
                </div>
            )}
        </>
    );
}