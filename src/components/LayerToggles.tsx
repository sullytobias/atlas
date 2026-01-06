type Props = {
    showCoastlines: boolean;
    onToggleCoastlines: (v: boolean) => void;
    showSatellite: boolean;
    onToggleSatellite: (v: boolean) => void;
    showCapitals: boolean;
    onToggleCapitals: (v: boolean) => void;
};

export default function LayerToggles({
    showCoastlines,
    showSatellite,
    showCapitals,
    onToggleCoastlines,
    onToggleSatellite,
    onToggleCapitals,
}: Props) {
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 10,
                background: "white",
                padding: 8,
                borderRadius: 8,
                display: "flex",
                gap: 20,
            }}
        >
            <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={showCoastlines}
                    onChange={(e) => onToggleCoastlines(e.target.checked)}
                />
                Coastlines
            </label>
            <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={showSatellite}
                    onChange={(e) => onToggleSatellite(e.target.checked)}
                />
                Satellite
            </label>
            <label style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input
                    type="checkbox"
                    checked={showCapitals}
                    onChange={(e) => onToggleCapitals(e.target.checked)}
                />
                Capitals
            </label>
        </div>
    );
}