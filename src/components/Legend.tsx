import { useState } from "react";

type Props = {
    isVisible: boolean;
    children: React.ReactNode;
    title?: string;
    offset?: number;
    closedIcon?: React.ReactNode;
};

export default function Legend({
    isVisible,
    children,
    title,
    offset = 0,
    closedIcon,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isVisible) return null;

    const leftPosition = 20 + offset * 60;

    return (
        <div
            style={{
                position: "absolute",
                bottom: "20px",
                left: `${leftPosition}px`,
                zIndex: 1000,
            }}
        >
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .legend-orb-${offset} {
                        position: relative;
                    }
                    
                    .legend-orb-${offset}::before {
                        content: '${title || "Legend"}';
                        position: absolute;
                        bottom: 58px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.85);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 8px;
                        font-size: 12px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s ease;
                        font-weight: 500;
                        backdrop-filter: blur(10px);
                    }
                    
                    .legend-orb-${offset}:hover::before {
                        opacity: 1;
                    }
                `}
            </style>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "68px",
                        left: "0",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        padding: "16px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                        minWidth: "200px",
                        animation: "fadeIn 0.3s ease",
                        border: "1px solid rgba(255,255,255,0.3)",
                    }}
                >
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#666",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            marginBottom: "12px",
                        }}
                    >
                        {title || "Legend"}
                    </div>
                    {children}
                </div>
            )}

            <button
                className={`legend-orb-${offset}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: isOpen
                        ? "#9370DB"
                        : "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: isOpen
                        ? "2px solid #9370DB"
                        : "2px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "20px",
                    boxShadow: isOpen
                        ? "0 4px 20px rgba(147, 112, 219, 0.6), 0 0 40px rgba(147, 112, 219, 0.3)"
                        : "0 4px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    filter: isOpen ? "none" : "grayscale(0.3)",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.15)";
                    e.currentTarget.style.boxShadow = isOpen
                        ? "0 6px 24px rgba(147, 112, 219, 0.7), 0 0 50px rgba(147, 112, 219, 0.4)"
                        : "0 6px 20px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = isOpen
                        ? "0 4px 20px rgba(147, 112, 219, 0.6), 0 0 40px rgba(147, 112, 219, 0.3)"
                        : "0 4px 12px rgba(0,0,0,0.1)";
                }}
            >
                <span
                    style={{
                        filter: isOpen
                            ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                            : "none",
                        transition: "transform 0.3s ease",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        display: "inline-block",
                    }}
                >
                    {isOpen ? "📍" : closedIcon}
                </span>
            </button>
        </div>
    );
}