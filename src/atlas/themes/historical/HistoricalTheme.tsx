import { useState } from "react";
import Map from "../../../components/Map";
import Timeline from "../../../components/Timeline";
import { HISTORICAL_THEME } from "./config";

export default function HistoricalTheme() {
  const [periodIndex, setPeriodIndex] = useState<number>(0);

  return (
    <>
      <Map />
      <Timeline
        periods={HISTORICAL_THEME.periods}
        value={periodIndex}
        onChange={setPeriodIndex}
      />
    </>
  );
}