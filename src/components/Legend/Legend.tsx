import { useState } from "react";
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

    const hasVisibleSections = sections.some((section) => section.isVisible);

    const showHint = hasVisibleSections && !isOpen;

    if (!hasVisibleSections && !isOpen) return null;

    return (
        <div className="legend-container">
            {!isOpen && (
                <button
                    className="legend-trigger"
                    onClick={() => setIsOpen(true)}
                    style={{ bottom: "20px" }}
                >
                    <span className="legend-trigger-text">Legend</span>
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <div
                    className="legend-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            {isOpen && (
                <div className="legend-drawer">
                    <div className="legend-drawer-header">
                        <div className="legend-drawer-title">
                            <span className="legend-drawer-title-icon">📍</span>
                            <span>Map Legend</span>
                        </div>
                        <button
                            className="legend-close-button"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="legend-drawer-content">
                        {sections.map(
                            (section, index) =>
                                section.isVisible && (
                                    <div key={section.title}>
                                        <div className="legend-section">
                                            <div className="legend-section-title">
                                                <span className="legend-section-icon">
                                                    {section.icon}
                                                </span>
                                                {section.title}
                                            </div>
                                            {section.content}
                                        </div>
                                        {index <
                                            sections.filter((s) => s.isVisible)
                                                .length -
                                                1 && (
                                            <div className="legend-divider" />
                                        )}
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
