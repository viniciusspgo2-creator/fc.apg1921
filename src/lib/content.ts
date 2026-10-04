import { db } from "@/lib/db";

/* ============================================================
 * Content access layer (server only)
 * Reads admin-managed content from SQLite. Every getter falls
 * back gracefully (compile-time defaults in locales / constants)
 * so the public site never breaks if the DB is empty.
 * ============================================================ */

export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function getSettings(
  keys: string[],
): Promise<Record<string, string>> {
  try {
    const rows = await db.setting.findMany({ where: { key: { in: keys } } });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function getAllSettings(): Promise<
  { key: string; value: string; updatedAt: Date }[]
> {
  try {
    return await db.setting.findMany({ orderBy: { key: "asc" } });
  } catch {
    return [];
  }
}

/** Admin override for a translated string. Falls back to the locale JSON. */
export async function getSiteText(
  key: string,
  locale: string,
  fallback: string,
): Promise<string> {
  try {
    const row = await db.siteText.findUnique({
      where: { key_locale: { key, locale } },
    });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteTexts(
  locale: string,
): Promise<{ key: string; value: string }[]> {
  try {
    return await db.siteText.findMany({
      where: { locale },
      orderBy: { key: "asc" },
    });
  } catch {
    return [];
  }
}

export type GalleryRow = {
  id: string;
  url: string;
  title: string;
  category: string;
  sortOrder: number;
};

export async function getActiveGallery(): Promise<GalleryRow[]> {
  try {
    return await db.galleryImage.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        url: true,
        title: true,
        category: true,
        sortOrder: true,
      },
    });
  } catch {
    return [];
  }
}

export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  tag: string;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getPublishedNews(limit?: number): Promise<NewsRow[]> {
  try {
    return await db.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        cover: true,
        tag: true,
        sourceUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    return await db.newsPost.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export type PlayerRow = {
  id: string;
  name: string;
  position: string;
  number: number | null;
  photoUrl: string;
};

export async function getPlayers(limit = 12): Promise<PlayerRow[]> {
  try {
    return await db.player.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        position: true,
        number: true,
        photoUrl: true,
      },
      ...(limit ? { take: limit } : {}),
    });
  } catch {
    return [];
  }
}

/** YYYY-MM-DD in Europe/Zurich — the club's timezone. */
export function zurichDay(date = new Date()): string {
  // en-CA yields ISO-like YYYY-MM-DD reliably across runtimes.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getVisitStats() {
  const today = zurichDay();
  try {
    const [total, days] = await Promise.all([
      db.visit.aggregate({ _sum: { count: true } }),
      db.visit.findMany({ orderBy: { day: "desc" }, take: 30 }),
    ]);
    const todayRow = days.find((d) => d.day === today);
    return {
      today: todayRow?.count ?? 0,
      total: total._sum.count ?? 0,
      days: days
        .slice()
        .reverse()
        .map((d) => ({ day: d.day, count: d.count })),
    };
  } catch {
    return { today: 0, total: 0, days: [] as { day: string; count: number }[] };
  }
}
