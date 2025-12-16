import type { Period } from "../types/atlas";

type Props = {
  periods: Period[];
  value: number;
  onChange: (index: number) => void;
};

export default function Timeline({ periods, value, onChange }: Props) {
  const safeValue = Math.min(Math.max(value, 0), periods.length - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        background: "white",
        padding: 12,
        borderRadius: 8,
        width: 280,
      }}
    >
      <input
        type="range"
        min={0}
        max={periods.length - 1}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
      <div style={{ marginTop: 8, fontWeight: 600 }}>
        {periods[safeValue]?.label ?? ""}
      </div>
    </div>
  );
}