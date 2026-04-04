import { useMapStore } from "../../store/loadingStore";
import OverlayPanel from "../OverlayPanel/OverlayPanel";
import "./EarthquakeVolcanoPanel.css";

function formatMag(mag: number): string {
    return mag.toFixed(1);
}

function formatDate(epochMs: number): string {
    if (!epochMs) return "Unknown";
    return new Date(epochMs).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    });
}

function formatElevation(meters: number): string {
    if (!meters) return "N/A";
    return `${meters.toLocaleString()} m`;
}

function magColor(mag: number): string {
    if (mag >= 7) return "#dc2626";
    if (mag >= 5) return "#f97316";
    if (mag >= 3) return "#fbbf24";
    return "#84cc16";
}

function magLabel(mag: number): string {
    if (mag >= 8) return "Major";
    if (mag >= 7) return "Strong";
    if (mag >= 6) return "Moderate";
    if (mag >= 5) return "Moderate";
    if (mag >= 4) return "Light";
    if (mag >= 3) return "Minor";
    return "Micro";
}

export default function EarthquakeVolcanoPanel() {
    const selectedEarthquake = useMapStore((s) => s.selectedEarthquake);
    const selectedVolcano = useMapStore((s) => s.selectedVolcano);
    const setSelectedEarthquake = useMapStore((s) => s.setSelectedEarthquake);
    const setSelectedVolcano = useMapStore((s) => s.setSelectedVolcano);

    if (selectedEarthquake) {
        const { mag, place, time, depth, url } = selectedEarthquake;
        const color = magColor(mag);

        return (
            <OverlayPanel
                ariaLabel="Earthquake details"
                eyebrow="Earthquake"
                title={`M${formatMag(mag)} — ${magLabel(mag)}`}
                description={place}
                onClose={() => setSelectedEarthquake(null)}
                leading={
                    <div
                        className="eq-mag-badge"
                        style={{ backgroundColor: color }}
                    >
                        {formatMag(mag)}
                    </div>
                }
            >
                <div className="evp-rows">
                    <div className="evp-row">
                        <span className="evp-label">Date</span>
                        <span className="evp-value">{formatDate(time)}</span>
                    </div>
                    <div className="evp-row">
                        <span className="evp-label">Depth</span>
                        <span className="evp-value">{depth.toFixed(1)} km</span>
                    </div>
                    <div className="evp-row">
                        <span className="evp-label">Location</span>
                        <span className="evp-value evp-coords">
                            {selectedEarthquake.lat.toFixed(3)}°,{" "}
                            {selectedEarthquake.lng.toFixed(3)}°
                        </span>
                    </div>
                </div>
                {url && (
                    <a
                        className="evp-link"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on USGS ↗
                    </a>
                )}
            </OverlayPanel>
        );
    }

    if (selectedVolcano) {
        const { name, country, type, lastEruption, elevation } = selectedVolcano;

        return (
            <OverlayPanel
                ariaLabel="Volcano details"
                eyebrow="Volcano"
                title={name}
                description={country}
                onClose={() => setSelectedVolcano(null)}
                leading={
                    <div className="volcano-badge">
                        🌋
                    </div>
                }
            >
                <div className="evp-rows">
                    <div className="evp-row">
                        <span className="evp-label">Type</span>
                        <span className="evp-value">{type || "Unknown"}</span>
                    </div>
                    <div className="evp-row">
                        <span className="evp-label">Elevation</span>
                        <span className="evp-value">{formatElevation(elevation)}</span>
                    </div>
                    <div className="evp-row">
                        <span className="evp-label">Last Eruption</span>
                        <span className="evp-value">{lastEruption}</span>
                    </div>
                    <div className="evp-row">
                        <span className="evp-label">Coordinates</span>
                        <span className="evp-value evp-coords">
                            {selectedVolcano.lat.toFixed(3)}°,{" "}
                            {selectedVolcano.lng.toFixed(3)}°
                        </span>
                    </div>
                </div>
            </OverlayPanel>
        );
    }

    return null;
}
