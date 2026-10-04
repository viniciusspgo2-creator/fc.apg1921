import { defineRouting } from "next-intl/routing";

/**
 * FC APG 1921 — i18n routing (brief §7)
 * fr is the default locale; every locale is served under a prefix
 * (/fr, /en, /de, /pt, /es, /it). The root "/" is negotiated by the
 * proxy (Accept-Language, fallback fr).
 */
export const routing = defineRouting({
  locales: ["fr", "en", "de", "pt", "es", "it"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

/** Compact labels used by language switchers (native codes). */
export const LOCALE_CODES: Record<AppLocale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  pt: "PT",
  es: "ES",
  it: "IT",
};
