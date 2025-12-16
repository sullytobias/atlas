import type { ThemeConfig, ThemeId } from "../types/atlas";
import { HISTORICAL_THEME } from "./themes/historical/config";

export const THEME_ORDER: ThemeId[] = ["historical"];

export const THEME_CONFIG: Record<ThemeId, ThemeConfig> = {
  historical: HISTORICAL_THEME,
};