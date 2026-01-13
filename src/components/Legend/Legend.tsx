import { useState } from "react";
import "./Legend.css";

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
    title = "Legend",
    offset = 0,
    closedIcon,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isVisible) return null;

    const leftPosition = 20 + offset * 60;

    return (
        <div className="container" style={{ left: `${leftPosition}px` }}>
            {isOpen && (
                <div className="legendPanel">
                    <div className="legendTitle">{title}</div>
                    {children}
                </div>
            )}

            <button
                className={`legendOrb ${isOpen ? "open" : "closed"}`}
                data-title={title}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`icon ${isOpen ? "open" : "closed"}`}>
                    {isOpen ? "📍" : closedIcon}
                </span>
            </button>
        </div>
    );
}