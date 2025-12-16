import type { ThemeId } from "../types/atlas";
import { THEME_CONFIG, THEME_ORDER } from "../atlas/registry";

type Props = {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
};

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        background: "white",
        padding: 12,
        borderRadius: 8,
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <label style={{ fontWeight: 600 }}>Thème</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ThemeId)}
      >
        {THEME_ORDER.map((id) => (
          <option key={id} value={id}>
            {THEME_CONFIG[id].label}
          </option>
        ))}
      </select>
    </div>
  );
}