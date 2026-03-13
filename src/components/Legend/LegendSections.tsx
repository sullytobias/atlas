import { CONTINENTS } from "../../constants/continents";

type LegendSection = {
    title: string;
    icon: string;
    content: React.ReactNode;
    isVisible: boolean;
};

const POPULATION_COLORS = [
    { color: "#87CEEB", label: "< 1M" },
    { color: "#4169E1", label: "1-10M" },
    { color: "#FFA500", label: "10-50M" },
    { color: "#FF4500", label: "50-100M" },
    { color: "#DC143C", label: "100-500M" },
    { color: "#8B008B", label: "> 500M" },
];

function ContinentsLegendContent() {
    return (
        <div className="legend-items">
            {CONTINENTS.filter((continent) => continent.name !== "Antarctica").map(
                (continent) => (
                    <a
                        key={continent.name}
                        className="legend-link-item"
                        href={continent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span
                            className="legend-color-swatch"
                            style={{ backgroundColor: continent.color }}
                        />
                        <span className="legend-link-label">{continent.name}</span>
                        <span className="legend-link-icon" aria-hidden="true">
                            🔗
                        </span>
                    </a>
                )
            )}
        </div>
    );
}

function PopulationLegendContent() {
    return (
        <div className="legend-items legend-items-compact">
            {POPULATION_COLORS.map((item) => (
                <div key={item.label} className="legend-scale-item">
                    <div
                        className="legend-scale-swatch"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="legend-scale-label">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export function buildLegendSections(
    showContinents: boolean,
    showHeatmap: boolean
): LegendSection[] {
    return [
        {
            title: "Continents",
            icon: "",
            isVisible: showContinents,
            content: <ContinentsLegendContent />,
        },
        {
            title: "Population",
            icon: "",
            isVisible: showHeatmap,
            content: <PopulationLegendContent />,
        },
    ];
}
