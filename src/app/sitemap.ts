import { getPublishedNews } from "@/lib/content";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

/* ============================================================
 * Sitemap — every public route × every locale, hreflang-ready.
 * Blog slugs come from the DB (admin-managed) and each entry
 * carries its cover image and per-post lastModified. Never
 * throws: a cold/empty DB yields the static routes only.
 * ============================================================ */

const STATIC_ROUTES = [
  { path: "", priority: 1, freq: "weekly" as const },
  { path: "/sobre", priority: 0.9, freq: "monthly" as const },
  { path: "/galeria", priority: 0.8, freq: "monthly" as const },
  { path: "/blog", priority: 0.9, freq: "weekly" as const },
  { path: "/contato", priority: 0.9, freq: "monthly" as const },
  { path: "/mentions-legales", priority: 0.3, freq: "yearly" as const },
  { path: "/confidentialite", priority: 0.3, freq: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  let posts: Awaited<ReturnType<typeof getPublishedNews>> = [];
  try {
    posts = await getPublishedNews();
  } catch {
    posts = [];
  }

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    (route) =>
      routing.locales.map((locale) => ({
        url: `${base}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.freq,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${base}/${l}${route.path}`]),
          ) as Record<string, string>,
        },
      })),
  );

  const articleEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    const lastModified = (post.updatedAt ?? post.createdAt) || now;
    return routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${path}`]),
        ) as Record<string, string>,
      },
      ...(post.cover
        ? {
            images: [`${base}${post.cover}`],
          }
        : {}),
    }));
  });

  return [...staticEntries, ...articleEntries];
}
