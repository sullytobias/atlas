import { useMemo } from "react";
import { useMapStore } from "../../store/loadingStore";
import { formatDistance } from "../../utils/distanceMeasurement";
import OverlayPanel from "../OverlayPanel/OverlayPanel";
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

function formatDstStatus(
    observesDst?: boolean,
    isDstActive?: boolean,
): string {
    if (!observesDst) return "No seasonal shift";
    return isDstActive ? "DST active" : "Standard time";
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
    const measurementDistanceLabel = selectedMeasurement
        ? formatDistance(selectedMeasurement.distanceMeters)
        : null;
    const selectedTimezoneInfo =
        selectedCountry?.timezoneInfo || selectedLocation?.timezoneInfo;

    if (
        showCountryComparison ||
        !selectedCountry &&
        !selectedAirport &&
        !selectedLocation &&
        !measurementStart &&
        !selectedMeasurement
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
            {selectedMeasurement || measurementStart
                ? "R"
                : selectedLocation
                  ? "⌖"
                  : "✈"}
        </div>
    );

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
                            <span className="country-details-stat-label">
                                Area
                            </span>
                            <span className="country-details-stat-value">
                                {selectedCountry.area
                                    ? `${formatNumber(selectedCountry.area)} km²`
                                    : "N/A"}
                            </span>
                        </div>
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">
                                Density
                            </span>
                            <span className="country-details-stat-value">
                                {selectedCountry.populationDensity
                                    ? `${formatNumber(
                                          selectedCountry.populationDensity,
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
                        {selectedCountry.timezoneInfo ? (
                            <>
                                <div className="country-details-list-item">
                                    <span className="country-details-list-label">
                                        Local Time
                                    </span>
                                    <span className="country-details-list-value">
                                        {selectedCountry.timezoneInfo.currentTime}
                                    </span>
                                </div>
                                <div className="country-details-list-item">
                                    <span className="country-details-list-label">
                                        UTC Offset
                                    </span>
                                    <span className="country-details-list-value">
                                        {selectedCountry.timezoneInfo.offsetLabel}
                                    </span>
                                </div>
                                <div className="country-details-list-item">
                                    <span className="country-details-list-label">
                                        DST
                                    </span>
                                    <span className="country-details-list-value">
                                        {formatDstStatus(
                                            selectedCountry.timezoneInfo.observesDst,
                                            selectedCountry.timezoneInfo.isDstActive,
                                        )}
                                    </span>
                                </div>
                                <div className="country-details-list-item">
                                    <span className="country-details-list-label">
                                        Timezone
                                    </span>
                                    <span className="country-details-list-value">
                                        {selectedCountry.timezoneInfo.cityLabel}
                                    </span>
                                </div>
                            </>
                        ) : null}
                    </div>
                </>
            ) : null}

            {selectedMeasurement ? (
                <>
                    <div className="country-details-stats country-details-stats-single">
                        <div className="country-details-stat">
                            <span className="country-details-stat-label">
                                Distance
                            </span>
                            <span className="country-details-stat-value">
                                {measurementDistanceLabel}
                            </span>
                        </div>
                    </div>

                    <div className="country-details-list">
                        <div className="country-details-list-item">
                            <span className="country-details-list-label">
                                Start Point
                            </span>
                            <span className="country-details-list-value">
                                {selectedMeasurement.start.latitude.toFixed(6)},{" "}
                                {selectedMeasurement.start.longitude.toFixed(6)}
                            </span>
                        </div>
                        <div className="country-details-list-item">
                            <span className="country-details-list-label">
                                End Point
                            </span>
                            <span className="country-details-list-value">
                                {selectedMeasurement.end.latitude.toFixed(6)},{" "}
                                {selectedMeasurement.end.longitude.toFixed(6)}
                            </span>
                        </div>
                    </div>
                </>
            ) : null}

            {measurementStart && !selectedMeasurement ? (
                <div className="country-details-list">
                    <div className="country-details-list-item">
                        <span className="country-details-list-label">
                            Start Point
                        </span>
                        <span className="country-details-list-value">
                            {measurementStart.latitude.toFixed(6)},{" "}
                            {measurementStart.longitude.toFixed(6)}
                        </span>
                    </div>
                    <div className="country-details-note">
                        Click a second point on the map to complete the
                        measurement.
                    </div>
                </div>
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
                    {selectedTimezoneInfo ? (
                        <>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">
                                    Local Time
                                </span>
                                <span className="country-details-list-value">
                                    {selectedTimezoneInfo.currentTime}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">
                                    UTC Offset
                                </span>
                                <span className="country-details-list-value">
                                    {selectedTimezoneInfo.offsetLabel}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">
                                    DST
                                </span>
                                <span className="country-details-list-value">
                                    {formatDstStatus(
                                        selectedTimezoneInfo.observesDst,
                                        selectedTimezoneInfo.isDstActive,
                                    )}
                                </span>
                            </div>
                            <div className="country-details-list-item">
                                <span className="country-details-list-label">
                                    Timezone
                                </span>
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
