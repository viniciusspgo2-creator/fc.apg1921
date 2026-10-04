import { CLUB } from "@/data/mock";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

/* ============================================================
 * SEO Enterprise core — single source of truth.
 * buildMetadata(): unique titles, meta description, keywords,
 * canonical + hreflang, Open Graph, Twitter cards, robots
 * directives and Geneva geo tags for every page.
 * JSON-LD builders: Organization/SportsTeam, WebSite, WebPage,
 * BreadcrumbList, FAQPage, SportsEvent, Article, ItemList.
 * ============================================================ */

export const SITE = {
  name: CLUB.name,
  shortName: CLUB.shortName,
  legalName: "Association des Portugais de Genève",
  foundedOn: CLUB.foundedOn,
  sport: "Football",
  competition: "ACGF — 4e ligue",
  city: "Genève",
  region: "CH-GE",
  country: "CH",
  latitude: "46.1897",
  longitude: "6.1769",
  email: "contact@fc-apg.ch",
  stadium: "Centre Sportif de Vessy",
  stadiumAddress: "Chemin de Vessy, 1206 Genève",
  logo: "/brand/apg-logo-original.png",
} as const;

/** Absolute site origin — set NEXT_PUBLIC_SITE_URL in production. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

/** BCP-47 + og:locale mapping for the six site languages. */
export const OG_LOCALES: Record<string, string> = {
  fr: "fr_CH",
  en: "en_US",
  de: "de_DE",
  pt: "pt_PT",
  es: "es_ES",
  it: "it_IT",
};

export type SeoPage = {
  locale: string;
  /** Path beginning with "/" — "" for the home page. */
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function buildMetadata(page: SeoPage): Metadata {
  const base = siteUrl();
  const canonical = `/${page.locale}${page.path}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${page.path}`]),
  ) as Record<string, string>;

  const ogImages = page.image
    ? [{ url: page.image, width: 1200, height: 630, alt: page.title }]
    : undefined;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    authors: [{ name: SITE.name, url: base }],
    creator: SITE.name,
    publisher: SITE.name,
    robots: page.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    alternates: {
      canonical,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}${page.path}` },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: SITE.name,
      locale: OG_LOCALES[page.locale] ?? page.locale,
      alternateLocale: routing.locales
        .filter((l) => l !== page.locale)
        .map((l) => OG_LOCALES[l] ?? l),
      type: page.type === "article" ? "article" : "website",
      ...(page.type === "article"
        ? {
            publishedTime: page.publishedTime,
            modifiedTime: page.modifiedTime,
          }
        : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: page.image ? [page.image] : undefined,
    },
    other: {
      "geo.region": SITE.region,
      "geo.placename": SITE.city,
      "geo.position": `${SITE.latitude};${SITE.longitude}`,
      ICBM: `${SITE.latitude}, ${SITE.longitude}`,
    },
  };
}

/* ------------------------------------------------------------ JSON-LD */

export type JsonLdObject = Record<string, unknown>;

/** SportsTeam + SportsClub — the club as a knowledge-graph entity. */
export function organizationJsonLd(opts?: {
  phone?: string;
  instagram?: string;
  email?: string;
  stadiumAddress?: string;
  stadiumName?: string;
}): JsonLdObject {
  const base = siteUrl();
  const sameAs = [opts?.instagram || CLUB.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["SportsTeam", "SportsClub"],
    "@id": `${base}/#organization`,
    name: SITE.name,
    alternateName: [SITE.shortName, SITE.legalName],
    legalName: SITE.legalName,
    foundingDate: SITE.foundedOn,
    foundingLocation: { "@type": "Place", name: SITE.city, address: { "@type": "PostalAddress", addressLocality: SITE.city, addressCountry: SITE.country } },
    sport: SITE.sport,
    url: `${base}/fr`,
    logo: `${base}${SITE.logo}`,
    image: `${base}${SITE.logo}`,
    email: opts?.email || SITE.email,
    ...(opts?.phone ? { telephone: opts.phone } : {}),
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: opts?.stadiumAddress || SITE.stadiumAddress,
      addressLocality: SITE.city,
      addressRegion: "Genève",
      addressCountry: SITE.country,
    },
    ...(opts?.stadiumName
      ? {
          location: {
            "@type": "SportsActivityLocation",
            name: opts.stadiumName,
            address: {
              "@type": "PostalAddress",
              streetAddress: opts.stadiumAddress || SITE.stadiumAddress,
              addressLocality: SITE.city,
              addressCountry: SITE.country,
            },
          },
        }
      : {}),
    areaServed: { "@type": "AdministrativeArea", name: "Canton de Genève" },
    knowsLanguage: ["fr", "pt", "en", "de", "es", "it"],
  };
}

export function websiteJsonLd(name: string): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name,
    alternateName: SITE.shortName,
    url: `${base}/fr`,
    inLanguage: routing.locales,
    publisher: { "@id": `${base}/#organization` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}/fr${item.path}`,
    })),
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  locale: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Blog";
  breadcrumb?: JsonLdObject;
}): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${base}/${opts.locale}${opts.path}#webpage`,
    name: opts.name,
    description: opts.description,
    url: `${base}/${opts.locale}${opts.path}`,
    inLanguage: opts.locale,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    ...(opts.breadcrumb ? { breadcrumb: opts.breadcrumb } : {}),
  };
}

export type FaqEntry = { q: string; a: string };

export function faqJsonLd(faq: FaqEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type NextMatchSeo = {
  competition: string;
  opponent: string;
  date: string;
  venue: "home" | "away";
  stadium: string;
};

/** SportsEvent for the next fixture — rich eligibility + GEO facts. */
export function sportsEventJsonLd(
  match: NextMatchSeo,
  stadiumAddress?: string,
): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `FC APG 1921 vs ${match.opponent}`,
    description: `Match de ${SITE.competition} entre le FC APG 1921 et ${match.opponent} au ${match.stadium || SITE.stadium}, ${SITE.city}.`,
    sport: SITE.sport,
    startDate: match.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: match.stadium || SITE.stadium,
      address: {
        "@type": "PostalAddress",
        streetAddress: stadiumAddress || SITE.stadiumAddress,
        addressLocality: SITE.city,
        addressCountry: SITE.country,
      },
    },
    organizer: { "@id": `${base}/#organization` },
    performer: { "@id": `${base}/#organization` },
    competitor: [
      { "@type": "SportsTeam", name: SITE.name },
      { "@type": "SportsTeam", name: match.opponent },
    ],
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
  published?: string;
  modified?: string;
  author: string;
  keywords?: string;
}): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${base}/${opts.locale}${opts.path}#article`,
    headline: opts.title,
    description: opts.description,
    url: `${base}/${opts.locale}${opts.path}`,
    mainEntityOfPage: `${base}/${opts.locale}${opts.path}`,
    inLanguage: opts.locale,
    image: opts.image ? [`${base}${opts.image}`] : [`${base}${SITE.logo}`],
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    author: { "@type": "Organization", name: opts.author },
    publisher: { "@id": `${base}/#organization` },
    articleSection: "Football — Genève / Suisse romande",
    ...(opts.keywords ? { keywords: opts.keywords } : {}),
    isPartOf: { "@id": `${base}/#website` },
  };
}

/** ItemList of the blog index — helps RAG systems enumerate content. */
export function itemListJsonLd(
  posts: { slug: string; title: string; excerpt: string }[],
): JsonLdObject {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Articles — football genevois et vie du club",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/fr/blog/${p.slug}`,
      name: p.title,
      description: p.excerpt,
    })),
  };
}
