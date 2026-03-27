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

const DENSITY_COLORS = [
    { color: "#ECFDF5", label: "< 25 / km²" },
    { color: "#A7F3D0", label: "25-100 / km²" },
    { color: "#34D399", label: "100-250 / km²" },
    { color: "#10B981", label: "250-500 / km²" },
    { color: "#059669", label: "500-1K / km²" },
    { color: "#065F46", label: "> 1K / km²" },
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

function DensityLegendContent() {
    return (
        <div className="legend-items legend-items-compact">
            {DENSITY_COLORS.map((item) => (
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

function TimezonesLegendContent() {
    return (
        <div className="legend-items legend-items-compact">
            <div className="legend-scale-item">
                <div
                    className="legend-scale-swatch"
                    style={{ backgroundColor: "#38b2ac" }}
                />
                <span className="legend-scale-label">Timezone boundary</span>
            </div>
            <div className="legend-scale-item">
                <div
                    className="legend-scale-swatch"
                    style={{ backgroundColor: "#63d4c8" }}
                />
                <span className="legend-scale-label">UTC offset label</span>
            </div>
        </div>
    );
}

export function buildLegendSections(
    showContinents: boolean,
    showHeatmap: boolean,
    showDensity: boolean,
    showTimezones: boolean
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
        {
            title: "Density",
            icon: "",
            isVisible: showDensity,
            content: <DensityLegendContent />,
        },
        {
            title: "Timezones",
            icon: "",
            isVisible: showTimezones,
            content: <TimezonesLegendContent />,
        },
    ];
}
