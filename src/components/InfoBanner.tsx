import { useState } from "react";

export default function InfoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}
        >
            <span>👆 Click on any country to view information</span>
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                ✕
            </button>
        </div>
    );
}