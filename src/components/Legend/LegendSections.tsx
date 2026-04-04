import { CONTINENTS } from "../../constants/continents";

type LegendSection = {
    title: string;
    icon: string;
    content: React.ReactNode;
    isVisible: boolean;
};

const POPULATION_COLORS = [
    { color: "#d7eef8", label: "< 1M" },
    { color: "#acd8f0", label: "1-10M" },
    { color: "#f4de9b", label: "10-50M" },
    { color: "#f5bc91", label: "50-100M" },
    { color: "#eb8f78", label: "100-500M" },
    { color: "#d96f78", label: "> 500M" },
];

const DENSITY_COLORS = [
    { color: "#eef9f1", label: "< 25 / km²" },
    { color: "#d6f1df", label: "25-100 / km²" },
    { color: "#b4e6c8", label: "100-250 / km²" },
    { color: "#87d6ae", label: "250-500 / km²" },
    { color: "#59c096", label: "500-1K / km²" },
    { color: "#2f9f87", label: "> 1K / km²" },
];

const GDP_COLORS = [
    { color: "#fef9e7", label: "< $1B" },
    { color: "#fde68a", label: "$1B–$10B" },
    { color: "#fbbf24", label: "$10B–$100B" },
    { color: "#d97706", label: "$100B–$1T" },
    { color: "#92400e", label: "$1T–$10T" },
    { color: "#451a03", label: "> $10T" },
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

function GdpLegendContent() {
    return (
        <div className="legend-gradient-scale">
            <div
                className="legend-gradient-bar"
                style={{
                    background: `linear-gradient(to right, ${GDP_COLORS.map((c) => c.color).join(", ")})`,
                }}
            />
            <div className="legend-gradient-labels">
                {["$0", "$1B", "$10B", "$100B", "$1T", "$10T+"].map((label) => (
                    <span key={label} className="legend-gradient-label">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function TimezonesLegendContent() {
    return (
        <div className="legend-items legend-items-compact">
            <div className="legend-scale-item">
                <div
                    className="legend-scale-swatch"
                    style={{ backgroundColor: "#71cabf" }}
                />
                <span className="legend-scale-label">Timezone boundary</span>
            </div>
            <div className="legend-scale-item">
                <div
                    className="legend-scale-swatch"
                    style={{ backgroundColor: "#9de2da" }}
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
    showTimezones: boolean,
    showGdp: boolean
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
            title: "GDP",
            icon: "",
            isVisible: showGdp,
            content: <GdpLegendContent />,
        },
        {
            title: "Timezones",
            icon: "",
            isVisible: showTimezones,
            content: <TimezonesLegendContent />,
        },
    ];
}
