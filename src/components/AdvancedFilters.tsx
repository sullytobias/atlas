import { useState } from "react";

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
    onToggleAirports: (airports: {
        large: boolean;
        medium: boolean;
        small: boolean;
        heliport: boolean;
        seaplane: boolean;
        closed: boolean;
        balloonport: boolean;
    }) => void;
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
    { key: "large", label: "Large Airport", color: "#e74c3c", size: 12, icon: "✈️", count: 955 },
    { key: "medium", label: "Medium Airport", color: "#f39c12", size: 9, icon: "🛬", count: 4241 },
    { key: "small", label: "Small Airport", color: "#3498db", size: 6, icon: "🛩️", count: 42540 },
    { key: "heliport", label: "Heliport", color: "#9b59b6", size: 5, icon: "🚁", count: 22436 },
    { key: "seaplane", label: "Seaplane Base", color: "#1abc9c", size: 5, icon: "🛥️", count: 1248 },
    { key: "balloonport", label: "Balloonport", color: "#e91e63", size: 4, icon: "🎈", count: 60 },
    { key: "closed", label: "Closed", color: "#95a5a6", size: 4, icon: "🚫", count: 12929 },
];

export default function AdvancedFilters({ showAirports, onToggleAirports }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAirportToggle = (type: keyof typeof showAirports) => {
        onToggleAirports({
            ...showAirports,
            [type]: !showAirports[type],
        });
    };

    const activeCount = Object.values(showAirports).filter(Boolean).length;

    return (
        <>
            <style>
                {`
                    @keyframes slideUp {
                        from {
                            transform: translateY(100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes slideDown {
                        from {
                            transform: translateY(0);
                        }
                        to {
                            transform: translateY(100%);
                        }
                    }
                    
                    .drawer-overlay {
                        animation: fadeIn 0.3s ease;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    .airport-card {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .airport-card::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
                        transform: translateX(-100%);
                        transition: transform 0.6s;
                    }
                    
                    .airport-card:hover::after {
                        transform: translateX(100%);
                    }
                `}
            </style>

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "absolute",
                    bottom: "50px",
                    right: "30px",
                    zIndex: 1001,
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#2c3e50",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1) rotate(10deg)";
                    e.currentTarget.style.boxShadow = "0 6px 30px rgba(0,0,0,0.4)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                }}
            >
                <div style={{ position: "relative" }}>
                    <span>{isOpen ? "✕" : "⚙️"}</span>
                    {activeCount > 0 && !isOpen && (
                        <span
                            style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: "#e74c3c",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid #2c3e50",
                            }}
                        >
                            {activeCount}
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div
                    className="drawer-overlay"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 999,
                        backdropFilter: "blur(4px)",
                    }}
                />
            )}

            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                    boxShadow: "0 -4px 30px rgba(0,0,0,0.2)",
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    maxHeight: "70vh",
                    overflowY: "auto",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "4px",
                        backgroundColor: "#ddd",
                        borderRadius: "2px",
                        margin: "12px auto",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsOpen(false)}
                />

                <div style={{ padding: "0 24px 32px 24px" }}>
                    <h2
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            marginBottom: "8px",
                            color: "#2c3e50",
                        }}
                    >
                        Advanced Filters
                    </h2>
                    <p
                        style={{
                            fontSize: "14px",
                            color: "#7f8c8d",
                            marginBottom: "24px",
                        }}
                    >
                        Customize what you see on the map
                    </p>

                    <div
                        style={{
                            marginBottom: "24px",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "16px",
                                color: "#34495e",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            ✈️ Airports & Aviation Facilities
                        </h3>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "12px",
                            }}
                        >
                            {AIRPORT_TYPES.map((airport) => {
                                const isActive = showAirports[airport.key];
                                return (
                                    <button
                                        key={airport.key}
                                        className="airport-card"
                                        onClick={() => handleAirportToggle(airport.key)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "16px",
                                            borderRadius: "12px",
                                            border: isActive
                                                ? `2px solid ${airport.color}`
                                                : "2px solid #ecf0f1",
                                            backgroundColor: isActive
                                                ? `${airport.color}15`
                                                : "white",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            textAlign: "left",
                                        }}
                                        onMouseOver={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                e.currentTarget.style.borderColor = "#bdc3c7";
                                            } else {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = `0 4px 12px ${airport.color}40`;
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = "white";
                                                e.currentTarget.style.borderColor = "#ecf0f1";
                                            } else {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: "28px" }}>{airport.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    color: isActive ? airport.color : "#2c3e50",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                {airport.label}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: `${airport.size}px`,
                                                        height: `${airport.size}px`,
                                                        backgroundColor: airport.color,
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "#95a5a6",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {airport.count.toLocaleString()} facilities
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                border: `2px solid ${isActive ? airport.color : "#bdc3c7"}`,
                                                backgroundColor: isActive ? airport.color : "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.2s ease",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {isActive && (
                                                <span
                                                    style={{
                                                        color: "white",
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            paddingTop: "16px",
                            borderTop: "1px solid #ecf0f1",
                        }}
                    >
                        <button
                            onClick={() =>
                                onToggleAirports({
                                    large: true,
                                    medium: true,
                                    small: true,
                                    heliport: true,
                                    seaplane: true,
                                    closed: true,
                                    balloonport: true,
                                })
                            }
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#3498db",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#2980b9";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#3498db";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Select All
                        </button>
                        <button
                            onClick={() =>
                                onToggleAirports({
                                    large: false,
                                    medium: false,
                                    small: false,
                                    heliport: false,
                                    seaplane: false,
                                    closed: false,
                                    balloonport: false,
                                })
                            }
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "2px solid #ecf0f1",
                                backgroundColor: "white",
                                color: "#7f8c8d",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = "#bdc3c7";
                                e.currentTarget.style.backgroundColor = "#f8f9fa";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = "#ecf0f1";
                                e.currentTarget.style.backgroundColor = "white";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}