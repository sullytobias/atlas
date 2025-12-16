export type ThemeId = "historical";

export type Period = {
  id: string;
  label: string;
};

export type ThemeConfig = {
  id: ThemeId;
  label: string;
  description: string;
  periods: Period[];
};