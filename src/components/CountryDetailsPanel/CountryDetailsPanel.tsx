import { useMemo, useCallback, useState, useEffect } from "react";
import { useMapStore, type SelectedCountry } from "../../store/loadingStore";
import { formatDistance } from "../../utils/distanceMeasurement";
import OverlayPanel from "../OverlayPanel/OverlayPanel";
import countryData from "../../data/data.json";
import bordersData from "../../data/borders.json";
import territoriesData from "../../data/territories.json";
import "./CountryDetailsPanel.css";

type CountryFeatureRaw = {
    geometry: { coordinates: [number, number] };
    properties: SelectedCountry;
};

// Pre-sorted arrays for percentile computation (module-level, runs once)
const allFeatureProps = (
    countryData as unknown as { features: CountryFeatureRaw[] }
).features.map((f) => f.properties);

const SORTED_POPULATION = allFeatureProps
    .map((p) => p.population ?? 0)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);

const SORTED_AREA = allFeatureProps
    .map((p) => p.area ?? 0)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);

const SORTED_DENSITY = allFeatureProps
    .map((p) => p.populationDensity ?? 0)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);

function getPercentile(sorted: number[], value: number): number {
    if (!sorted.length || !value) return 0;
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (sorted[mid] < value) lo = mid + 1;
        else hi = mid;
    }
    return Math.round((lo / sorted.length) * 100);
}

function formatCompact(value?: number): string {
    if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
    return value.toFixed(0);
}

function formatDrivingSide(side?: string): string {
    if (side === "left") return "Left";
    if (side === "right") return "Right";
    return "N/A";
}

function formatAirportType(type?: string): string {
    if (!type) return "Unknown";
    return type
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function formatDstStatus(observesDst?: boolean, isDstActive?: boolean): string {
    if (!observesDst) return "No DST";
    return isDstActive ? "DST active" : "Standard time";
}

function sanitizeUrl(value?: string): string | null {
    if (!value) return null;
    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
    } catch {
        return null;
    }
    return null;
}

type Tab = "overview" | "borders" | "territories";

