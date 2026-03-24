import { useMemo } from "react";
import { useMapStore } from "../../store/loadingStore";
import "./CountryDetailsPanel.css";

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

function formatAirportType(type?: string): string {
    if (!type) return "Unknown";

    return type
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function sanitizeUrl(value?: string): string | null {
    if (!value) return null;

    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
    } catch {
        return null;
    }

    return null;
}

export default function CountryDetailsPanel() {
    const {
        selectedAirport,
        selectedCountry,
        selectedLocation,
        setSelectedAirport,
        setSelectedCountry,
        setSelectedLocation,
    } = useMapStore();

    const countryDetails = useMemo(() => {
        if (!selectedCountry) return null;

        return [
            {
                label: "Capital",
                value: selectedCountry.capital || "N/A",
            },
            {
                label: "Languages",
                value: selectedCountry.languages || "N/A",
            },
            {
                label: "Currency",
                value: selectedCountry.currencies || "N/A",
            },
            {
                label: "Driving Side",
                value: formatDrivingSide(selectedCountry.car?.side),
            },
        ];
    }, [selectedCountry]);

    const airportDetails = useMemo(() => {
        if (!selectedAirport) return null;

        return [
            {
                label: "Type",
                value: formatAirportType(selectedAirport.type),
            },
            {
                label: "Code",
                value: selectedAirport.code || "N/A",
            },
            {
                label: "City",
                value: selectedAirport.city || "N/A",
            },
            {
                label: "Country",
                value: selectedAirport.country || "N/A",
            },
        ];
    }, [selectedAirport]);

    const airportWikipediaLink = sanitizeUrl(selectedAirport?.wikipediaLink);
    const airportHomeLink = sanitizeUrl(selectedAirport?.homeLink);
    const googleMapsLink = selectedLocation
        ? `https://www.google.com/maps?q&layer=c&cbll=${selectedLocation.latitude},${selectedLocation.longitude}`
        : null;
    const googleStreetViewLink = selectedLocation
        ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${selectedLocation.latitude},${selectedLocation.longitude}`
        : null;

    if (!selectedCountry && !selectedAirport && !selectedLocation) {
        return null;
    }

    const handleClose = () => {
        setSelectedAirport(null);
        setSelectedCountry(null);
        setSelectedLocation(null);
    };

    const panelTitle = selectedAirport
        ? selectedAirport.name
        : selectedCountry
        ? selectedCountry.country
        : "Picked Location";
    const panelEyebrow = selectedAirport
        ? "Airport"
        : selectedCountry
        ? selectedCountry.continent || "Country"
        : "Street View";

    return (
        <aside className="country-details-panel" aria-label="Details panel">
            <div className="country-details-header">
                <div className="country-details-identity">
                    {selectedCountry ? (
                        <img
                            className="country-details-flag"
                            src={selectedCountry.flag}
                            alt={
                                selectedCountry.flagAlt ||
                                `Flag of ${selectedCountry.country}`
                            }
                            width={56}
                            height={40}
                        />
                    ) : (
                        <div className="country-details-airport-icon">
                            {selectedLocation ? "⌖" : "✈"}
                        </div>
                    )}
                    <div>
                        <div className="country-details-eyebrow">{panelEyebrow}</div>
                        <h2 className="country-details-title">{panelTitle}</h2>
                    </div>
                </div>
                <button
                    type="button"
                    className="country-details-close"
                    onClick={handleClose}
                    aria-label="Close details"
                >
                    ✕
                </button>
            </div>

            {selectedCountry && countryDetails ? (
                <>
                    <div className="country-details-stats">
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">
                                Population
                            </span>
                            <span className="country-details-stat-value">
                                {formatNumber(selectedCountry.population)}
                            </span>
                        </div>
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">Area</span>
                            <span className="country-details-stat-value">
                                {selectedCountry.area
                                    ? `${formatNumber(selectedCountry.area)} km²`
                                    : "N/A"}
                            </span>
                        </div>
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">Density</span>
                            <span className="country-details-stat-value">
                                {selectedCountry.populationDensity
                                    ? `${formatNumber(
                                          selectedCountry.populationDensity
                                      )} / km²`
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="country-details-list">
                        {countryDetails.map((detail) => (
                            <div
                                key={detail.label}
                                className="country-details-list-item"
                            >
                                <span className="country-details-list-label">
                                    {detail.label}
                                </span>
                                <span className="country-details-list-value">
                                    {detail.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {selectedAirport && airportDetails ? (
                <div className="country-details-list">
                    {airportDetails.map((detail) => (
                        <div
                            key={detail.label}
                            className="country-details-list-item"
                        >
                            <span className="country-details-list-label">
                                {detail.label}
                            </span>
                            <span className="country-details-list-value">
                                {detail.value}
                            </span>
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

            {selectedLocation ? (
                <div className="country-details-list">
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">
                            Latitude
                        </span>
                        <span className="country-details-list-value">
                            {selectedLocation.latitude.toFixed(6)}
                        </span>
                    </div>
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">
                            Longitude
                        </span>
                        <span className="country-details-list-value">
                            {selectedLocation.longitude.toFixed(6)}
                        </span>
                    </div>
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
        </aside>
    );
}
