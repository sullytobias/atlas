import { useState, useMemo, useCallback, useEffect } from "react";
import "./Legend.css";

type LegendSection = {
    title: string;
    icon: string;
    content: React.ReactNode;
    isVisible: boolean;
};

type Props = {
    sections: LegendSection[];
};

export default function Legend({ sections }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const hasVisibleSections = useMemo(
        () => sections.some((section) => section.isVisible),
        [sections]
    );

    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const visibleSections = useMemo(
        () => sections.filter((s) => s.isVisible),
        [sections]
    );

    const LegendSectionItem: React.FC<{
        section: LegendSection;
        isLast: boolean;
    }> = ({ section, isLast }) => (
        <div>
            <div className="legend-section">
                <div className="legend-section-title">
                    <span className="legend-section-icon">{section.icon}</span>
                    {section.title}
                </div>
                {section.content}
            </div>
            {!isLast && <div className="legend-divider" />}
        </div>
    );

    if (!hasVisibleSections && !isOpen) return null;

    return (
        <div className="legend-container">
            {!isOpen && (
                <button
                    className="legend-trigger"
                    onClick={handleOpen}
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                    aria-label="Open legend"
                >
                    <span className="legend-trigger-text">Legend</span>
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <div
                    className="legend-overlay"
                    onClick={handleClose}
                    aria-label="Close legend overlay"
                    tabIndex={-1}
                    role="presentation"
                />
            )}

            {/* Drawer */}
            {isOpen && (
                <div className="legend-drawer">
                    <div className="legend-drawer-header">
                        <div className="legend-drawer-title">
                            <span>Map Legend</span>
                        </div>
                        <button
                            className="legend-close-button"
                            onClick={handleClose}
                            aria-label="Close legend"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="legend-drawer-content">
                        {visibleSections.map((section, index) => (
                            <LegendSectionItem
                                key={section.title}
                                section={section}
                                isLast={index === visibleSections.length - 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