export default function CountryDetailsPanel() {
    const {
        clearMeasurement,
        showCountryComparison,
        measurementStart,
        selectedAirport,
        selectedCountry,
        selectedMeasurement,
        selectedLocation,
        setSelectedAirport,
        setSelectedCountry,
        setSelectedLocation,
        setPendingFlyTo,
        visitedCountries,
        toggleVisited,
    } = useMapStore();

    const [activeTab, setActiveTab] = useState<Tab>("overview");

    useEffect(() => {
        setActiveTab("overview");
    }, [selectedCountry?.cca3]);

    const countryDetails = useMemo(() => {
        if (!selectedCountry) return null;
        return [
            {
                icon: "🏛",
                label: "Capital",
                value: selectedCountry.capital || "N/A",
                href: selectedCountry.capital
                    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(selectedCountry.capital)}`
                    : undefined,
            },
            {
                icon: "💬",
                label: "Languages",
                value: selectedCountry.languages || "N/A",
                href: undefined,
            },
            {
                icon: "💰",
                label: "Currency",
                value: selectedCountry.currencies || "N/A",
                href: selectedCountry.currencies
                    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(selectedCountry.currencies)}`
                    : undefined,
            },
            {
                icon: "🚗",
                label: "Driving",
                value: formatDrivingSide(selectedCountry.car?.side),
                href: undefined,
            },
        ];
    }, [selectedCountry]);

    const airportDetails = useMemo(() => {
        if (!selectedAirport) return null;
        return [
            { label: "Type", value: formatAirportType(selectedAirport.type) },
            { label: "Code", value: selectedAirport.code || "N/A" },
            { label: "City", value: selectedAirport.city || "N/A" },
            { label: "Country", value: selectedAirport.country || "N/A" },
        ];
    }, [selectedAirport]);

    const allFeatures = (countryData as unknown as { features: CountryFeatureRaw[] }).features;

    const neighbors = useMemo(() => {
        if (!selectedCountry) return [];
        const codes = (bordersData as Record<string, string[]>)[selectedCountry.cca3] ?? [];
        return codes
            .map((code) => allFeatures.find((f) => f.properties.cca3 === code))
            .filter((f): f is CountryFeatureRaw => f !== undefined);
    }, [selectedCountry, allFeatures]);

    const territories = useMemo(() => {
        if (!selectedCountry) return [];
        const codes = (territoriesData as Record<string, string[]>)[selectedCountry.cca3] ?? [];
        return codes
            .map((code) => allFeatures.find((f) => f.properties.cca3 === code))
            .filter((f): f is CountryFeatureRaw => f !== undefined);
    }, [selectedCountry, allFeatures]);

    const handleNeighborClick = useCallback(
        (neighbor: CountryFeatureRaw) => {
            setSelectedCountry(neighbor.properties);
            const [lng, lat] = neighbor.geometry.coordinates;
            setPendingFlyTo([lng, lat]);
        },
        [setSelectedCountry, setPendingFlyTo],
    );

    const airportWikipediaLink = sanitizeUrl(selectedAirport?.wikipediaLink);
    const airportHomeLink = sanitizeUrl(selectedAirport?.homeLink);
    const googleMapsLink = selectedLocation
        ? `https://www.google.com/maps?q&layer=c&cbll=${selectedLocation.latitude},${selectedLocation.longitude}`
        : null;
    const googleStreetViewLink = selectedLocation
        ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selectedLocation.latitude},${selectedLocation.longitude}`
        : null;
    const measurementDistanceLabel = selectedMeasurement
        ? formatDistance(selectedMeasurement.distanceMeters)
        : null;
    const selectedTimezoneInfo =
        selectedCountry?.timezoneInfo || selectedLocation?.timezoneInfo;

    if (
        showCountryComparison ||
        (!selectedCountry &&
            !selectedAirport &&
            !selectedLocation &&
            !measurementStart &&
            !selectedMeasurement)
    ) {
        return null;
    }

    const handleClose = () => {
        setSelectedAirport(null);
        setSelectedCountry(null);
        setSelectedLocation(null);
        clearMeasurement();
    };

    const panelTitle =
        selectedMeasurement || measurementStart
            ? "Distance Measurement"
            : selectedAirport
              ? selectedAirport.name
              : selectedCountry
                ? selectedCountry.country
                : "Picked Location";

    const panelEyebrow = selectedMeasurement
        ? "Map Tool"
        : measurementStart
          ? "Awaiting Second Point"
          : selectedAirport
            ? "Airport"
            : selectedCountry
              ? selectedCountry.continent || "Country"
              : "Street View";

    const leading = selectedCountry ? (
        <img
            className="country-details-flag"
            src={selectedCountry.flag}
            alt={selectedCountry.flagAlt || `Flag of ${selectedCountry.country}`}
            width={56}
            height={40}
        />
    ) : (
        <div className="country-details-airport-icon">
            {selectedMeasurement || measurementStart ? "R" : selectedLocation ? "⌖" : "✈"}
        </div>
    );

    const isVisited = selectedCountry
        ? visitedCountries.includes(selectedCountry.cca3)
        : false;

    // Resolve tab — fall back to overview if active tab has no content
    const resolvedTab: Tab =
        (activeTab === "borders" && neighbors.length === 0) ||
        (activeTab === "territories" && territories.length === 0)
            ? "overview"
            : activeTab;

    return (
        <OverlayPanel
            ariaLabel="Details panel"
            className="country-details-panel"
            eyebrow={panelEyebrow}
            title={panelTitle}
            leading={leading}
            onClose={handleClose}
            closeLabel="Close details"
        >
            {/* ── Country view ── */}
            {selectedCountry && countryDetails ? (
                <>
                    {/* Tab bar — only when there's more than just overview */}
                    {(neighbors.length > 0 || territories.length > 0) && (
                        <div className="cdp-tabs">
                            <button
                                className={`cdp-tab${resolvedTab === "overview" ? " active" : ""}`}
                                onClick={() => setActiveTab("overview")}
                            >
                                Overview
                            </button>
                            {neighbors.length > 0 && (
                                <button
                                    className={`cdp-tab${resolvedTab === "borders" ? " active" : ""}`}
                                    onClick={() => setActiveTab("borders")}
                                >
                                    Borders
                                    <span className="cdp-tab-badge">{neighbors.length}</span>
                                </button>
                            )}
                            {territories.length > 0 && (
                                <button
                                    className={`cdp-tab${resolvedTab === "territories" ? " active" : ""}`}
                                    onClick={() => setActiveTab("territories")}
                                >
                                    Territories
                                    <span className="cdp-tab-badge">{territories.length}</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Scrollable tab content */}
                    <div className="cdp-body">
                        {resolvedTab === "overview" && (
                            <>
                                {/* Stats */}
                                <div className="cdp-stats">
                                    <div className="cdp-stat">
                                        <span className="cdp-stat-label">Population</span>
                                        <span className="cdp-stat-value">
                                            {formatCompact(selectedCountry.population)}
                                        </span>
                                        <div className="cdp-stat-bar">
                                            <div
                                                className="cdp-stat-bar-fill"
                                                style={{
                                                    width: `${getPercentile(SORTED_POPULATION, selectedCountry.population)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="cdp-stat-pct">
                                            {getPercentile(SORTED_POPULATION, selectedCountry.population)}%
                                        </span>
                                    </div>
                                    <div className="cdp-stat">
                                        <span className="cdp-stat-label">Area</span>
                                        <span className="cdp-stat-value">
                                            {selectedCountry.area
                                                ? `${formatCompact(selectedCountry.area)} km²`
                                                : "N/A"}
                                        </span>
                                        <div className="cdp-stat-bar">
                                            <div
                                                className="cdp-stat-bar-fill"
                                                style={{
                                                    width: `${getPercentile(SORTED_AREA, selectedCountry.area)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="cdp-stat-pct">
                                            {getPercentile(SORTED_AREA, selectedCountry.area)}%
                                        </span>
                                    </div>
                                    <div className="cdp-stat">
                                        <span className="cdp-stat-label">Density</span>
                                        <span className="cdp-stat-value">
                                            {selectedCountry.populationDensity
                                                ? `${formatCompact(selectedCountry.populationDensity)}/km²`
                                                : "N/A"}
                                        </span>
                                        <div className="cdp-stat-bar">
                                            <div
                                                className="cdp-stat-bar-fill"
                                                style={{
                                                    width: `${getPercentile(SORTED_DENSITY, selectedCountry.populationDensity ?? 0)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="cdp-stat-pct">
                                            {getPercentile(SORTED_DENSITY, selectedCountry.populationDensity ?? 0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="cdp-info">
                                    {countryDetails.map((row) => (
                                        <div key={row.label} className="cdp-info-row">
                                            <span className="cdp-info-icon">{row.icon}</span>
                                            <span className="cdp-info-label">{row.label}</span>
                                            {row.href ? (
                                                <a
                                                    href={row.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="cdp-info-value cdp-link"
                                                >
                                                    {row.value}
                                                </a>
                                            ) : (
                                                <span className="cdp-info-value">{row.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Timezone */}
                                {selectedCountry.timezoneInfo ? (
                                    <div className="cdp-time">
                                        <span className="cdp-time-icon">🕐</span>
                                        <div className="cdp-time-body">
                                            <div className="cdp-time-value">
                                                {selectedCountry.timezoneInfo.currentTime}
                                            </div>
                                            <div className="cdp-time-sub">
                                                {selectedCountry.timezoneInfo.offsetLabel}
                                                {" · "}
                                                {formatDstStatus(
                                                    selectedCountry.timezoneInfo.observesDst,
                                                    selectedCountry.timezoneInfo.isDstActive,
                                                )}
                                            </div>
                                            <div className="cdp-time-zone">
                                                {selectedCountry.timezoneInfo.cityLabel}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}

                        {resolvedTab === "borders" && (
                            <div className="cdp-chips-grid">
                                {neighbors.map((neighbor) => (
                                    <button
                                        key={neighbor.properties.cca3}
                                        className="cdp-chip"
                                        onClick={() => handleNeighborClick(neighbor)}
                                    >
                                        <img
                                            src={neighbor.properties.flag}
                                            alt={
                                                neighbor.properties.flagAlt ||
                                                `Flag of ${neighbor.properties.country}`
                                            }
                                            className="cdp-chip-flag"
                                        />
                                        <span className="cdp-chip-name">
                                            {neighbor.properties.country}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {resolvedTab === "territories" && (
                            <div className="cdp-chips-grid">
                                {territories.map((territory) => (
                                    <button
                                        key={territory.properties.cca3}
                                        className="cdp-chip"
                                        onClick={() => handleNeighborClick(territory)}
                                    >
                                        <img
                                            src={territory.properties.flag}
                                            alt={
                                                territory.properties.flagAlt ||
                                                `Flag of ${territory.properties.country}`
                                            }
                                            className="cdp-chip-flag"
                                        />
                                        <span className="cdp-chip-name">
                                            {territory.properties.country}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sticky footer */}
                    <div className="cdp-footer">
                        <button
                            className={`cdp-visited${isVisited ? " active" : ""}`}
                            onClick={() => toggleVisited(selectedCountry.cca3)}
                        >
                            <span className="cdp-visited-icon">{isVisited ? "✓" : "○"}</span>
                            {isVisited ? "Visited" : "Mark visited"}
                        </button>
                        <div className="cdp-footer-end">
                            <span className="cdp-visited-count">
                                {visitedCountries.length}
                                <span className="cdp-visited-total">
                                    /{allFeatureProps.length}
                                </span>
                            </span>
                            <a
                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedCountry.country)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cdp-wiki"
                            >
                                Wikipedia
                            </a>
                        </div>
                    </div>
                </>
            ) : null}

            {/* ── Measurement view ── */}
            {selectedMeasurement ? (
                <>
                    <div className="country-details-stats country-details-stats-single">
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">Distance</span>
                            <span className="country-details-stat-value">
                                {measurementDistanceLabel}
                            </span>
                        </div>
                    </div>
                    <div className="country-details-list">
                        <div className="country-details-list-item">
                            <span className="country-details-list-label">Start Point</span>
                            <span className="country-details-list-value">
                                {selectedMeasurement.start.latitude.toFixed(6)},{" "}
                                {selectedMeasurement.start.longitude.toFixed(6)}
                            </span>
                        </div>
                        <div className="country-details-list-item">
                            <span className="country-details-list-label">End Point</span>
                            <span className="country-details-list-value">
                                {selectedMeasurement.end.latitude.toFixed(6)},{" "}
                                {selectedMeasurement.end.longitude.toFixed(6)}
                            </span>
                        </div>
                    </div>
                </>
            ) : null}

            {/* ── Measurement start pending ── */}
            {measurementStart && !selectedMeasurement ? (
                <div className="country-details-list">
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">Start Point</span>
                        <span className="country-details-list-value">
                            {measurementStart.latitude.toFixed(6)},{" "}
                            {measurementStart.longitude.toFixed(6)}
                        </span>
                    </div>
                    <div className="country-details-note">
                        Click a second point on the map to complete the measurement.
                    </div>
                </div>
            ) : null}

            {/* ── Airport view ── */}
            {selectedAirport && airportDetails ? (
                <div className="country-details-list">
                    {airportDetails.map((detail) => (
                        <div key={detail.label} className="country-details-list-item">
                            <span className="country-details-list-label">{detail.label}</span>
                            <span className="country-details-list-value">{detail.value}</span>
                        </div>
                    ))}
                    {airportWikipediaLink || airportHomeLink ? (
                        <div className="country-details-links">
                            {airportWikipediaLink ? (
                                <a
                                    className="country-details-link"
                                    href={airportWikipediaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Wikipedia
                                </a>
                            ) : null}
                            {airportHomeLink ? (
                                <a
                                    className="country-details-link"
                                    href={airportHomeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Official Site
                                </a>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}

            {/* ── Location pin view ── */}
            {selectedLocation ? (
                <div className="country-details-list">
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">Latitude</span>
                        <span className="country-details-list-value">
                            {selectedLocation.latitude.toFixed(6)}
                        </span>
                    </div>
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">Longitude</span>
                        <span className="country-details-list-value">
                            {selectedLocation.longitude.toFixed(6)}
                        </span>
                    </div>
                    {selectedTimezoneInfo ? (
                        <>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">Local Time</span>
                                <span className="country-details-list-value">
                                    {selectedTimezoneInfo.currentTime}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">UTC Offset</span>
                                <span className="country-details-list-value">
                                    {selectedTimezoneInfo.offsetLabel}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">DST</span>
                                <span className="country-details-list-value">
                                    {formatDstStatus(
                                        selectedTimezoneInfo.observesDst,
                                        selectedTimezoneInfo.isDstActive,
                                    )}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">Timezone</span>
                                <span className="country-details-list-value">
                                    {selectedTimezoneInfo.cityLabel}
                                </span>
                            </div>
                        </>
                    ) : null}
                    <div className="country-details-links">
                        {googleMapsLink ? (
                            <a
                                className="country-details-link"
                                href={googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Maps
                            </a>
                        ) : null}
                        {googleStreetViewLink ? (
                            <a
                                className="country-details-link"
                                href={googleStreetViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Street View
                            </a>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </OverlayPanel>
    );
}
