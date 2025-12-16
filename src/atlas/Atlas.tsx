import { useMemo, useState } from "react";
import type { ThemeId } from "../types/atlas";
import ThemePicker from "../components/ThemePicker";

import HistoricalTheme from "./themes/historical/HistoricalTheme";

const THEME_COMPONENTS: Record<ThemeId, React.ComponentType> = {
  historical: HistoricalTheme,
};

export default function Atlas() {
  const [themeId, setThemeId] = useState<ThemeId>("historical");

  const Theme = useMemo(() => THEME_COMPONENTS[themeId], [themeId]);

  return (
    <>
      <ThemePicker value={themeId} onChange={setThemeId} />
      <Theme />
    </>
  );
}