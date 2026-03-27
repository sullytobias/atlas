import {
    useMapStore,
    type ComparisonSlot,
    type SelectedCountry,
} from "../../store/loadingStore";
import OverlayPanel from "../OverlayPanel/OverlayPanel";
import "./CountryComparisonPanel.css";

type ComparisonMetric = {
    label: string;
    left: string;
    right: string;
};

function formatNumber(value?: number): string {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "N/A";
    }

    return value.toLocaleString();
}

function formatDrivingSide(side?: string): string {
    if (side === "left") return "Left";
    if (side === "right") return "Right";
    return "N/A";
}

function buildMetrics(
    leftCountry: SelectedCountry | null,
    rightCountry: SelectedCountry | null,
): ComparisonMetric[] {
    return [
        {
            label: "Capital",
            left: leftCountry?.capital || "N/A",
            right: rightCountry?.capital || "N/A",
        },
        {
            label: "Population",
            left: formatNumber(leftCountry?.population),
            right: formatNumber(rightCountry?.population),
        },
        {
            label: "Area",
            left: leftCountry?.area
                ? `${formatNumber(leftCountry.area)} km²`
                : "N/A",
            right: rightCountry?.area
                ? `${formatNumber(rightCountry.area)} km²`
                : "N/A",
        },
        {
            label: "Density",
            left: leftCountry?.populationDensity
                ? `${formatNumber(leftCountry.populationDensity)} / km²`
                : "N/A",
            right: rightCountry?.populationDensity
                ? `${formatNumber(rightCountry.populationDensity)} / km²`
                : "N/A",
        },
        {
            label: "Languages",
            left: leftCountry?.languages || "N/A",
            right: rightCountry?.languages || "N/A",
        },
        {
            label: "Currency",
            left: leftCountry?.currencies || "N/A",
            right: rightCountry?.currencies || "N/A",
        },
        {
            label: "Driving",
            left: formatDrivingSide(leftCountry?.car?.side),
            right: formatDrivingSide(rightCountry?.car?.side),
        },
    ];
}

function CountryChip({
    country,
    slot,
    onClear,
}: {
    country: SelectedCountry | null;
    slot: ComparisonSlot;
    onClear: (slot: ComparisonSlot) => void;
}) {
    return (
        <div className={`comparison-chip${country ? " filled" : ""}`}>
            <div className="comparison-chip-topline">
                <span className="comparison-chip-label">Country {slot + 1}</span>
                {country ? (
                    <button
                        type="button"
                        className="comparison-chip-clear"
                        onClick={() => onClear(slot)}
                    >
                        Clear
                    </button>
                ) : null}
            </div>
            <div className="comparison-chip-main">
                {country ? (
                    <img
                        className="comparison-chip-flag"
                        src={country.flag}
                        alt={country.flagAlt || `Flag of ${country.country}`}
                        width={34}
                        height={24}
                    />
                ) : (
                    <div className="comparison-chip-placeholder" />
                )}
                <div className="comparison-chip-text">
                    <div className="comparison-chip-title">
                        {country?.country || "Pick a country"}
                    </div>
                    <div className="comparison-chip-subtitle">
                        {country?.continent || "Map click or search"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CountryComparisonPanel() {
    const {
        comparisonCountries,
        showCountryComparison,
        clearComparison,
        clearComparisonSlot,
    } = useMapStore();

    if (!showCountryComparison) {
        return null;
    }

    const [leftCountry, rightCountry] = comparisonCountries;
    const metrics = buildMetrics(leftCountry, rightCountry);

    return (
        <OverlayPanel
            ariaLabel="Country comparison"
            className="comparison-panel"
            eyebrow="Compare Countries"
            title="Quick comparison"
            description="Pick two countries from the map or search. New picks fill the next open slot."
            onClose={clearComparison}
            closeLabel="Close comparison"
        >
            <div className="comparison-chip-grid">
                <CountryChip
                    country={leftCountry}
                    slot={0}
                    onClear={clearComparisonSlot}
                />
                <CountryChip
                    country={rightCountry}
                    slot={1}
                    onClear={clearComparisonSlot}
                />
            </div>

            <div className="comparison-metric-list">
                {metrics.map((metric) => (
                    <div key={metric.label} className="comparison-metric-row">
                        <span className="comparison-metric-value left">
                            {metric.left}
                        </span>
                        <span className="comparison-metric-label">
                            {metric.label}
                        </span>
                        <span className="comparison-metric-value right">
                            {metric.right}
                        </span>
                    </div>
                ))}
            </div>
        </OverlayPanel>
    );
}
