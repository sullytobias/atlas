type Props = {
  showCoastlines: boolean;
  onToggleCoastlines: (v: boolean) => void;
  showSatellite: boolean;
  onToggleSatellite: (v: boolean) => void;
};

export default function LayerToggles({ showCoastlines, showSatellite, onToggleCoastlines, onToggleSatellite }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        background: "white",
        padding: 12,
        borderRadius: 8,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={showCoastlines}
          onChange={(e) => onToggleCoastlines(e.target.checked)}
        />
        Coastlines
      </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={showSatellite}
          onChange={(e) => onToggleSatellite(e.target.checked)}
        />
        Satellite
      </label>
    </div>
  );
}