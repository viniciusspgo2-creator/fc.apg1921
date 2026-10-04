/**
 * ============================================================
 *  FC APG 1921 — STATIC CLUB DATA (2026 edition)
 *
 *  Only ground-truth facts and generic UI constants live here.
 *  Everything admin-managed (news, gallery, settings) now comes
 *  from the database (src/lib/content.ts) — edited in /admin.
 * ============================================================
 */

/* ------------------------------------------------------------
 * Club — GROUND TRUTH. Not mock unless flagged.
 * ------------------------------------------------------------ */
export const CLUB = {
  name: "FC Association des Portugais de Genève",
  shortName: "FC APG 1921",
  foundedOn: "1921-07-01", // ground truth
  city: "Genève",
  country: "Suisse",
  district: "Chêne-Bougeries / Vessy", // ground truth
  instagram: "https://www.instagram.com/fc.apg.1921/", // ground truth
  email: "contact@fc-apg.ch", // TODO: replace with real data (mock)
  emailIsMock: true,
  stadium: {
    name: "Centre Sportif de Vessy", // briefing marks it as mock
    address: "Chemin de Vessy, 1206 Genève", // TODO: replace with real data (mock)
    lat: 46.1897, // TODO: replace with real data (mock)
    lng: 6.1769, // TODO: replace with real data (mock)
    isMock: true,
  },
} as const;

/* ------------------------------------------------------------
 * Sponsors — generic placeholder names (home marquee).
 * ------------------------------------------------------------ */
// TODO: replace with real data
export const SPONSORS = [
  { id: "s01", name: "Partenaire Or 01", tier: "gold", isMock: true },
  { id: "s02", name: "Partenaire Or 02", tier: "gold", isMock: true },
  { id: "s03", name: "Partenaire Argent 01", tier: "silver", isMock: true },
  { id: "s04", name: "Partenaire Argent 02", tier: "silver", isMock: true },
  { id: "s05", name: "Partenaire Bronze 01", tier: "bronze", isMock: true },
  { id: "s06", name: "Partenaire Bronze 02", tier: "bronze", isMock: true },
] as const;

/* ------------------------------------------------------------
 * Misc
 * ------------------------------------------------------------ */

/** Fallback weather shown when Open-Meteo fails (never breaks UI). */
export const WEATHER_FALLBACK = {
  temperatureC: 13,
  code: 3, // overcast
  isMock: true,
} as const;

/** Contact form subjects — copy lives in locales. */
export const CONTACT_SUBJECTS = [
  "play",
  "sponsorship",
  "press",
  "info",
] as const;
