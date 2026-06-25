import type { Country } from "@/data/tripData";

export interface CountryTheme {
  bg: string;
  bgDark: string;
  accent: string;
  accentText: string;
  flag: string;
  dotColor: string;
}

export const COUNTRY_THEMES: Record<Country, CountryTheme> = {
  Sweden: {
    bg: "#E8F0FE",
    bgDark: "#C7D7FC",
    accent: "#4285F4",
    accentText: "#1A56DB",
    flag: "🇸🇪",
    dotColor: "#4285F4",
  },
  Denmark: {
    bg: "#FDECEA",
    bgDark: "#F9C6C2",
    accent: "#E53935",
    accentText: "#C62828",
    flag: "🇩🇰",
    dotColor: "#E53935",
  },
  Netherlands: {
    bg: "#FEF0E6",
    bgDark: "#FDDAB8",
    accent: "#F57C00",
    accentText: "#E65100",
    flag: "🇳🇱",
    dotColor: "#F57C00",
  },
  Belgium: {
    bg: "#FEF7E6",
    bgDark: "#FDEDB8",
    accent: "#F9A825",
    accentText: "#F57F17",
    flag: "🇧🇪",
    dotColor: "#F9A825",
  },
  India: {
    bg: "#FFF3E0",
    bgDark: "#FFE0B2",
    accent: "#FF6F00",
    accentText: "#E65100",
    flag: "🇮🇳",
    dotColor: "#FF6F00",
  },
};

export function getTheme(country: Country): CountryTheme {
  return COUNTRY_THEMES[country];
}
