import type { ThemeConfig } from "../../../types/atlas";

export const HISTORICAL_THEME: ThemeConfig = {
  id: "historical",
  label: "Atlas historique",
  description: "Évolution du territoire sur le temps long",
  periods: [
    { id: "1900", label: "Vers 1900" },
    { id: "1950", label: "Vers 1950" },
    { id: "2000", label: "Vers 2000" },
    { id: "today", label: "Aujourd’hui" },
  ],
};