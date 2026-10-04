import { FlagStripe } from "@/components/brand/flag-stripe";
import { NewsCard } from "@/components/cards/news-card";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedNews } from "@/lib/content";
import {
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/types";

/* ============================================================
 * FC APG 1921 — /blog (DB-driven, 2026)
 * Dark header → tag filter (server-side via ?tag=) → news grid.
 * Zero client JS for filtering: instant, cacheable, fast.
 * ============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

const TAGS = ["all", "regional", "match-day", "mercato", "club", "communaute"] as const;

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();
  const posts = await getPublishedNews();

  const activeTag = tag && TAGS.includes(tag as (typeof TAGS)[number]) ? tag : "all";
  const filtered =
    activeTag === "all" ? posts : posts.filter((p) => p.tag === activeTag);

  const blogTitle = t("blog.title");
  const blogSubtitle = t("blog.subtitle");

  const tagLabel = (key: string) => {
    try {
      return t(`blog.tags.${key}`);
    } catch {
      return key;
    }
  };

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: blogTitle,
            description: blogSubtitle,
            path: "/blog",
            locale,
            type: "Blog",
            breadcrumb: breadcrumbJsonLd([
              { name: "Accueil", path: "" },
              { name: blogTitle, path: "/blog" },
            ]),
          }),
          ...(activeTag === "all" && posts.length > 0
            ? [itemListJsonLd(posts)]
            : []),
        ]}
      />

      {/* -------------------------------------------- page header */}
      <header className="apg-grain apg-diamonds relative bg-ink">
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16">
          <Reveal>
            <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
              <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
              {t("blog.label")}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("blog.title")}
            </h1>
            <FlagStripe className="mt-6 w-24" />
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              {t("blog.subtitle")}
            </p>
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------ tag filter */}
      <section className="bg-paper-soft py-14 sm:py-20" aria-label={t("blog.title")}>
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <nav aria-label={t("blog.label")} className="flex flex-wrap gap-2">
            {TAGS.map((key) => {
              const active = activeTag === key;
              const href = key === "all" ? "/blog" : `/blog?tag=${key}`;
              return (
                <a
                  key={key}
                  href={href}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "apg-focus inline-flex min-h-11 items-center border px-4 font-ui text-sm font-semibold uppercase tracking-[0.16em] transition-colors",
                    active
                      ? "border-apg-blue bg-apg-blue text-white"
                      : "border-ink/20 text-ink/60 hover:border-apg-blue hover:text-apg-blue",
                  )}
                >
                  {tagLabel(key)}
                </a>
              );
            })}
          </nav>

          {filtered.length === 0 ? (
            <p className="mt-14 text-center text-ink/50">{t("common.loading")}</p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i * 0.06, 0.3)} className="h-full">
                  <NewsCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
